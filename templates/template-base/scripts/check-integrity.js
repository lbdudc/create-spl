import { bold, cyan, dim } from "kleur/colors";

// check if all the modules and files are valid
console.log(`\n${cyan("Checking")} ${bold("modules")} ${dim("integrity")}`);


// Read the modules.json file
// Chack in node_modules if the modules are valid
// Check if the files are valid


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