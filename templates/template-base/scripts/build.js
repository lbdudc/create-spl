import path from 'path';
import { readFileSync, writeFileSync } from "fs";
import { PACKAGE_JSON_FILENAME, MODULES_FILENAME, FM_FILENAME } from '../src/consts/index.js';
import { bold, green, cyan } from "kleur/colors";
import { printModules } from '../src/utils/log-utils.js';

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
    const imports = getImports(fmUVL, true);

    // Update package.json with imports
    modulesJson.forEach((mod) => {
        delete packageJson.dependencies[mod.name];
    });

    imports.forEach((imp) => {
        packageJson.dependencies[imp.name] = imp.url;
    });

    // Update modules.json with imports
    // keep always the first element of the components array
    const mainComponent = modulesJson.find((mod) => mod.name === "main_component");

    if (!mainComponent) {
        console.error("Error: main_component not found in modules.json");
        return;
    }

    const newModulesJson = [];
    newModulesJson.push(mainComponent);

    imports.forEach((imp) => {
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


// TODO: change this to use uvljsparser
function getImports(fmUVL, deep = false) {
    return [
        {
            name: "map_viewer",
            url: "git+https://gitlab.lbd.org.es/modularspl/spl-modules/map-viewer-component.git",
            type: "git",
            alias: "mv"
        },
        {
            name: "user_management",
            url: "git+https://gitlab.lbd.org.es/modularspl/spl-modules/user-management-component.git",
            type: "git",
        }
    ];
}


buildSPL();