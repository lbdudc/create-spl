import { findInNodeModules } from "./utils.js";
import path from "path";

const MODULES_PATH = `.${path.sep}node_modules${path.sep}`;

const components = [
    {
        name: "main_component",
        nameProject: "main-component",
        main: true
    }, {
        name: "user_management_component",
        nameProject: "user-management-component"
    }
];

export const splModulesConfig =
    components.map(component => {
        const comp = findInNodeModules(MODULES_PATH, component);
        return {
            name: component.name,
            codePath: comp.codePath,
            featureModel: comp.featureModel,
            config: comp.config,
            isMain: component.main || false
        }
    })

