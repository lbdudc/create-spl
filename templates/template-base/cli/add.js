import { bold, green, magenta } from "kleur/colors";
import { addImportLine } from "./utils/uvl-utils.js";
import { FM_FILENAME } from "../src/consts/index.js";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

async function add(module, { flags }) {

    console.log(`${bold('Adding module:')} ${green(module.name)} ${green(module.url)}`);
    console.log(`${bold(' - Changing')} ${green(FM_FILENAME)} ${bold('file, adding ')}[${(magenta(module.name))}]'\n`);

    try {
        const uvl = readFileSync(path.join(process.cwd(), FM_FILENAME), "utf-8");

        const newUvl = await addImportLine(uvl, module, { flags });

        writeFileSync(path.join(process.cwd(), FM_FILENAME), newUvl);

        console.log(`\n${green('Module added successfully!')}`);
    } catch (e) {
        console.error(`Error modifying the ${FM_FILENAME} file: ${e.message}`);
        return;
    }
}

export {
    add
}