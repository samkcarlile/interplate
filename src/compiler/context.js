class Scope {
  constructor(data, parent) {
    this.data = data || {};
    this.parent = parent || undefined;
  }

  /** Get a value from the scope, searching upwards to the root */
  get(key) {
    let scope = this;
    while (scope) {
      if (scope.data[key] !== undefined) return scope.data[key];
      scope = scope.parent;
    }
    throw new Error(`value of '${key}' does not exist`);
  }

  /** Set a value on this scope */
  set(key, value) {
    this.data[key] = value;
  }

  /** Return a new scope whose parent is the calling scope */
  with(data) {
    return new Scope(data, this);
  }
}

class Context {
  constructor(functions, initialScope) {
    this.functions = functions || {};
    this.scope = new Scope(initialScope || {});
  }

  /** Returns the function by name */
  fn(name) {
    if (this.functions[name]) return this.functions[name];
    throw new Error(`function '${name}' does not exist`);
  }
}

module.exports = Context;
