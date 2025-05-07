# Basic SPL Example

This is a basic example of a Software Product Line (SPL) project. The project is designed to manage and generate products from a set of modules using a command-line interface (CLI).

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
   - [Available Commands](#available-commands)
3. [Extra Scripts](#extra-scripts)
4. [Adding a Module](#adding-a-module)
5. [Generating a Product](#generating-a-product)

---

## Installation

To install the dependencies and set up the project, run:

```bash
npm install
```

To sync all files and modules in the SPL, run the following command. This should be executed each time the `model.uvl` file is changed:

```bash
npm run build
```

---

## Usage

You can execute various scripts in the SPL using the following command:

```bash
npx <spl-name> [options]
```

### Available Commands

| Command                              | Description                                                                                     |
|--------------------------------------|-------------------------------------------------------------------------------------------------|
| `add <module-name> <module-url>`     | Adds a module to the SPL. The module can be a Git URL, local directory, or npm package.         |
| `modify <module-name> <new-module-url>` | Changes the location of a module dependency. The new location can be a Git URL, local directory, or npm package. |
| `delete <module-name>`               | Deletes a module from the SPL.                                                                 |
| `generate <route/spec.json>`         | Generates a product using the derivation engine. Requires a product specification.             |

---

## Extra Scripts

| Script                  | Description                                                                                     |
|-------------------------|-------------------------------------------------------------------------------------------------|
| `npm run build`         | Builds the SPL project. Syncs all files and modules in the SPL. Should be executed after changes to `model.uvl`. |
| `npm run check-validity`| Checks the validity of the SPL project. Ensures all modules are correctly imported.             |

---

## Adding a Module

To add a module to the existing SPL program, run the following command:

```bash
npx <spl-name> add <module-name> <module-url>
```

This will automatically:

- Add a new import statement to the `model.uvl` file.

---

## Generating a Product

To generate a product, run the following command:

```bash
npx main-app-act generate <spec.json route> <output-folder>
```

**Note:** Before running the `generate` command, ensure you run the `npm run build` command to reflect the latest changes.

The generated product will be saved in the `products` folder.
