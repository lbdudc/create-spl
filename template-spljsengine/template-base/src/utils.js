import path from 'path';

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