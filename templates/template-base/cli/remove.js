import { bold, green, magenta, yellow } from "kleur/colors";
import { deleteImportLine } from "./utils/uvl-utils.js";
import { findAliasOfModule } from "./utils/components-utils.js";
import { FM_FILENAME } from "../src/consts/index.js";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

/**
 * Remove modules from the package.json file, the base.uvl file and uninstall them.
 * @param {string} module
 * @param {object} options
 */

async function remove(module, { flags }) {

    console.log(`\n${bold('Deleting module:')} ${green(module)}`);
    console.log(`${bold(' - Changing')} ${green(FM_FILENAME)} ${bold('file, removing ')}[${(magenta(module))}]`);

    try {
        const uvl = readFileSync(path.join(process.cwd(), FM_FILENAME), "utf-8");
        const alias = findAliasOfModule(module);

        console.log(` - Module alias: ${alias ? green(alias) : yellow('No alias found')}\n`);
        const newUvl = await deleteImportLine(uvl, module, alias, { flags });

        writeFileSync(path.join(process.cwd(), FM_FILENAME), newUvl);
        console.log(`\n${green('Module deleted successfully!')}`);
    } catch (e) {
        console.error(`Error modifying the ${FM_FILENAME} file: ${e.message}`);
        return;
    }
}


export { remove };

