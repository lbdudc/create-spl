import { DerivationEngine, readJsonFromFile, readFile } from "spl-js-engine";

// esto es lo nuevo e interesante, aqui tienes los imports de todos los modulos que necesitas
import { splConfig } from "./lps-config.js";

// habrá que pasarle la config a la función createEngine
// o hacer que lea todos los modulos que hagan falta

// el feature model debería ser siempre el bae.uvl que es el que vamos modificando

// esto no hará falta, esto es la manera antigua de pasarle los ficheros necesarios
const config = {
    codePath: "./mini-lps/src/platform/code",
    featureModel: "./mini-lps/src/platform/model.xml",
    config: "./mini-lps/src/platform/config.json",
    extraJS: "./mini-lps/src/platform/extra.js",
    modelTransformation: "./mini-lps/src/platform/transformation.js"
};

const createEngine = async () => {
    const engine = await new DerivationEngine({
        codePath: config.codePath,
        featureModel: readFile(config.featureModel),
        config: readJsonFromFile(config.config),
        extraJS: readFile(config.extraJS),
        modelTransformation: readFile(config.modelTransformation),
        verbose: DEBUG,
    });
    return engine;
};


export { createEngine, readJsonFromFile };