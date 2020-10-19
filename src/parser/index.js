const nearley = require('nearley');
const grammar = require('./grammar');

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

module.exports = function parse(input) {
  parser.feed(input);
  return parser.results[0];
};
