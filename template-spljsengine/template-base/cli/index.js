#!/usr/bin/env node
'use strict';

import { readFileSync } from "fs";
import * as colors from "kleur/colors";
import { red } from "kolorist";
import yargs from "yargs-parser";

const pck = readFileSync(process.cwd() + "/package.json", "utf8");
const { name, version } = JSON.parse(pck);

async function printHelp() {
    const { printHelp } = await import("./utils.js");
    printHelp({
        commandName: name,
        usage: "[command] [...flags]",
        headline: "Build SPL products.",
        tables: {
            Commands: [
                ["add", "Add an integration."],
                ["modify", "Modify an integration."],
                ["generate", "Generate a new product."],
            ],
            "Global Flags": [
                ["--version", "Show the version number and exit."],
                ["--help", "Show this help message."]
            ]
        }
    });
}
function printVersion() {
    console.log();
    console.log(`  ${colors.bgGreen(colors.black(name))} ${colors.green(`v${version}`)}`);
}

function resolveCommand(flags) {
    const cmd = flags._[2];
    if (flags.version) return "version";
    const supportedCommands = /* @__PURE__ */ new Set([
        "add",
        "modify",
        "generate"
    ]);
    if (supportedCommands.has(cmd)) {
        return cmd;
    }
    return "help";
}

async function runCommand(cmd, flags) {
    switch (cmd) {
        case "help":
            await printHelp();
            return;
        case "version":
            printVersion();
            return;
    }

    switch (cmd) {
        case "add": {
            const { add } = await import("./add/index.js");
            const packages = flags._.slice(3);
            await add(packages, { flags });
            return;
        }
        case "modify": {
            const { modify } = await import("./modify/index.js");
            const packages = flags._.slice(3);
            if (packages.length === 0 || packages.length !== 2) {
                console.error(red("Error: modify command requires two package names as arguments."));
                return;
            }
            await modify(packages, { flags });
            return;
        }
        case "generate": {
            const { createEngine, readJsonFromFile } = await import("./generate/index.js");
            const engine = await createEngine();

            engine.generateProduct("output", readJsonFromFile("spec.json"));

            return;
        }
    }
    throw new Error(`Error running ${cmd} -- no command found.`);
}



async function cli(args) {
    const flags = yargs(args, { boolean: ["global"], alias: { g: "global" } });
    const cmd = resolveCommand(flags);
    try {
        await runCommand(cmd, flags);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

try {
    await cli(process.argv);
} catch (err) {
    console.error(err);
    process.exit(1);
}
