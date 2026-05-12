#!/usr/bin/env node

const { main } = require('./aah-cli-wrapper');

// This file is now just the entry point.
// The testable logic is in aah-cli-wrapper.js
main(process.argv.slice(2));
