
import { createEngine } from "../../src/derivationEngine.js";
import { readJsonFromFile } from "spl-js-engine";
import { checkVersions, updatePackageJson, rollbackPackageJson } from "./utils.js";
import {
    bgYellow,
    bgGreen,
    gray,
    bold,
    red,
    underline,
    yellow
} from "kleur/colors";

import fs from "fs";
import path from "path";


export const createProduct = async (productPath, outputFolder = 'output', tmpFolder = 'tmp') => {

    const prodFile = readJsonFromFile(productPath);
    const packageFile = readJsonFromFile(path.join(process.cwd(), 'package.json'));
    const oldPackageFile = JSON.parse(JSON.stringify(packageFile));
    let packageJsonHasChanged = false;

    if (prodFile.modules) {
        const modulesFile = readJsonFromFile(path.join(process.cwd(), 'splModules.json'));

        const resCompare = checkVersions(prodFile, packageFile, modulesFile);

        if (resCompare.filter((el) => !el.sameVersion).length > 0) {
            console.error(red(bold(`\nThe product and the package.json have different versions for some modules:`)));

            resCompare.forEach((el) => {
                if (!el.sameVersion) {
                    // Pretty print the modules that have different versions, using colors to highlight the differences
                    console.log(bold(underline(`Module: ${el.module}`)));
                    console.log(`  Product version: ${yellow(el.prodVersion)}`);
                    console.log(`  Package version: ${yellow(el.splVersion)}\n`);
                }
            });

            // We will try to update the package.json with the versions of the product
            console.log(`\n${bgYellow('Updating package.json with the versions of the product')}`);

            await updatePackageJson(resCompare.filter((el) => !el.sameVersion), packageFile);
            packageJsonHasChanged = true;
        }
    }

    // check versions of modules and the dependencies of the package.json

    await fs.promises.rm(tmpFolder, { recursive: true, force: true }).then(() => {
        console.log(`Cleaning ${tmpFolder}`);
    }).catch(error => {
        console.error(error.message);
    });

    await fs.promises.rm(outputFolder, { recursive: true, force: true }).then(() => {
        console.log(`Cleaning ${outputFolder}`);
    }).catch(error => {
        console.error(error.message);
    });

    await createEngine.then((engine) => {
        engine.generateProduct(outputFolder, readJsonFromFile(productPath)).then(() => {
            console.log(bgGreen(`Product generated in ${outputFolder}`));
        });
    });

    if (packageJsonHasChanged) {
        // Timeout to avoid console.log messages to be mixed
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 100);
        });
        console.log(`\n${gray('Rolling back the SPL to the original state')}`);
        await rollbackPackageJson(oldPackageFile);
    }

    process.exit(0);
}