import { bold, cyan, green } from "kleur/colors";
import { readFileSync } from "fs";
import { readdirSync } from "fs";
import path from "path";
import { PACKAGE_JSON_FILENAME, MODULES_FILENAME, FM_FILENAME, SPL_MODULE_CODE_FOLDER_NAME } from "../src/consts/index.js";
import { formatModulesTableWithErrors } from "../src/utils/log-utils.js";


const checkSPLIntegrity = () => {

    console.log(`|---------------------------|`);
    console.log(`|   ${cyan("Checking")} SPL integrity  |`);
    console.log(`|---------------------------|\n`);

    console.log(` - ${bold("Checking")} basic files: ${green('')}`);

    // Read all needed files: package.json, modules.json, model.uvl
    let packageJson, modulesJson, fmUVL;

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

    // Check if the files are valid
    if (!packageJson || !modulesJson || !fmUVL) {
        console.error("Error reading files");
        return;
    }

    console.log(`     Basic Files Found! ${green(PACKAGE_JSON_FILENAME)}, ${green(MODULES_FILENAME)}, ${green(FM_FILENAME)}`);
    console.log(`\n - ${bold("Checking")} modules`);

    const modulesChecked = [];

    modulesJson.forEach((module, idx) => {

        let isMainComponent = idx == 0 ? true : false;
        let error = false;
        let errorMessages = [];

        // Check if the module is valid
        if (!module.name || !module.from) {
            error = true;
            errorMessages.push(`Name or URL is missing`);
        }

        // Check if the module is valid in the node_modules folder
        const { isValid, errors, fmValid } = checkSPLPackage(module.name, isMainComponent, { flags: {} });
        if (!isValid) {
            error = true;
            errors.forEach(e => errorMessages.push(e));
        }

        modulesChecked.push({
            name: module.name,
            isValid: !error && fmValid,
            fmValid: fmValid,
            errors: errorMessages
        });
    });

    console.log(formatModulesTableWithErrors(modulesChecked));

    return modulesChecked;
}

checkSPLIntegrity();


/**
 * Function that checks if the SPL package is valid in the node_modules folder
 * @param {string} name - The names of the packages to check
 * @returns {Object} - An object with the isValid property and the errors property
 */
function checkSPLPackage(name, isMainComponent, { flags }) {

    let files = isMainComponent == true ? ["config.json", "extra.js", "transformation.js", "model.uvl"] : ["model.uvl"]
    let error = false;
    let errorsInModule = [];

    try {
        readdirSync(path.join(process.cwd(), "node_modules", name)).forEach((file) => {
            // if the file is in the files array, remove it from the array
            if (files.includes(file) || files.includes(file.split(".")[1])) {
                files = files.filter((f) => f !== file);
            }

        });

        if (files.length > 0) {
            error = true;
            files.forEach(f => errorsInModule.push(`Missing file: ${f}`));
        }
    } catch (e) {
        error = true;
        errorsInModule.push(`Module ${name} not found in node_modules`);
    };

    try {
        readdirSync(path.join(process.cwd(), "node_modules", name, SPL_MODULE_CODE_FOLDER_NAME));
    } catch (e) {
        error = true;
        errorsInModule.push(`Module ${name} does not have a ${SPL_MODULE_CODE_FOLDER_NAME} folder`);
    }

    // TODO: Check if the model.uvl file is valid



    return {
        isValid: !error,
        fmValid: true,
        errors: errorsInModule
    };
}