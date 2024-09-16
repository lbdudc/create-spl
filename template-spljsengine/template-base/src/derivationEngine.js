import { DerivationEngine, readJsonFromFile, readFile } from "spl-js-engine";
import { splModulesConfig } from "./splConfig.js";
import path from "path";


const VERBOSE = false;
const sep = path.sep;

let featureModel = `.${sep}base.uvl`;
if (!featureModel.endsWith("uvl")) {
    featureModel = readFile(featureModel)
}

const createEngine = new DerivationEngine({
    codePath: null,
    featureModel: featureModel,
    config: readJsonFromFile(`.${sep}src${sep}platform${sep}config.json`),
    extraJS: readFile(`.${sep}src${sep}platform${sep}extra.js`),
    modelTransformation: readFile(`.${sep}src${sep}platform${sep}transformation.js`),
    verbose: VERBOSE,
    components: splModulesConfig
});


export { createEngine, readJsonFromFile };