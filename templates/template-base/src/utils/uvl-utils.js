
export const modifyUvlFeatures = async (uvlFile, module, projectName) => {
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
        }

        // if it finds the project name, and the next line has the "mandatory" key
        // then insert the names in the next line after the mandatory key
        if (line.includes(projectName) || line.includes("MainSPL")) {
            if (uvlFile.split("\n")[index + 1].includes("mandatory")) {
                let newLine = uvlFile.split("\n")[index + 1] + "\n\t\t" + module.name
                newUvl = newUvl.replace(uvlFile.split("\n")[index + 1], newLine);
            }
        }
    })

    return newUvl;
}