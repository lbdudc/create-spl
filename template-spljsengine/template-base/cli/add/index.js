import { bold, cyan, dim, green, magenta, red, yellow } from "kleur/colors";
import { addDependency, changeUvlFile, checkSPLPackage, rollBackAddDependency, changeSplJsEngine } from "./utils.js";

async function add(names, { flags }) {
    console.log(`${bold('Adding packages:')} ${green(names)}\n`);

    // Add the dependency to the project via npm install
    await addDependency(names);

    // Check the validity of the SPL submodule
    let packages = []
    try {
        packages = await checkSPLPackage(names, { flags });
    } catch (e) {
        console.error(red(`Error checking SPL packages: ${e.message}`));
        return;
    }

    // check if the packages installed are valid, if not, roll back the add dependency
    if (packages.filter((p) => !p.valid).length !== 0) {
        console.error(red(`Error checking SPL packages: the package is not valid`));
        await rollBackAddDependency(packages.filter((p) => !p.valid).map((p) => p.name));
        return;
    }

    // Change the UVL file
    console.log(`\n${bold('Changing')} ${green('base.uvl')} ${bold('file, adding ')}[${(magenta(names.join(', ')))}]'`);
    await changeUvlFile(packages.filter((p) => p.valid).map((p) => p.name), { flags });

    // // change the spl-js-engine file to include the new package
    await changeSplJsEngine(packages.filter((p) => p.valid).map((p) => p.name), { flags });
}




export {
    add
}