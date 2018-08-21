/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * Copied from
 * https://github.com/facebook/create-react-app/blob/next/packages/react-dev-utils/clearConsole.js
 *
 * Thanks Facebook for MIT License
 */

'use strict';

function clearConsole() {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

module.exports = clearConsole;
