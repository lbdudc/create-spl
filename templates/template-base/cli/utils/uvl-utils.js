import { cyan } from "kleur/colors";

async function addImportLine(uvlFile, module) {
    if (uvlFile == null) {
        console.log("Error reading base.uvl file");
        return;
    }

    let newUvl = uvlFile;

    uvlFile.split("\n").forEach((line, index) => {
        // if it finds the features line, then insert the names before it
        // if line includes "features" in the next line, then insert the names in the next line
        if (uvlFile.split("\n")[index + 1] && uvlFile.split("\n")[index + 1].includes("features")) {
            // insert it before the features line
            let newLine = line + "\n\t" + module.name + " from " + module.url;
            newUvl = newUvl.replace(line, newLine);

            console.log(`  Updated line ${cyan(index + 1)} in uvl file:`);
            console.log(` ${newLine}`);
        }
    })

    return newUvl;
}


async function deleteImportLine(uvlFile, module, alias, flags) {

    let newUvl = uvlFile;

    uvlFile.split("\n").forEach((line, index) => {
        // if line includes the module name at the beginning of the line, then delete it
        // first delete all the spaces,tabs and newlines at the beginning of the line
        if (line.trimStart().startsWith(module)) {
            // delete the line
            newUvl = newUvl.replace(line, "");

            console.log(`  Deleted line ${cyan(index + 1)} in uvl file:`);
            console.log(` ${line}`);
        }

        if (alias != null && line.trimStart().startsWith(`${alias}.`)) {
            newUvl = newUvl.replace(line, "");

            console.log(`  Deleted line ${cyan(index + 1)} in uvl file:`);
            console.log(` ${line}`);
        }


    })


    return newUvl;
}

export {
    addImportLine,
    deleteImportLine
};