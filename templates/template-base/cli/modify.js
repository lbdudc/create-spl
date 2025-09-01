import { bold, green, magenta, yellow } from "kleur/colors";
import { modifyImportLine } from "./utils/uvl-utils.js";
import { FM_FILENAME } from "../src/consts/index.js";
import { readFileSync, writeFileSync } from "fs";
import { findAliasOfModule } from "./utils/components-utils.js";
import path from "path";

/**
 * * Function to modify the model.uvl file, changes the version of the package, and updates the dependencies.
 * @param {Object} module - The module object containing the name and newUrl properties. 
 * @param {Object} flags - The flags object containing extra properties
 * @returns 
 */
async function modify(module, { flags }) {

    const { name, newUrl } = module;

    console.log(`${bold('Modifing module:')} ${green(module.name)} to ${green(module.newUrl)}`);
    console.log(`${bold(' - Changing')} ${green(FM_FILENAME)} ${bold('file, modifying ')}[${(magenta(name))}]'`);

    const alias = findAliasOfModule(name);
    console.log(` - Module alias: ${alias ? green(alias) : yellow('No alias found')}\n`);

    try {
        const uvl = readFileSync(path.join(process.cwd(), FM_FILENAME), "utf-8");

        const newUvl = await modifyImportLine(uvl, name, newUrl, alias, { flags });

        writeFileSync(path.join(process.cwd(), FM_FILENAME), newUvl);
        console.log(`\n${green('Module modified successfully!')}`);

    } catch (e) {
        console.error(`Error modifying the ${FM_FILENAME} file: ${e.message}`);
        return;
    }
}


export { modify };