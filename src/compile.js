// module.exports = function compile(ast) {
//   const templateFunctions = ast.map(statement => {
//     switch (statement.type) {
//       case 'content':
//         return content(statement);
//       case 'identifier_expression':
//         return identifierExpression(statement);
//       default:
//         throw new Error(`unrecognized statement type: ${statement.type}`);
//     }
//   });

//   return templateFunctions;
// };

// function content(stmt) {
//   return () => stmt.value;
// }

// function identifierExpression(stmt) {
//   return ({ data }) => data[stmt.id.name];
// }

// function functionExpression(stmt) {
//   return ({ functions, data }) => {
//     const fn = functions[stmt.callee.name];
//     if (!fn) throw new Error(`undefined function '${stmt.callee.name}'`);
//     return fn({ functions, data }, ...stmt.arguments);
//   };
// }

// // built in functions
// const builtins = {
//   functions: {
//     if: ({ functions, data }, condition) => {},
//   },
// };
