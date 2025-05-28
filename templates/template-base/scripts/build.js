import path from 'path';
import { readFileSync, writeFileSync } from "fs";
import { PACKAGE_JSON_FILENAME, MODULES_FILENAME, FM_FILENAME } from '../src/consts/index.js';
import { bold, green, cyan } from "kleur/colors";
import { printModules } from '../src/utils/log-utils.js';
import UVLFeatureModel from 'spl-js-engine/src/feature-model/feature-model-uvl.js';

// This function lets you sync model.uvl with modules.json and package.json

const buildSPL = () => {

    console.log(`${bold('Building SPL project')}\n`);

    let packageJson, modulesJson, fmUVL = null;

    // Read all needed files: package.json, modules.json, model.uvl
    try {
        const pckgJsonFile = readFileSync(path.join(process.cwd(), PACKAGE_JSON_FILENAME), "utf-8");
        packageJson = JSON.parse(pckgJsonFile);

        const modulesJsonFile = readFileSync(path.join(process.cwd(), MODULES_FILENAME), "utf-8");
        modulesJson = JSON.parse(modulesJsonFile)

        const fmFile = readFileSync(path.join(process.cwd(), FM_FILENAME), "utf-8");
        fmUVL = fmFile;
    } catch (e) {
        console.error("Error reading files", e);
        return;
    }

    if (!packageJson || !modulesJson || !fmUVL) {
        if (!packageJson) console.error(`Error reading ${PACKAGE_JSON_FILENAME}`);
        if (!modulesJson) console.error(`Error reading ${MODULES_FILENAME}`);
        if (!fmUVL) console.error(`Error reading ${FM_FILENAME}`);
        return;
    }

    console.log(` - Files loaded: ${green(PACKAGE_JSON_FILENAME)}, ${green(MODULES_FILENAME)}, ${green(FM_FILENAME)}`);

    // TODO: validate fmUVL using uvljsparser
    // const isValid = validate(fmUVL, modulesJson);

    // if (!isValid) {
    //     console.warn(` - Feature model: ${red(FM_FILENAME)} is not valid, please check your Feature Model`);
    //     return;
    // }

    console.log(` - Feature model: ${green(FM_FILENAME)} is valid`);

    // Get all imports from model.uvl
    const uvlFmImports = UVLFeatureModel.getUVLImports(fmUVL);

    // Update package.json with imports
    uvlFmImports.forEach((mod) => {
        delete packageJson.dependencies[mod.name];
    });

    uvlFmImports.forEach((imp) => {

        // if the import is "git:", change it to "git+"
        if (imp.from.startsWith('git:')) {
            imp.from = imp.from.replace('git:', 'git+');
            imp.type = 'git';
        }

        // if the import starts with npm:, delete it
        if (imp.from.startsWith('npm:')) {
            imp.from = imp.from.replace('npm:', '');

            const index = imp.from.indexOf(':');
            if (index !== -1) {
                imp.from = imp.from.substring(index + 1, imp.from.length);
            }

            imp.type = 'npm';
        }

        // if the import starts with file:, change it to file://
        if (imp.from.startsWith('file:')) {
            imp.from = imp.from.replace('file:', '');
            imp.type = 'file';
        }


        imp.type = imp.type || 'file';

        packageJson.dependencies[imp.name] = imp.from;
    });

    // Update modules.json with imports
    const newModulesJson = [];

    uvlFmImports.forEach((imp) => {
        newModulesJson.push(imp);
    });


    // Write all the files
    try {
        writeFileSync(path.join(process.cwd(), PACKAGE_JSON_FILENAME), JSON.stringify(packageJson, null, 2));
        writeFileSync(path.join(process.cwd(), MODULES_FILENAME), JSON.stringify(newModulesJson, null, 2));

        console.log(` - Files updated: ${green(PACKAGE_JSON_FILENAME)}, ${green(MODULES_FILENAME)}`);
    } catch (e) {
        console.error("Error writing files", e);
    }

    console.log('\n' + cyan('SPL project built:'));

    printModules('Old', modulesJson);
    printModules('New', newModulesJson);
}


buildSPL();