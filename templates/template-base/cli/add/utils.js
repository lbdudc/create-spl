import { bold, cyan, dim, green, magenta, yellow, red } from "kleur/colors";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { modifyDependenciesToPackageJon } from "../../scripts/index.js";
import { execSync } from "child_process";
import path, { sep } from "path";
import { findUvlFile } from "../utils.js";
import { modifyComponentsJsonFile, modifyUvlFeatures } from "../../scripts/lib/check.js";

/**
 * Function that adds dependency to the project
 * It can be an npm package, a local package, or a git repository
 * @param {string[]} names - The names of the packages to add
 * @param {Object} flags - The flags object
 * @returns {Promise<void>}
 */
async function addDependency(names) {

    // add the packages to the package.json file
    try {
        const pckg = readFileSync(process.cwd() + sep + "package.json", "utf-8");
        const json = modifyDependenciesToPackageJon(JSON.parse(pckg), names);

        if (!json) {
            console.log("Error modifying package.json file");
            return;
        }

        writeFileSync(process.cwd() + sep + "package.json", JSON.stringify(json, null, 2));
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


async function rollBackAddDependency(names) {

    console.log(`\n${bold('Rolling back adding packages:')} ${green(names)}`);
    try {
        const pckg = readFileSync(process.cwd() + sep + "package.json", "utf-8");
        const json = JSON.parse(pckg);

        names.forEach((name) => {
            delete json.dependencies[name];
        });

        writeFileSync(process.cwd() + sep + "package.json", JSON.stringify(json, null, 2));
    } catch (e) {
        console.log(`Error removing packages from package.json file: ${e.message}`);
        return;
    }

    // uninstall the packages via npm uninstall and show the output in the console in real time
    try {
        const child = execSync(`npm uninstall ${names.join(" ")}`, { stdio: "inherit" });
    } catch (e) {
        console.log(`Error uninstalling packages: ${e.message}`);
        return;
    }
}

/**
 * Function that checks if the SPL package is valid in the node_modules folder
 * @param {string[]} names - The names of the packages to check
 * @returns {Promise<boolean>} - The result of the check
 */
async function checkSPLPackage(names, { flags }) {

    let validPackages = [];

    names.forEach((name) => {
        let files = ["config.json", "extra.js", "transformation.js"];
        if (name.startsWith("file:") || name.startsWith("git+")) {
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

        readdirSync(process.cwd() + `${sep}node_modules${sep}${name}`).forEach((file) => {
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
            readdirSync(process.cwd() + `${sep}node_modules${sep}${name}${sep}code`);
        } catch (e) {
            console.log(`\n${red('Missing code folder in')} ${bold(name)}`);
            validPackages[name] = false;
            return
        }

        if (files.length > 0) {
            console.log(`\n${red('Missing files in')} ${bold(name)}: ${red(files)}`);
            validPackages[name] = false;
            return
        }

        validPackages[name] = true;
    });

    return Object.keys(validPackages).map((key) => {
        return {
            name: key,
            valid: validPackages[key]
        };
    });
}

async function changeUvlFile(names, { flags }) {

    let projectName = null;

    const pckg = readFileSync(process.cwd() + sep + "package.json", "utf-8");
    projectName = JSON.parse(pckg).name;

    if (projectName == null) {
        console.log("Error reading package.json file");
        return;
    }

    let uvl = null;
    uvl = readFileSync(process.cwd() + sep + "base.uvl", "utf-8");

    // find a .uvl file in the node_modules folder
    const uvlFiles = await findUvlFile(names, { flags });
    const newUvl = await modifyUvlFeatures(uvl, names, uvlFiles, projectName, { flags });

    try {
        writeFileSync(process.cwd() + sep + "base.uvl", newUvl);
    } catch (e) {
        console.log("Error writing to base.uvl file");
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
        const splModulesPath = path.join(process.cwd(), 'modules.json');
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