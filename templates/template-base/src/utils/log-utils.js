// filename: showModules.js
import kleur from 'kleur';
import { MODULES_FILENAME } from '../consts/index.js';


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

export function printModules(title, modules) {
    console.log(`\n${kleur.bold(` - ${title}`)} ${kleur.green(MODULES_FILENAME)}:\n`);
    console.log(formatModulesTable(modules));
}

