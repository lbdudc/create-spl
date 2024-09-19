import { readFileSync } from "fs";
import { findInNodeModules } from "./utils.js";
import path from "path";

const MODULES_PATH = `.${path.sep}node_modules${path.sep}`;

let components = [];

try {
    const modulesFilePath = path.join(process.cwd(), "splModules.json");
    const modulesFile = readFileSync(modulesFilePath, "utf8");
    components = JSON.parse(modulesFile);
} catch (error) {
    console.error("Error reading modules.json file");
}

export const splModulesConfig =
    components.map(component => {
        const comp = findInNodeModules(MODULES_PATH, component);
        return {
            name: component.name,
            codePath: comp.codePath,
            featureModel: comp.featureModel,
            config: comp.config,
            path: comp.path,
            isMain: component.main || false
        }
    })

