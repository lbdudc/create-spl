import path from "path";
import { readdirSync, readFileSync } from "fs";

import {
    bgCyan,
    bgGreen,
    bgRed,
    bgWhite,
    bgYellow,
    black,
    blue,
    bold,
    cyan,
    dim,
    green,
    red,
    underline,
    yellow
} from "kleur/colors";

function printHelp({
    commandName,
    headline,
    usage,
    tables,
    description
}) {
    const linebreak = () => "";
    const title = (label) => `  ${bgWhite(black(` ${label} `))}`;
    const table = (rows, { padding }) => {
        const split = process.stdout.columns < 60;
        let raw = "";
        for (const row of rows) {
            if (split) {
                raw += `    ${row[0]}
    `;
            } else {
                raw += `${`${row[0]}`.padStart(padding)}`;
            }
            raw += "  " + dim(row[1]) + "\n";
        }
        return raw.slice(0, -1);
    };
    let message = [];
    if (headline) {
        message.push(
            linebreak(),
            `  ${bgGreen(black(` ${commandName} `))} ${green(
                `v${"4.11.5"}`
            )} ${headline}`
        );
    }
    if (usage) {
        message.push(linebreak(), `  ${green(commandName)} ${bold(usage)}`);
    }
    if (tables) {
        let calculateTablePadding2 = function (rows) {
            return rows.reduce((val, [first]) => Math.max(val, first.length), 0) + 2;
        };
        var calculateTablePadding = calculateTablePadding2;
        const tableEntries = Object.entries(tables);
        const padding = Math.max(...tableEntries.map(([, rows]) => calculateTablePadding2(rows)));
        for (const [tableTitle, tableRows] of tableEntries) {
            message.push(linebreak(), title(tableTitle), table(tableRows, { padding }));
        }
    }
    if (description) {
        message.push(linebreak(), `${description}`);
    }
    console.log(message.join("\n") + "\n");
}

async function findUvlFile(names, { flags }) {
    let files = [];
    names.forEach((name) => {
        try {
            const filePath = path.join(process.cwd(), 'node_modules', name, 'src', 'platform');
            const file = readdirSync(filePath).filter((file) => file.includes(".uvl"))
            if (file.length === 0) {
                console.log(`Error finding .uvl file in ${name} package`);
                return;
            }

            // get the first file in the array
            const uvlName = file[0].split(".")[0];
            const uvlPath = path.join(filePath, `${uvlName}.uvl`);
            const uvl = readFileSync(uvlPath, "utf-8");
            // find the module name in the uvl file, the next line after the "features" line is the module name
            let uvlModuleName = null;

            uvl.split("\n").filter((line, index) => {
                if (line.includes("features")) {
                    const moduleLine = uvl.split("\n")[index + 1];
                    // clean the line from any spaces, \t, \n or \r
                    uvlModuleName = moduleLine.replace(/\s/g, "");
                }
            });

            files.push(
                {
                    name: name,
                    uvlName: uvlName,
                    uvlModuleName: uvlModuleName
                }
            );
        } catch (e) {
            console.log(`Error reading files from ${name} package: ${e.message}`);
            return;
        }
    });
    return files;
}

export {
    printHelp,
    findUvlFile
};