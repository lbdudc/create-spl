import { bold, cyan, dim, green, magenta, red, yellow } from "kleur/colors";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { execSync } from "child_process";
import path from "path";

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
        const pckg = readFileSync(process.cwd() + "/package.json", "utf-8");
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
            if (name.startsWith("git+")) {
                json.dependencies[name.split("/").pop()] = name;
                return;
            }

            // if its a normal npm package, check if it has a version
            // if not, add the latest version
            if (!name.includes("@")) {
                json.dependencies[name] = "latest";
                return;
            }

            // if it has a version, add it to the package.json file
            json.dependencies[name.split("@")[0]] = name.split("@")[1];
        });

        writeFileSync(process.cwd() + "/package.json", JSON.stringify(json, null, 2));
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
        const pckg = readFileSync(process.cwd() + "/package.json", "utf-8");
        const json = JSON.parse(pckg);

        names.forEach((name) => {
            delete json.dependencies[name];
        });

        writeFileSync(process.cwd() + "/package.json", JSON.stringify(json, null, 2));
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
        let files = ["package.json", "config.json", "extra.js", "model.uvl", "transformation.js"];
        if (name.startsWith("file:") || name.startsWith("git+")) {
            name = name.split("/").pop();
        }

        readdirSync(process.cwd() + `/node_modules/${name}`).forEach((file) => {
            // if the file is in the files array, remove it from the array
            if (files.includes(file)) {
                files = files.filter((f) => f !== file);
            }
        });

        // check if there is a folder named "code"
        try {
            readdirSync(process.cwd() + `/node_modules/${name}/code`);
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

    const pckg = readFileSync(process.cwd() + "/package.json", "utf-8");
    projectName = JSON.parse(pckg).name;

    if (projectName == null) {
        console.log("Error reading package.json file");
        return;
    }

    let uvl = null;
    uvl = readFileSync(process.cwd() + "/base.uvl", "utf-8");

    if (uvl == null) {
        console.log("Error reading base.uvl file");
        return;
    }



    let newUvl = uvl;

    uvl.split("\n").forEach((line, index) => {
        if (line.includes("imports")) {
            // insert a new line with names variable
            let newLine = line + "\n" + names.map((name) => `    ${name}`).join("\n");
            newUvl = newUvl.replace(line, newLine);
        }

        // if it finds the project name, and the next line has the "mandatory" key
        // then insert the names in the next line after the mandatory key
        if (line.includes(projectName) && uvl.split("\n")[index + 1].includes("mandatory")) {
            let newLine = uvl.split("\n")[index + 1] + "\n" + names.map((name) => `            ${name}`).join("\n");
            newUvl = newUvl.replace(uvl.split("\n")[index + 1], newLine);
        }
    });


    try {
        writeFileSync(process.cwd() + "/base.uvl", newUvl);
    } catch (e) {
        console.log("Error writing to base.uvl file");
        return;
    }
}




export {
    addDependency,
    changeUvlFile,
    checkSPLPackage,
    rollBackAddDependency
}