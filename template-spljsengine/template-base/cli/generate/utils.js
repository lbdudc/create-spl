import { gray, green, red, yellow } from "kleur/colors";
import fs from "fs";
import { exec } from "node:child_process"
import { Spinner } from "cli-spinner";

/**
 * Check the versions of the product and the package.json
 * @param {Object} product
 * @param {Object} packageJson 
 * @param {Array} splModules 
 * @returns {Array} res - Array with the modules that are in the product and the package.json
 */
export const checkVersions = (product, packageJson, splModules) => {

    let res = [];

    Object.keys(packageJson.dependencies).forEach((key) => {
        if (product.modules[key]) {
            res.push({
                module: key,
                prodVersion: product.modules[key],
                splVersion: packageJson.dependencies[key],
                sameVersion: product.modules[key] === packageJson.dependencies[key]
            })
        }
    });

    // If there are any dependencies in the product that are not in the package.json
    // console.log a warning message with the missing dependencies
    Object.keys(product.modules).forEach((key) => {
        if (!packageJson.dependencies[key]) {
            console.warn(`Warning: ${yellow(key)} is not in the SPL dependencies, but it is in the product dependencies (it will be ignored)`);
        }
    });

    // Filter the res array to remove the modules that are not in the splModules
    res = res.filter((el) => {
        return splModules.find((splModule) => splModule.nameProject === el.module);
    });

    return res;
}

export const updatePackageJson = async (modules, packageJson) => {

    // Update the package.json with the versions of the product
    // then write the new package.json and run npm install
    modules.forEach((el) => {
        packageJson.dependencies[el.module] = el.prodVersion;
    });

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    // remove the node_modules folder and the package-lock.json
    fs.rmSync('node_modules', { recursive: true, force: true });
    fs.rmSync('package-lock.json', { force: true });

    console.log(gray('Downloading product dependencies of SPL modules'));
    const spinner = new Spinner('%s');

    spinner.setSpinnerString('|/-\\');
    spinner.start();

    try {
        await runCommand('npm', ['install']);
        console.log(green('Finished download of product module dependencies'));
    } catch (error) {
        console.error(error.message);
        console.error(red('Error downloading product module dependencies'));
    } finally {
        spinner.stop();
    }
}

export const rollbackPackageJson = async (oldPackageJson) => {
    fs.writeFileSync('package.json', JSON.stringify(oldPackageJson, null, 2));

    // remove the node_modules folder and the package-lock.json
    fs.rmSync('node_modules', { recursive: true, force: true });
    fs.rmSync('package-lock.json', { force: true });

    const spinner = new Spinner('%s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();

    try {
        await runCommand('npm', ['install']);
        console.log(green('Finished running npm install'));
    } catch (error) {
        console.error(error.message);
        console.error(red('Error running npm install'));
    } finally {
        spinner.stop();
    }
}

function runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
        const child = exec(`${command} ${args.join(' ')}`);

        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);

        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
            }
        });
    });
}
