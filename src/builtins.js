const { prompt } = require('enquirer');

/**
 * @module builtins definitions for built-in templating functions
 */

const inlineFunctions = {
  async text(message) {
    const { answer } = await prompt({
      type: 'input',
      name: 'answer',
      message,
    });
    return answer;
  },
  async confirm(message) {
    const { answer } = await prompt({
      type: 'confirm',
      name: 'answer',
      message,
    });
    return answer;
  },
  async choose(message, choices) {
    const { answer } = await prompt({
      type: 'select',
      name: 'answer',
      message,
      choices: Object.entries(choices).map(([message, name]) => ({
        name,
        message,
      })),
    });
    return answer;
  },
  async multi(message, choices) {
    const { answer } = await prompt({
      type: 'multiselect',
      name: 'answer',
      message,
      choices: Object.entries(choices).map(([message, name]) => ({
        name,
        message,
      })),
    });
    return answer;
  },
  async form(message, choices) {
    // console.log(choices);
    // const { answer } = await prompt({
    //   type: 'form',
    //   name: 'answer',
    //   message,
    //   choices: Object.entries(choices).map(([message, name]) => ({
    //     name,
    //     message,
    //   })),
    // });
    return choices;
  },
};

const blockFunctions = {
  async if(context, body, condition) {
    if (condition) return body(context);
    return '';
  },
  async each(context, body, value) {
    if (!Array.isArray(value))
      throw new Error(`cannot use @each on type '${typeof value}'`);

    const result = [];
    for (const item of value) {
      const value = await body(context.withScope({ this: item }));
      result.push(value.join(''));
    }

    return result.join('\n');
  },
  async object(context, body, value) {
    if (typeof value !== 'object')
      throw new Error(`cannot use the object block on type '${typeof value}'`);

    const bodyContent = await body(context.withScope(value));
    console.log(bodyContent);
    return bodyContent.join('');
  },
};

module.exports = {
  ...inlineFunctions,
  ...blockFunctions,
};
