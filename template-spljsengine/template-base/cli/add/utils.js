import { bold, cyan, dim, green, magenta, red, yellow } from "kleur/colors";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { execSync } from "child_process";
import path, { sep } from "path";
import { findUvlFile } from "../utils.js";

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
        const json = JSON.parse(pckg);

        names.forEach((name) => {
            // if the package is already in the dependencies, skip it
            if (json.dependencies[name]) {
                return;
            }

            // if its a local package, add the path to the package.json file
            if (name.startsWith("file:")) {
                json.dependencies[name.split(path.sep).pop()] = name;
                return;
            }

            // if its a git repository, add the git url to the package.json file
            // delete the .git extension
            if (name.startsWith("git+")) {
                const gitUrl = name.split("git+")[1];
                json.dependencies[gitUrl.split("/").pop().split(".git")[0]] = name;
                return;
            }

            // if it has a version, add it to the package.json file
            if (name.includes(":")) {
                json.dependencies[name.split(":")[0]] = name.split(":")[1];
                return;
            }

            // if it has no version, add it to the package.json file
            json.dependencies[name] = "*";
        });

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

        console.log(`\n${cyan("Checking")} ${bold(name)} ${dim("package")}`);
        console.log(process.cwd() + `${sep}node_modules${sep}${name}${sep}src${sep}platform`);


        readdirSync(process.cwd() + `${sep}node_modules${sep}${name}${sep}src${sep}platform`).forEach((file) => {
            console.log(`  ${magenta("Found")} ${bold(file)}`);
            // if the file is in the files array, remove it from the array
            if (files.includes(file) || files.includes(file.split(".")[1])) {
                files = files.filter((f) => f !== file);
            }

            // check if at least one of the files is a.uvl file
            if (file.includes(".uvl")) {
                console.log(`  ${green("Found")} ${bold(file)}`);
                files = [];
            }
        });

        // check if there is a folder named "code"
        try {
            readdirSync(process.cwd() + `${sep}node_modules${sep}${name}${sep}src${sep}platform${sep}code`);
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

    if (uvl == null) {
        console.log("Error reading base.uvl file");
        return;
    }

    let newUvl = uvl;

    // find a .uvl file in the node_modules folder
    const uvlFiles = await findUvlFile(names, { flags });

    uvl.split("\n").forEach((line, index) => {
        // if it finds the features line, then insert the names before it
        // if line includes "features" in the next line, then insert the names in the next line

        if (uvl.split("\n")[index + 1] && uvl.split("\n")[index + 1].includes("features")) {
            // insert it before the features line
            let newLine = line + "\n" + names.map((name) =>
                `    ${uvlFiles.filter((file) => file.name === name)[0].uvlName
                }`).join("\n");
            newUvl = newUvl.replace(line, newLine);
        }

        // if it finds the project name, and the next line has the "mandatory" key
        // then insert the names in the next line after the mandatory key
        if (line.includes(projectName) || line.includes("MainSPL")) {
            if (uvl.split("\n")[index + 1].includes("mandatory")) {
                let newLine = uvl.split("\n")[index + 1] + "\n" + names.map((name) => `            ${uvlFiles.filter((file) => file.name === name)[0].uvlName + "." + uvlFiles.filter((file) => file.name === name)[0].uvlModuleName
                    }`).join("\n");
                newUvl = newUvl.replace(uvl.split("\n")[index + 1], newLine);
            }
        }
    });


    try {
        writeFileSync(process.cwd() + sep + "base.uvl", newUvl);
    } catch (e) {
        console.log("Error writing to base.uvl file");
        return;
    }
}

async function changeSplJsEngine(names, { flags }) {

    console.log(`\n${cyan("Changing")} ${bold("splModules.json")} ${dim("file")}`);

    const uvlFiles = await findUvlFile(names, { flags });

    if (uvlFiles.length === 0) {
        console.log("Error finding .uvl files in the packages");
        return;
    }

    try {
        const splModulesPath = path.join(process.cwd(), 'splModules.json');
        let modules = readFileSync(splModulesPath, "utf-8");
        modules = JSON.parse(modules);

        uvlFiles.forEach((uvl) => {
            let module = {
                name: uvl.uvlName,
                nameProject: uvl.name
            };
            modules.push(module);
        });

        writeFileSync(splModulesPath, JSON.stringify(modules, null, 2));

        console.log(`\n${green("splModules.json file changed successfully!")}`);
    }
    catch (e) {
        console.log(`Error reading splModules.json file: ${e.message}`);
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