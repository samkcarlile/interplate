const nearley = require('nearley');
const grammar = require('./grammar');
const fs = require('fs');
const { join } = require('path');

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const testContents = fs.readFileSync(join(__dirname, 'test.txt'), 'utf-8');

parser.feed(testContents);

parser.results; // ?

JSON.stringify(parser.results[0], null, '  '); // ?
