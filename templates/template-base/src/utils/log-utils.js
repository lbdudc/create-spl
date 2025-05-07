// filename: showModules.js
import kleur from 'kleur';
import { MODULES_FILENAME } from '../consts/index.js';


/**
 * * Function to format the modules table for display in the console.
 * @param {Array} modules - The array of module objects to be displayed. 
 * @returns {String} - The formatted table as a string.
 */
function formatModulesTable(modules) {
    const headers = ['Module Name', 'URL'];
    const rows = modules.map(mod => [mod.name, mod.url]);

    // Calculate max column widths
    const colWidths = headers.map((_, i) =>
        Math.max(
            headers[i].length,
            ...rows.map(row => row[i]?.length || 0)
        )
    );

    const formatRow = (cols) =>
        '│ ' +
        cols.map((col, i) => col.padEnd(colWidths[i], ' ')).join(' │ ') +
        ' │';

    const borderTop =
        '┌' + colWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐';
    const separator =
        '├' + colWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤';
    const borderBottom =
        '└' + colWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘';

    const table = [
        borderTop,
        formatRow(headers),
        separator,
        ...rows.map(formatRow),
        borderBottom,
    ];

    return table.join('\n');
}


export function formatModulesTableWithErrors(modules) {
    const headers = ['Module Name', 'Valid', 'FM Validity', 'Errors'];
    const rows = modules.map(mod => [
        mod.name,
        mod.isValid ? 'Yes' : 'No',
        mod.fmValid ? 'Yes' : 'No',
        mod.errors.length > 0 ? mod.errors.join('\n') : 'None',
    ]);

    // Calculate max column widths
    const colWidths = headers.map((_, i) =>
        Math.max(
            headers[i].length,
            ...rows.map(row => Math.max(...(row[i]?.split('\n').map(line => line.length) || [0])))
        )
    );

    const formatRow = (cols) => {
        const lines = cols.map((col, i) => col.split('\n').map(line => line.padEnd(colWidths[i], ' ')));
        const maxLines = Math.max(...lines.map(colLines => colLines.length));
        const paddedLines = lines.map(colLines => [...colLines, ...Array(maxLines - colLines.length).fill(' '.repeat(colWidths[lines.indexOf(colLines)]))]);
        return Array.from({ length: maxLines }, (_, lineIndex) =>
            '│ ' + paddedLines.map(colLines => colLines[lineIndex]).join(' │ ') + ' │'
        ).join('\n');
    };

    const borderTop =
        '┌' + colWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐';
    const separator =
        '├' + colWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤';
    const borderBottom =
        '└' + colWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘';

    const table = [
        borderTop,
        formatRow(headers),
        separator,
        ...rows.flatMap((row, index) => [
            formatRow(row),
            ...(index < rows.length - 1 ? [separator] : []) // Add separator between rows
        ]),
        borderBottom,
    ];

    return table.join('\n');
}


/**
 * Function to print the modules table to the console.
 * @param {String} title - The title of the table. 
 * @param {Array} modules - The array of module objects to be displayed.
 */
export function printModules(title, modules) {
    console.log(`\n${kleur.bold(` - ${title}`)} ${kleur.green(MODULES_FILENAME)}:\n`);
    console.log(formatModulesTable(modules));
}

