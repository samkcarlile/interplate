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
};

const blockFunctions = {
  async if(context, body, condition) {
    if (condition) return body(context);
    return '';
  },
};

module.exports = {
  ...inlineFunctions,
  ...blockFunctions,
};
