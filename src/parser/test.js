const nearley = require('nearley');
const grammar = require('./grammar');
const fs = require('fs');
const { join } = require('path');
const lexer = require('./lexer');

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// TEST FOR ONLY THE LEXER IS COMMENTED OUT
const testContents = `
{{ @if ( @confirm 'Do you want to eat it now?' ) }}
😋 NOM NOM NOM 😋
{{ /if }}`;

// lexer.lexer.reset(testContents);

// const tokens = [];
// let token;
// while ((token = lexer.lexer.next())) {
//   tokens.push(token);
// }

// JSON.stringify(tokens, null, ' '); // ?

// const testContents = fs.readFileSync(join(__dirname, 'test.txt'), 'utf-8');
try {
  parser.feed(testContents);
} catch (err) {
  console.error(err);
  process.exit(1);
}

parser.results; // ?

const output = JSON.stringify(parser.results[0], null, '  '); // ?

// fs.writeFileSync(join(__dirname, 'test.out.json'), output);
