const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const readline = require('readline');
const cwd = process.cwd();
const WEBPACK_PATH = 'webpack:///';

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

const webpackFakePathResolver = async (objectName, fakePath, outputPath) => {
    let result = {
        objectName,
        realPath: chalk.gray(fakePath),
    };

    const [, prefix, localPath, lineNumber, charNumber] = /^(\/webpack:)?(.+):(\d+):(\d+)$/.exec(fakePath.replace(outputPath, ''));

    if (prefix && objectName.indexOf(localPath) > -1) {
        const pathFile = cwd + localPath;
        const line = (await readLineFromFile(pathFile, lineNumber)).trim();

        if (line) {
            result.objectName = line;
            result.realPath = pathFile.replace(cwd, (substring) => chalk.gray(substring)) + `:${lineNumber}:${charNumber}`;
        }
    }

    return result;
};

const formatLine = async (line, outputPath) => {
    let matches;

    if (matches = /^(Error:)(.*)$/.exec(line)) {
        return chalk.red(matches[1]) + chalk.yellow(matches[2]);
    }

    if (matches = /^([\s\t]+)(at )(.+)\s\(([^\(]+)\)$/.exec(line)) {
        const {
            realPath,
            objectName,
        } = /node_modules/.test(matches[4]) ? {
            realPath: chalk.gray(matches[4]),
            objectName: matches[3],
        } : await webpackFakePathResolver(matches[3], matches[4], outputPath);

        return chalk.red(matches[1] + matches[2])
            + chalk.cyan(objectName)
            + chalk.cyan(' (')
            + realPath
            + chalk.cyan(')');
    }

    return line;
};

const formatBuildingMessages = async (message, outputPath = null) => {
    const lines = message.split('\n');

    const formattedLines = await Promise.all(lines.map(async (line) => {
        return await formatLine(line, outputPath);
    }));

    return formattedLines.join('\n');
};

module.exports = formatBuildingMessages;
