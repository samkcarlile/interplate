const parse = require('./parser');
const compile = require('./compiler');
const Context = require('./compiler/context');
const builtins = require('./builtins');

const input = `
{{ $name < @text 'What is your name?' }}
{{ $favoriteFood < @choose 'What is your favorite food?' ['pizza', 'chicken', 'ice cream'] }}
Your name is {{ name }}, and your favorite food is {{ favoriteFood }}.
{{ @if ( @confirm 'Do you want to eat it now?' ) }}
😋 NOM NOM NOM 😋
{{ /if }}
`;

const ast = parse(input); // ?

const template = compile(...ast); // ?

const context = new Context(builtins, { name: 'Sam' });
(async () => {
  let output = '';
  for (const fn of template) {
    try {
      output += await fn(context);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  console.log(output);
  process.exit(0);
})();
