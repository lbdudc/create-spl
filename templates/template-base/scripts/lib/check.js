export const modifyDependenciesToPackageJon = (packageJson, dependency) => {

    // add the packages to the package.json file
    if (!packageJson) return;

    // Create a new object to avoid mutating the original package.json file
    const json = JSON.parse(JSON.stringify(packageJson));

    // if the package is already in the dependencies, skip it
    if (json.dependencies[dependency.name]) {
        return;
    }

    // if its a local package, add the path to the package.json file
    if (dependency.url.startsWith("file:")) {
        json.dependencies[dependency.name] = dependency.url;
        return json;
    }

    // if its a git repository, add the git dependency.url to the package.json file
    if (dependency.url.startsWith("git:")) {
        json.dependencies[dependency.name] = 'git+' + dependency.url.replace("git:", "");
        return json;
    }

    // if it has a version, add it to the package.json file
    if (dependency.url.startsWith("npm:")) {
        json.dependencies[dependency.name] = dependency.url.replace("npm:", "");
        return json;
    }

    // if it has no version, add it to the package.json file
    json.dependencies[dependency.name] = "*";
    return json
}

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

export const modifyComponentsJsonFile = (uvlNames, modulesFile) => {

    const newModules = modulesFile;

    uvlNames.forEach((uvl) => {

        // check if the module is already in the modules.json file, if so, skip it
        if (newModules.find((module) => module.name === uvl.uvlName)) {
            return;
        }

        let module = {
            name: uvl.uvlName,
            nameProject: uvl.name
        };
        newModules.push(module);
    });

    return newModules;
}
