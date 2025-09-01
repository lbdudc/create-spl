import { formatTargetDir, copy, isValidPackageName, toValidPackageName, isEmpty, emptyDir, pkgFromUserAgent } from './utils/utils.js'
import { TEMPLATES } from './utils/consts.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import spawn from 'cross-spawn'
import minimist from 'minimist'
import prompts from 'prompts'
import {
    green,
    red,
    reset,
    blue,
    yellow,
} from 'kolorist'

const argv = minimist(process.argv.slice(2), {
    default: { help: false },
    alias: { h: "help", t: "template", help: "h", v: "version", version: "v" },
    string: ["_"]
})
const cwd = process.cwd()


// prettier-ignore
const helpMessage = `\
Usage: create-spl [OPTION]... [DIRECTORY]

Create a new SPL app project in JavaScript
With no arguments, start the CLI in interactive mode.

Options:
  -t, --template NAME        use a specific template
  -h, --help                 display this help message

Available templates:
${yellow('base')}
${blue('basic-web')}
${green('basic-web-mapviewer')}`

const renameFiles = {
    _gitignore: ".gitignore"
}

const defaultTargetDir = "spl-project"

async function init() {
    const argTargetDir = formatTargetDir(argv._[0])
    const argTemplate = argv.template || argv.t

    const help = argv.help
    if (help) {
        console.log(helpMessage)
        return
    }

    let targetDir = argTargetDir || defaultTargetDir
    const getProjectName = () =>
        targetDir === "." ? path.basename(path.resolve()) : targetDir

    let result

    prompts.override({
        overwrite: argv.overwrite
    })

    try {
        result = await prompts(
            [
                {
                    type: argTargetDir ? null : "text",
                    name: "projectName",
                    message: reset("Project name:"),
                    initial: defaultTargetDir,
                    onState: state => {
                        targetDir = formatTargetDir(state.value) || defaultTargetDir
                    }
                },
                {
                    type: () =>
                        !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "select",
                    name: "overwrite",
                    message: () =>
                        (targetDir === "."
                            ? "Current directory"
                            : `Target directory "${targetDir}"`) +
                        ` is not empty. Please choose how to proceed:`,
                    initial: 0,
                    choices: [
                        {
                            title: "Remove existing files and continue",
                            value: "yes"
                        },
                        {
                            title: "Cancel operation",
                            value: "no"
                        },
                        {
                            title: "Ignore files and continue",
                            value: "ignore"
                        }
                    ]
                },
                {
                    type: (_, { overwrite }) => {
                        if (overwrite === "no") {
                            throw new Error(red("✖") + " Operation cancelled")
                        }
                        return null
                    },
                    name: "overwriteChecker"
                },
                {
                    type: () => (isValidPackageName(getProjectName()) ? null : "text"),
                    name: "packageName",
                    message: reset("Package name:"),
                    initial: () => toValidPackageName(getProjectName()),
                    validate: dir =>
                        isValidPackageName(dir) || "Invalid package.json name"
                },
                {
                    type: "multiselect",
                    name: "spltools",
                    message: reset('Do you want to include some extra SPL tools ?'),
                    choices: [
                        { title: "SPL Visual Interface", value: "spl-tools-webclient" },
                        { title: "FM Analysis Tools (flamapy.js)", value: "spltools-flamapy" }
                    ],
                },
                {
                    type: "select",
                    name: "template",
                    message: reset("Select a template:"),
                    choices: TEMPLATES.map(template => {
                        const templateColor = template.color
                        return {
                            title: templateColor(template.display || template.name),
                            value: template
                        }
                    })
                }
            ],
            {
                onCancel: () => {
                    throw new Error(red("✖") + " Operation cancelled")
                }
            }
        )
    } catch (cancelled) {
        console.log(cancelled.message)
        return
    }

    // user choice associated with prompts
    const { overwrite, packageName, template, analysisTools } = result

    const root = path.join(cwd, targetDir)

    if (overwrite === "yes") {
        emptyDir(root)
    } else if (!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true })
    }

    // determine template
    let calcTemplate = template || argTemplate || "base"

    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
    const pkgManager = pkgInfo ? pkgInfo.name : "npm"
    const isYarn1 = pkgManager === "yarn" && pkgInfo?.version.startsWith("1.")
        ;

    const { customCommand } =
        TEMPLATES.find(v => v.name === template) ?? {}

    if (customCommand) {
        const fullCustomCommand = customCommand
            .replace(/^npm create /, () => {
                // `bun create` uses it's own set of templates,
                // the closest alternative is using `bun x` directly on the package
                if (pkgManager === "bun") {
                    return "bun x create-"
                }
                return `${pkgManager} create `
            })
            // Only Yarn 1.x doesn't support `@version` in the `create` command
            .replace("@latest", () => (isYarn1 ? "" : "@latest"))
            .replace(/^npm exec/, () => {
                // Prefer `pnpm dlx`, `yarn dlx`, or `bun x`
                if (pkgManager === "pnpm") {
                    return "pnpm dlx"
                }
                if (pkgManager === "yarn" && !isYarn1) {
                    return "yarn dlx"
                }
                if (pkgManager === "bun") {
                    return "bun x"
                }
                // Use `npm exec` in all other cases,
                // including Yarn 1.x and other custom npm clients.
                return "npm exec"
            })

        const [command, ...args] = fullCustomCommand.split(" ")
        // we replace TARGET_DIR here because targetDir may include a space
        const replacedArgs = args.map(arg =>
            arg.replace("TARGET_DIR", () => targetDir)
        )
        const { status } = spawn.sync(command, replacedArgs, {
            stdio: "inherit"
        })
        process.exit(status ?? 0)
    }

    // First add the template from the engine
    const engineTemplateDir = path.resolve(
        fileURLToPath(import.meta.url),
        "..",
        "templates",
        "template-base"
    )

    let write = (file, content) => {
        const targetPath = path.join(root, renameFiles[file] ?? file)
        if (content) {
            fs.writeFileSync(targetPath, content)
        } else {
            copy(path.join(engineTemplateDir, file), targetPath)
        }
    }

    const engineFiles = fs.readdirSync(engineTemplateDir)
    for (const file of engineFiles) {
        write(file)
    }

    // Then add the template from the framework
    const templateDir = path.resolve(
        fileURLToPath(import.meta.url),
        "..",
        "templates",
        `template-${calcTemplate?.name}`
    )

    // if the template is not base, we need to copy the template files from the engine
    if (calcTemplate.name !== "base") {
        write = (file, content) => {
            const targetPath = path.join(root, renameFiles[file] ?? file)
            if (content) {
                fs.writeFileSync(targetPath, content)
            } else {
                copy(path.join(templateDir, file), targetPath)
            }
        }

        const templateFiles = fs.readdirSync(templateDir)
        for (const file of templateFiles) {
            write(file)
        }
    }

    //TODO: check if the spltools option is checked, and add the spltools files
    // if (spltools) {
    // }

    // if the template is base, we need to copy the template files from the engine
    const calcTemplateDir = calcTemplate?.name !== "base" ? templateDir : engineTemplateDir

    const pkg = JSON.parse(
        fs.readFileSync(path.join(engineTemplateDir, `package.json`), "utf-8")
    )

    pkg.name = packageName || getProjectName()
    pkg.bin[pkg.name] = 'cli/index.js';

    write("package.json", JSON.stringify(pkg, null, 2) + "\n")

    const uvl = fs.readFileSync(path.join(calcTemplateDir, `model.uvl`), "utf-8")
    write("model.uvl", uvl.replace("<spl-name>", pkg.name))

    const cdProjectName = path.relative(cwd, root)
    console.log(`\nDone. Now run:\n`)
    if (root !== cwd) {
        console.log(
            `  cd ${cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
            }`
        )
    }
    switch (pkgManager) {
        case "yarn":
            console.log("  yarn")
            console.log("  yarn generate <product-route>")
            break
        default:
            console.log(`  ${pkgManager} install`)
            console.log(`  ${pkgManager} run build`)
            console.log(`  npx ${cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName} generate <product-route>`)
            break
    }
    console.log()
}

init().catch(err => {
    console.error(err)
});