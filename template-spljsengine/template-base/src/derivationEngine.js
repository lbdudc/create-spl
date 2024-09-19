import { DerivationEngine, readJsonFromFile, readFile } from "spl-js-engine";
import { splModulesConfig } from "./splConfig.js";
import path from "path";


const VERBOSE = false;
const sep = path.sep;

let featureModel = `.${sep}base.uvl`;
if (!featureModel.endsWith("uvl")) {
    featureModel = readFile(featureModel)
}

const mainComponent = splModulesConfig.find(component => component.isMain);

const createEngine = new DerivationEngine({
    codePath: null,
    featureModel: featureModel,
    config: readJsonFromFile(mainComponent.config),
    extraJS: readFile(mainComponent.path + `${sep}extra.js`),
    modelTransformation: readFile(mainComponent.path + `${sep}transformation.js`),
    verbose: VERBOSE,
    components: splModulesConfig
});


export { createEngine, readJsonFromFile };