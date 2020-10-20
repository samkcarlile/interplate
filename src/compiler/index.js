/** Helper to create a single function from a
 * group functions returned from `compile()`
 */
const group = compiledStatements => context =>
  Promise.all(compiledStatements.map(cs => cs(context)));

function compile(...nodes) {
  const templateFunctions = nodes.map(node => {
    switch (node.type) {
      case 'content':
        return content(node);
      case 'block_expression':
        return blockExpression(node);
      case 'function_expression':
        return functionExpression(node);
      // case 'object_expression':
      //   return objectExpression(node);
      case 'assignment_expression':
        return assignmentExpression(node);
      case 'identifier_expression':
        return identifierExpression(node);
      case 'value_expression':
        return valueExpression(node);
      case 'dictionary':
        return dictionary(node);
      case 'property':
        return property(node);
      case 'ident':
        return identifier(node);
      case 'string':
        return string(node);
      default:
        throw new Error(`unrecognized node type: ${node.type}`);
    }
  });

  return templateFunctions;
}

function blockExpression(stmt) {
  const body = group(compile(...stmt.body));
  const args =
    stmt.open.type === 'object_expression'
      ? group(compile(stmt.open.object))
      : group(compile(...stmt.open.arguments));
  // TODO: come up with a better way to handle object block expressions
  const fnName =
    stmt.open.type === 'object_expression' ? 'object' : stmt.open.callee.name;
  return async context => {
    const fn = context.fn(fnName);
    const argValues = await args(context);
    return fn(context, body, ...argValues);
  };
}

function assignmentExpression(stmt) {
  const varname = stmt.variable.id.name;
  const [init] = compile(stmt.init);
  return async context => {
    const value = await init(context);
    context.scope.set(varname, value);
    return '';
  };
}

function functionExpression(stmt) {
  const { name } = stmt.callee;
  const args = group(compile(...stmt.arguments));
  return async context => {
    const fn = context.fn(name);
    const argValues = await args(context);
    return fn(...argValues);
  };
}

function identifierExpression(stmt) {
  return compile(stmt.id)[0];
}

function valueExpression(stmt) {
  return compile(stmt.value)[0];
}

function dictionary(stmt) {
  const { entries } = stmt;
  const _obj = entries.map(entry => {
    const [key, value] = compile(entry.key, entry.value);
    return { key, value };
  });

  return async context => {
    const obj = {};
    for (const { key: _key, value: _value } of _obj) {
      const key = await _key(context);
      const value = await _value(context);
      obj[key] = value;
    }
    return obj;
  };
}

function property(stmt) {
  return async () => stmt.id.name;
}

function identifier(stmt) {
  return async context => context.scope.get([stmt.name]);
}

function content(stmt) {
  return async () => stmt.value;
}

function string(stmt) {
  return async () => stmt.name;
}

module.exports = compile;
