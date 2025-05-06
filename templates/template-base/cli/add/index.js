import { bold, green, magenta, red } from "kleur/colors";
import { addDependency, changeUvlFile, checkSPLPackage, rollBackAddDependency, changeSplJsEngine } from "./utils.js";

async function add(module, { flags }) {

    console.log(`${bold('Adding module:')} ${green(module.name)} ${green(module.url)}\n`);

    // Add the dependency to the project via npm install
    await addDependency(module, { flags });

    // Check the validity of the SPL module
    try {
        const validPackage = await checkSPLPackage(module.name, { flags });

        if (!validPackage) {
            console.error(red(`Error checking SPL package: the package is not valid`));
            await rollBackAddDependency(module.url);
            return;
        }
    } catch (e) {
        console.error(red(`Error checking SPL package: ${e.message}`));
        return;
    }

    // Change the UVL file
    console.log(`${bold('Changing')} ${green('model.uvl')} ${bold('file, adding ')}[${(magenta(module.name))}]'`);
    await changeUvlFile(module, { flags });

    console.log(`${bold('Package is valid')}`);

    // change the spl-js-engine file to include the new package
    console.log(`${bold('Changing')} ${green('modules.json')} ${bold('file, adding ')}[${(magenta(module.name))}]`);
    await changeSplJsEngine(module, { flags });
}




export {
    add
}