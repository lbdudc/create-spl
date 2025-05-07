import path from 'path';
import { SPL_MODULE_CODE_FOLDER_NAME, FM_FILENAME, SPL_MODULE_CONFIG_FOLDER_NAME } from "../consts/index.js";


/**
 * Function to find the path of a module in node_modules.
 * @param {String} route - The route to the node_modules folder. 
 * @param {Object} component - The component object containing the name and nameProject properties.
 * @returns {Object} - An object containing the paths to the code, feature model, config, and main path of the module.
 */
export function findInNodeModules(route, component) {

    const { name } = component;
    const sep = path.sep;

    // TODO: change this route templates for using path.join
    const mainPath = route + `${name}`;
    return {
        codePath: mainPath + `${sep}${SPL_MODULE_CODE_FOLDER_NAME}`,
        featureModel: mainPath + `${sep}${FM_FILENAME}`,
        config: mainPath + `${sep}${SPL_MODULE_CONFIG_FOLDER_NAME}`,
        path: mainPath
    }
}
