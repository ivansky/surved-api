// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const { fork } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const createCompiler = require('./build-utils/createCompiler');
const clearConsole = require('./build-utils/clearConsole');
const formatBuildingMessages = require('./build-utils/formatBuildingMessages');

process.stdin.resume();
process.stdin.setEncoding('utf8');

let config;
let compiler;
let watching = null;
let serverProcess = null;
let serverCompiledFile = null;
let outputPath = null;
let restartWebpack = () => {};

let createWebpackCompiler = () => {
    const WEBPACK_CONFIG_PATH = './webpack.config.js';
    delete require.cache[require.resolve(WEBPACK_CONFIG_PATH)]
    config = require(WEBPACK_CONFIG_PATH);
    outputPath = config.output.path;
    serverCompiledFile = path.resolve(outputPath, config.output.filename);
    compiler = createCompiler(webpack, config);
};

const watchingOptions = {
    aggregateTimeout: 300,
    ignored: /(node_modules|\/dist\/)/,
    poll: undefined
};

const closeRunningProcesses = () => {
    watching && watching.close(() => {
        console.info(chalk.red('Webpack watching close.'));
    });

    serverProcess && serverProcess.kill('SIGINT');
};

const exitHandler = (error) => {
    console.info(chalk.cyan('Closing server.'));

    if (error) {
        console.error(chalk.red('With error'), error);
    }

    closeRunningProcesses();

    process.exit(error ? 1 : 0);
};

['SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'].forEach((signal) => {
    process.on(signal, exitHandler);
});

process.stdin.on('data', function(chunk) {
    const input = chunk.trim();

    switch(input) {
        case 'reconfig':
            createWebpackCompiler();
            restartWebpack();
            break;
        case 'repack':
            restartWebpack();
            break;
        case 'exit':
            exitHandler();
            break;
    }
});

const watchingHandler = (err, stats) => {
    if (err) {
        console.log(chalk.red('Webpack watcher got error\n'), err);

        return;
    }

    clearConsole();

    console.info(chalk.green('Files have been (re)loaded.'));

    if (serverProcess) {
        serverProcess.kill('SIGINT');
    }

    if (!fs.existsSync(serverCompiledFile)) {
        console.error(chalk.red('Server file doesn\'t exist'), serverCompiledFile);
    }

    serverProcess = fork(serverCompiledFile, [], { silent: true });

    serverProcess.on('message', (m) => {
        // Receive results from child process
        console.log('received: ' + m);
    });

    serverProcess.on('error', (err) => {
        console.error(typeof err, err);
    });

    serverProcess.stdout.on('data', (err) => {
        console.error(chalk.cyan('[Server]'), chalk.cyan(err.toString()));
    });

    serverProcess.stderr.on('data', async (err) => {
        console.error(chalk.cyan('[Server]'), await formatBuildingMessages(err.toString(), outputPath));
    });

    serverProcess.on('exit', (code, signal) => {
        console.info((code ? chalk.red : chalk.cyan)('Server process exited with ' +
            `code ${code} and signal ${signal}`));
    });

    console.log(chalk.cyan(`Server file ${serverCompiledFile} has executed`));
};

const start = () => {
    clearConsole();
    console.log(chalk.cyan('Starting the development server...\n'));
    watching = compiler.watch(watchingOptions, watchingHandler);
};

restartWebpack = () => {
    closeRunningProcesses();
    start();
};

createWebpackCompiler();

start();
