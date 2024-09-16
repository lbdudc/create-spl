
import { createEngine } from "../../src/derivationEngine.js";
import { readJsonFromFile } from "spl-js-engine";
import fs from "fs";

function finish(outputZip) {
    console.log(`Product generated at ${outputZip}`);
    process.exit(0);
};

export const createProduct = async (productPath, outputFolder = 'output', tmpFolder = 'tmp') => {

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
        engine.generateProduct(outputFolder, readJsonFromFile(productPath)).then(finish);
    });
}