import { bold, cyan, dim, green, red } from "kleur/colors";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { modifyDependenciesToPackageJon } from "../../scripts/index.js";
import { execSync } from "child_process";
import path from "path";
import { findUvlFile } from "../utils.js";
import { modifyComponentsJsonFile, modifyUvlFeatures } from "../../scripts/lib/check.js";
import { PACKAGE_JSON_FILENAME, FM_FILENAME, SPL_JS_ENGINE_FILENAME, SPL_MODULE_CODE_FOLDER_NAME } from "../../scripts/lib/consts.js";

/**
 * Function that adds dependency to the project
 * It can be an npm package, a local package, or a git repository
 * @param {string} name - The names of the packages to add
 * @param {Object} flags - The flags object
 * @returns {Promise<void>}
 */
async function addDependency(module) {

    // add the packages to the package.json file
    try {
        const pckg = readFileSync(path.join(process.cwd(), PACKAGE_JSON_FILENAME), "utf-8");
        const json = modifyDependenciesToPackageJon(JSON.parse(pckg), module);

        if (!json) {
            console.log("Error modifying package.json file");
            return;
        }

        writeFileSync(path.join(process.cwd(), PACKAGE_JSON_FILENAME), JSON.stringify(json, null, 2));
    } catch (e) {
        console.log(`Error adding packages to package.json file: ${e.message}`);
        return;
    }

    // install the packages via npm install and show the output in the console in real time
    try {
        const child = execSync("npm install", { stdio: "inherit" });
    } catch (e) {
        console.log(`Error installing packages: ${e.message}`);
        return;
    }

    console.log(`\n${green("Packages added successfully!")}`);
}


async function rollBackAddDependency(name) {

    console.log(`\n${bold('Rolling back adding packages:')} ${green(name)}`);
    try {
        const pckg = readFileSync(path.join(process.cwd(), PACKAGE_JSON_FILENAME), "utf-8");
        const json = JSON.parse(pckg);

        delete json.dependencies[name];

        writeFileSync(path.join(process.cwd(), PACKAGE_JSON_FILENAME), JSON.stringify(json, null, 2));
    } catch (e) {
        console.log(`Error removing packages from package.json file: ${e.message}`);
        return;
    }

    // uninstall the packages via npm uninstall and show the output in the console in real time
    try {
        const child = execSync(`npm uninstall ${name}`, { stdio: "inherit" });
    } catch (e) {
        console.log(`Error uninstalling packages: ${e.message}`);
        return;
    }
}

/**
 * Function that checks if the SPL package is valid in the node_modules folder
 * @param {string} name - The names of the packages to check
 * @returns {Promise<boolean>} - The result of the check
 */
async function checkSPLPackage(name, { flags }) {

    let files = ["config.json", "extra.js", "transformation.js"];

    if (name.startsWith("file:") || name.startsWith("git:")) {
        name = name.split("/").pop();
        // delete the .git extension
        if (name.includes(".git")) {
            name = name.split(".git")[0];
        }
    }

    if (name.includes(":")) {
        name = name.split(":")[0];
    }

    console.log(`\n${cyan("Checking")} ${bold(name)} ${dim("module")}`);

    readdirSync(path.join(process.cwd(), "node_modules", name)).forEach((file) => {
        // if the file is in the files array, remove it from the array
        if (files.includes(file) || files.includes(file.split(".")[1])) {
            files = files.filter((f) => f !== file);
        }

        // check if at least one of the files is a.uvl file
        if (file.includes(".uvl")) {
            files = [];
        }
    });

    // check if there is a folder named "code"
    try {
        readdirSync(path.join(process.cwd(), "node_modules", name, SPL_MODULE_CODE_FOLDER_NAME));
    } catch (e) {
        console.log(`\n${red('Missing code folder in')} ${bold(name)}`);
        return false;
    }

    if (files.length > 0) {
        console.log(`\n${red('Missing files in')} ${bold(name)}: ${red(files)}`);
        return false;
    }

    return true;
}

async function changeUvlFile(module, { flags }) {

    let projectName = null;

    const pckg = readFileSync(path.join(process.cwd(), PACKAGE_JSON_FILENAME), "utf-8");
    projectName = JSON.parse(pckg).name;

    if (projectName == null) {
        console.log("Error reading package.json file");
        return;
    }

    let uvl = null;
    uvl = readFileSync(path.join(process.cwd(), FM_FILENAME), "utf-8");

    const newUvl = await modifyUvlFeatures(uvl, module, projectName, { flags });

    try {
        writeFileSync(path.join(process.cwd(), FM_FILENAME), newUvl);
    } catch (e) {
        console.log("Error writing to model.uvl file");
        return;
    }
}

async function changeSplJsEngine(names, { flags }) {

    const uvlFiles = await findUvlFile(names, { flags });

    if (uvlFiles.length === 0) {
        console.log("Error finding .uvl files in the packages");
        return;
    }

    try {
        const splModulesPath = path.join(process.cwd(), SPL_JS_ENGINE_FILENAME);
        let modules = readFileSync(splModulesPath, "utf-8");
        modules = JSON.parse(modules);

        const newModules = modifyComponentsJsonFile(uvlFiles, modules);

        writeFileSync(splModulesPath, JSON.stringify(newModules, null, 2));

    }
    catch (e) {
        console.log(`Error reading modules.json file: ${e.message}`);
        return;
    }
}

export {
    addDependency,
    changeUvlFile,
    changeSplJsEngine,
    checkSPLPackage,
    rollBackAddDependency
}