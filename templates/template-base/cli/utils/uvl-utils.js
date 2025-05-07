import { cyan } from "kleur/colors";

/**
 * Adds an import line in the uvl file for a given module.
 * @param {String} uvlFile - The uvl file to be modified. 
 * @param {String} module - The module name to be added.
 * @returns {String} - The modified uvl file with the import line added.
 */
async function addImportLine(uvlFile, module) {

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


/**
 * Deletes the import line in the uvl file for a given module and all the lines that start with the module name or alias.
 * @param {String} uvlFile - The uvl file to be modified. 
 * @param {String} module - The module name to be modified.
 * @param {String} alias - The alias to be set for the module.
 * @param {*} flags 
 * @returns {String} - The modified uvl file without the import line and all the lines that start with the module name or alias.
 */
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


/**
 * Modifies the import line in the uvl file for a given module.
 * @param {String} uvlFile - The uvl file to be modified.
 * @param {String} module - The module name to be modified.
 * @param {String} newUrl - The new URL to be set for the module.
 * @param {String} alias - The alias to be set for the module.
 * @returns {String} - The modified uvl file.
 */
async function modifyImportLine(uvlFile, module, newUrl, alias) {

    let newUvl = uvlFile;

    uvlFile.split("\n").forEach((line, index) => {
        // if line includes the module name at the beginning of the line, then modify it
        // first delete all the spaces,tabs and newlines at the beginning of the line
        if (line.trimStart().startsWith(module) && line.includes("from")) {
            let newLine = `${line.split("from")[0]}from ${newUrl}${alias ? ` as ${alias}` : ""}`;

            newUvl = newUvl.replace(line, newLine);

            console.log(`  Updated line ${cyan(index + 1)} in uvl file:`);
            console.log(` ${newLine}`);
        }
    })

    return newUvl;
}

export {
    addImportLine,
    modifyImportLine,
    deleteImportLine
};