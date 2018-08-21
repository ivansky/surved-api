// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const { fork } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const createCompiler = require('./build-utils/createCompiler');
const clearConsole = require('./build-utils/clearConsole');

process.stdin.resume();

let compiler = createCompiler(webpack, config);

let watching;
let serverProcess;

const serverCompiledFile = path.resolve(config.output.path, config.output.filename);

const exitHandler = (error) => {
    console.log(chalk.red('Exiting server...\n'));

    if (error) {
        console.log(chalk.red('With error'), error);
    }

    watching && watching.close(() => {
        console.log(chalk.red('Webpack watching close...\n'));
    });

    serverProcess && serverProcess.kill('SIGINT');

    process.exit(1);
};

clearConsole();

console.log(chalk.cyan('Starting the development server...\n'));

['SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'].forEach((signal) => {
    process.on(signal, exitHandler);
});

watching = compiler.watch({
    // Example watchOptions
    aggregateTimeout: 300,
    ignored: /(node_modules|\/dist\/)/,
    poll: undefined
}, (err, stats) => {
    if (err) {
        console.log(chalk.red('Webpack watcher got error\n'), err);

        return;
    }

    clearConsole();

    console.log(chalk.green('Files updated...'));

    if (serverProcess) {
        serverProcess.kill('SIGINT');
    }

    if (fs.existsSync(serverCompiledFile)) {
        console.log(chalk.green('Server file exists'));
    } else {
        console.log(chalk.red('Server file doesn\'t exist'));
    }

    serverProcess = fork(serverCompiledFile);

    serverProcess.on('message', function(m) {
        // Receive results from child process
        console.log('received: ' + m);
    });

    serverProcess.on('error', (err) => {
        console.log(err);
    });

    serverProcess.on('exit', (code, signal) => {
        console.log(chalk.cyan('Server process exited with ' +
            `code ${code} and signal ${signal}`));
    });

    //serverProcess.stdout.on('data', console.debug);

    console.log(chalk.cyan(`Server file ${serverCompiledFile} has executed`));
});
