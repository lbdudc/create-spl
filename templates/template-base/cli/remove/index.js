import { bold, green, red, yellow } from "kleur/colors";
import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { sep } from "path";
import { findUvlFile } from "../utils.js";
import path from "path";

/**
 * Remove modules from the package.json file, the base.uvl file and uninstall them.
 * @param {string[]} packages
 * @param {object} options
 */

async function remove(packages, { flags }) {

    console.log(`${bold('Deleting modules:')} ${green(packages.join(", "))}\n`);

    const uvlFiles = await findUvlFile(packages, { flags }, { flags });

    try {
        await removeModulesFromBaseUvl(uvlFiles.map(uvl => uvl.uvlName));
    } catch (e) {
        console.error(red(`Error deleting modules from base.uvl file: ${e.message}`));
        return;
    }

    try {
        await removePackageJsonDependencies(packages);
    } catch (e) {
        console.error(red(`Error deleting modules: ${e.message}`));
        return;
    }

    try {
        await removeSplModulesFile(uvlFiles);
    } catch (e) {
        console.error(red(`Error deleting modules: ${e.message}`));
        return
    }

    console.log(`\n${green('Modules deleted successfully!')}`);
}

async function removeModulesFromBaseUvl(packages) {

    const baseUvlPath = process.cwd() + sep + "base.uvl";

    try {
        const baseUvl = readFileSync(baseUvlPath, "utf-8");
        const lines = baseUvl.split("\n");

        let newBaseUvl = "";
        let hasChanged = false;

        lines.forEach(line => {
            // if line includes any of the packages array elements, remove the line
            if (!packages.some(pck => line.includes(pck))) {
                newBaseUvl += line + "\n";
            } else {
                hasChanged = true;
            }
        });

        if (hasChanged === false) {
            console.warn(yellow("No changes were made to the base.uvl file."));
            return;
        }

        writeFileSync(baseUvlPath, newBaseUvl);
    } catch (e) {
        console.error(red(`Error deleting modules from base.uvl file: ${e.message}`));
        return;
    }
}


async function removePackageJsonDependencies(packages) {
    const pckg = JSON.parse(readFileSync(process.cwd() + sep + "package.json", "utf-8"));

    const willChange = packages.some(pck => pckg.dependencies[pck]);

    if (!willChange) {
        console.warn(yellow("No changes were made to the package.json file."));
        return;
    }

    try {
        packages.forEach(pck => {
            delete pckg.dependencies[pck];
        });
    } catch (e) {
        console.error(red(`Error deleting packages from package.json file: ${e.message}`));
        return;
    }

    writeFileSync(process.cwd() + sep + "package.json", JSON.stringify(pckg, null, 2));

    try {
        const child = execSync("npm install", { stdio: "inherit" });
    } catch (e) {
        console.error(red(`Error installing packages: ${e.message}`));
        return;
    }
}

async function removeSplModulesFile(uvlFiles) {
    const splModulesPath = path.join(process.cwd(), "splModules.json");

    try {
        const splModules = JSON.parse(readFileSync(splModulesPath, "utf-8"));
        const newSplModules = splModules.filter(splModule => !uvlFiles.some(uvl => uvl.uvlName === splModule.name));

        writeFileSync(splModulesPath, JSON.stringify(newSplModules, null, 2));
    } catch (e) {
        console.error(red(`Error deleting modules from spl_modules.json file: ${e.message}`));
        return;
    }
}

export { remove };

