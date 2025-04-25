# Basic SPL Example

This application runs spl-js-engine to execute a simple SPL program.

## Installation

```bash
npm install
```

## Usage

A bunch of scripts can be executed in the spl:

```bash
npx <spl-name> [options]

options:
   - add <module-name>
   - change <module-name> <new-module>
   - delete <module-name>
   - generate <spec.jsont>
```

- add: Adds a module to the current spl, handly if you want to quickly setup a new feature model. It can be a git url, a local directory or an npm package.
- change: CHanges the location of the dependency of a module of the spl. It can be a git url, a local directory or an npm package.
- delete: Deletes a submodule of the spl.
- generate: Generates a product using the derivation engine. Needs a product specification.

### Add module to the existing SPL program

It can be automatically added a spl module to the existing SPL program by running the following command:

```bash
npx <spl-name> add <module-name>
```

This will add this changes for you:

- Add a new dependency to the `package.json` file.
- Add a new import statement and mandatory configuration to the `base.uvl` file.
- Add the plugin to the spl-js-engine plugins file.

### Generate product

To generate a product, you need to run the following command:

```bash
npx main-app-act generate <spec.json route> <output-folder>
```

This will generate a product using the derivation engine. The product will be saved in the `products` folder.
