const fs = require('fs/promises');
const { resolve } = require('path');

const parse = require('./parser');
const compile = require('./compiler');
const Context = require('./compiler/context');
const builtins = require('./builtins');

async function run() {
  const file = resolve(process.argv[2]);
  const input = await fs.readFile(file, 'utf-8');
  const ast = parse(input); // ?
  const template = compile(...ast); // ?

  const context = new Context(builtins);
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
}

(async () => {
  try {
    await run();
  } catch (err) {
    console.error(err);
  }
})();
