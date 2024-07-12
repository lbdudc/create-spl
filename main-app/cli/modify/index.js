import { bold, green, red, yellow } from "kleur/colors";
import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { sep } from "path";

/**
 * Function to modify the package.json file, changes the version of the package, and updates the dependencies.
 * @param {string[]} packages
 * @param {object} options
 */

async function modify(packages, { flags }) {

    console.log(`${bold('Modifying package:')} ${green(packages.join(": "))}\n`);

    let oldDepVersion = null;

    try {
        const pckg = JSON.parse(readFileSync(process.cwd() + sep + "package.json", "utf-8"));

        // modify the version of the package
        oldDepVersion = pckg.dependencies[packages[0]];
        pckg.dependencies[packages[0]] = packages[1];

        writeFileSync(process.cwd() + sep + "package.json", JSON.stringify(pckg, null, 2));

        // install the packages via npm install and show the output in the console in real time
        try {
            const child = execSync("npm install", { stdio: "inherit" });
        } catch (e) {
            console.error(red(`Error installing packages: ${e.message}`));
            await rollbackModifyDependency(packages[0], oldDepVersion);
            return;
        }
    } catch (e) {
        console.error(red(`Error modifying packages to package.json file: ${e.message}`));
        return;
    }

    console.log(`\n${green('Package modified successfully!')}`);
}

/**
 * Function to rollback the modification of the package.json file.
 * @param {string} package
 * @param {string} oldVersion
 */
async function rollbackModifyDependency(pck, oldVersion) {
    try {
        const pckg = JSON.parse(readFileSync(process.cwd() + sep + "package.json", "utf-8"));

        pckg.dependencies[pck] = oldVersion;

        writeFileSync(process.cwd() + sep + "package.json", JSON.stringify(pckg, null, 2));

        console.log(`\n${green('Rollback successful into previous version of the package:') + yellow(` ${pck}@${oldVersion}`)}`);
    } catch (e) {
        console.log(`Error rolling back the modification of the package.json file: ${e.message}`);
    }
}

export { modify };