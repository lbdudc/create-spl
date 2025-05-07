import path from 'path';


/**
 * Function to find the path of a module in node_modules.
 * @param {String} route - The route to the node_modules folder. 
 * @param {Object} component - The component object containing the name and nameProject properties.
 * @returns {Object} - An object containing the paths to the code, feature model, config, and main path of the module.
 */
export function findInNodeModules(route, component) {

    const { nameProject, name } = component;
    const sep = path.sep;

    // TODO: change this route templates for using path.join
    const mainPath = route + `${nameProject}${sep}src${sep}platform`;
    return {
        codePath: mainPath + `${sep}code`,
        featureModel: mainPath + `${sep}${name}.uvl`,
        config: mainPath + `${sep}config.json`,
        path: mainPath
    }
}
