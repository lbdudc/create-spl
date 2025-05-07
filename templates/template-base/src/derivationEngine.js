import { DerivationEngine, readJsonFromFile, readFile } from "spl-js-engine";
import { splModulesConfig } from "./splConfig.js";
import { SPL_MODULE_TRANSF_FOLDER_NAME, SPL_MODULE_EXTRA_FOLDER_NAME, FM_FILENAME } from "./consts/index.js";
import path from "path";


const VERBOSE = false;
const sep = path.sep;

let featureModel = `.${sep}${FM_FILENAME}`;
if (!featureModel.endsWith("uvl")) {
    featureModel = readFile(featureModel)
}

const mainComponent = splModulesConfig.find(component => component.isMain);

const createEngine = new DerivationEngine({
    codePath: null,
    featureModel: featureModel,
    config: readJsonFromFile(mainComponent.config),
    extraJS: readFile(mainComponent.path + `${sep}${SPL_MODULE_EXTRA_FOLDER_NAME}`),
    modelTransformation: readFile(mainComponent.path + `${sep}${SPL_MODULE_TRANSF_FOLDER_NAME}`),
    verbose: VERBOSE,
    components: splModulesConfig
});


export { createEngine, readJsonFromFile };