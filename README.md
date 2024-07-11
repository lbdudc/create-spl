# Create SPL

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2012.0.0-brightgreen.svg)
![npm version](https://badge.fury.io/js/code-uploader.svg)

## Description

The **Create SPL App** is a versatile comand line designed to simplify the process of creating a new SPL application. This library provides a flexible strategy to facilitate the creation of a new SPL application with a predefined structure.

## Pre-requisites

- Have installed in your machine:
  - [Node.js](https://nodejs.org/en/download/) >= 20.0.0

## Usage

Execute the following command via npm:

Usage: `npm create spl [OPTION]... [DIRECTORY]`

Options:

- `-h, --help`                 Show this help message and exit.
- `-t, --template NAME`        use a specific template

## Templates

The structure of the templates for the scaffolding of the SPL applications is as follows:

```bash
template-<derivation-engine-name>
  ├── template-base
  ├── template-<template-name1>
  └── template-<template-name2>
```

A derivation engine template always has a `template-base` folder, which contains the basic structure of the SPL application. The other templates are the specific templates for the different types of SPL applications that can be created for that derivation engine.

## Author

Victor Lamas
Email: <victor.lamas@udc.es>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
