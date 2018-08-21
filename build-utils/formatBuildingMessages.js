const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const readline = require('readline');
const cwd = process.cwd();
const emphasize = require('emphasize/lib/core');
const ts = require('highlight.js/lib/languages/typescript');
const WEBPACK_PATH = 'webpack:///';

emphasize.registerLanguage('ts', ts);

const readLineFromFile = async (filePath, lineNumber) => {
    let line = '';
    const lineIndex = parseInt(lineNumber) - 1;

    if (lineIndex < 0 || !fs.existsSync(filePath)) {
        return line;
    }

    return await (new Promise((resolve) => {
        const input = fs.createReadStream(filePath);
        const readInterface = readline.createInterface({ input });

        let cursor = 0;

        readInterface.on('line', (currentLine) => {
            if (cursor++ === lineIndex) {
                resolve(line = currentLine);
                readInterface.close();
                input.close()
            }
        });

        readInterface.on('error', () => {
            resolve(line = '');
        });

        input.on('end', () => {
            resolve(line = '');
        })
    })).then(line => line.trim());
};

const formatPath = async (input) => {
    if (/node_modules/.test(input)) {
        return chalk.gray(input);
    }

    const replaceGrays = (path) => path
        .replace(cwd, (string) => chalk.gray(string))
        .replace(WEBPACK_PATH, (string) => chalk.gray(string));

    let matches;

    if (matches = /^webpack:\/\/\/\.\/(.+)\?:([\d]+):([\d]+)$/.exec(input)) {
        const [originalString, localPath, lineNumber, charNumber] = matches;
        const pathFile = path.resolve(cwd, localPath);
        const line = await readLineFromFile(pathFile, lineNumber);
        if (!line) {
            return replaceGrays(originalString);
        }

        const colorizedLine = emphasize.highlight('ts', line).value;
        return `${replaceGrays(pathFile)}:${lineNumber}:${charNumber}\n`+
            `${' '.repeat(11)}${colorizedLine}\n${' '.repeat(7)}`;
    }

    return replaceGrays(input);
};

const formatLine = async (line) => {
    let matches;

    if (matches = /^(Error:)(.*)$/.exec(line)) {
        return chalk.red(matches[1]) + chalk.yellow(matches[2]);
    }

    if (matches = /^([\s\t]+)(at)(.+)\(([^\(]+)\)$/.exec(line)) {
        const formattedPath = await formatPath(matches[4]);

        return chalk.red(matches[1] + matches[2])
            + chalk.cyan(matches[3])
            + chalk.cyan('(')
            + formattedPath
            + chalk.cyan(')');
    }

    return line;
};

const formatBuildingMessages = async (message) => {
    const lines = message.split('\n');

    const formattedLines = await Promise.all(lines.map(async (line) => {
        return await formatLine(line);
    }));

    return formattedLines.join('\n');
};

module.exports = formatBuildingMessages;
