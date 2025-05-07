import { MODULES_FILENAME } from '../../src/consts/index.js';
import { readFileSync } from "fs";
import path from 'path';


export const findAliasOfModule = (module) => {
    try {
        const modulesFile = readFileSync(
            path.join(process.cwd(), MODULES_FILENAME), "utf-8");

        const modulesFileParsed = JSON.parse(modulesFile);

        return modulesFileParsed.find(mod => mod.name === module)?.alias || null;

    } catch (e) {
        console.error(`Error reading the ${MODULES_FILENAME} file: ${e.message}`);
        return null;
    }
}


