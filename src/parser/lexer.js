const moo = require('moo');

const Token = {
  content: 'content',
  string: 'string',
  ident: 'ident',
  l2brace: '{{',
  r2brace: '}}',
  lbracket: '[',
  rbracket: ']',
  lparen: '(',
  rparen: ')',
  dollar: '$',
  larrow: '<',
  quote: "'",
  comma: ',',
  at: '@',
  dot: '.',
  slash: '/',
  tidle: '~',
  hash: '#',
};

const whitespace = { ws: { match: /[\s]+/, lineBreaks: true } };
const string = {
  [Token.string]: {
    match: /'(?:\\['\\]|[^\n'\\])*'/,
    value: s => s.slice(1, -1),
  },
};
const ident = { [Token.ident]: /\w+/ };
const lexer = moo.states({
  main: {
    [Token.content]: { match: /(?:[^{]|{[^{]|\s)+/, lineBreaks: true },
    [Token.l2brace]: { match: '{{', push: 'expression' },
  },
  expression: {
    ...whitespace,
    [Token.r2brace]: { match: '}}', pop: 1 },
    [Token.rparen]: { match: ')', pop: 1 },
    ...ident,
    [Token.dollar]: /\$/,
    [Token.larrow]: '<',
    ...string,
    [Token.lbracket]: { match: '[', push: 'dictionary' },
    [Token.at]: '@',
    [Token.slash]: '/',
    [Token.tilde]: '~',
    [Token.hash]: '#',
  },
  dictionary: {
    ...whitespace,
    [Token.dot]: '.',
    ...ident,
    ...string,
    [Token.comma]: /,/,
    [Token.lparen]: { match: '(', push: 'expression' },
    [Token.rbracket]: { match: ']', pop: 1 },
  },
});

module.exports = { Token, lexer };
