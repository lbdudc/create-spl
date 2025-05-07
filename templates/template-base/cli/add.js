import { bold, green, magenta } from "kleur/colors";
import { changeUvlFile } from "./utils.js";
import { FM_FILENAME } from "../src/consts/index.js";

async function add(module, { flags }) {

    console.log(`${bold('Adding module:')} ${green(module.name)} ${green(module.url)}`);
    try {
        console.log(`${bold(' - Changing')} ${green(FM_FILENAME)} ${bold('file, adding ')}[${(magenta(module.name))}]'\n`);
        await changeUvlFile(module, { flags });
    }
    catch (e) {
        console.log(`Error modifying the ${FM_FILENAME} file`);
        return;
    }
}




export {
    add
}