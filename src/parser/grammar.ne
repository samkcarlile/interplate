@{%
const {lexer} = require('./lexer.js');

function tokenLocation({line, col, text}) {
  const start = {line, col: col - 1};
  const end = {line, col: col + text.length - 1 };
  return { start, end };
}

/* This is not the best, but it makes sure to completely unwrap symbols from their array containers.
   I suspect the reason for having to do this is either because I'm new to writing grammars,
   or possibly, more specifically because of the lazy `inBrackets` macro I've defined.
*/
function unwrap(d) {
  while (d[0]) d = d[0];
  return d;
}

%}

@lexer lexer

# helpful macros
inBrackets[X] -> %l2brace _ $X _ %r2brace     {% d => d.slice(2, -2) %}

main 
  -> (Content|BlockExpression|inBrackets[Expression]):*
     {%
        d => d[0].map(unwrap)
     %}

Content -> %content 
  {% 
     d => ({
       type: 'content',
       value: d[0].value,
     }) 
  %}

BlockExpression
  -> inBrackets[(FunctionExpression|ObjectExpression)] _ main _ EndExpression
     {%
        d => ({
          type: 'block_expression',
          open: d[0][0][0][0],
          body: d[2],
          close: d[4],
        })
     %}

EndExpression 
  -> inBrackets["/" Identifier]
     {%
        d => ({
          type: 'end_expression',
          id: d[0][0][1],
        })
     %}

ObjectExpression
  -> "#" Identifier
     {%
        d => ({
          type: 'object_expression',
          object: d[1],
        }) 
     %}

Expression 
  -> FunctionExpression   {% id %}
   | AssignmentExpression {% id %}
   | IdentifierExpression {% id %}

IdentifierExpression
  -> Identifier
     {%  
        d => ({
          type: 'identifier_expression',
          id: d[0],
        }) 
     %}

AssignmentExpression
  -> Variable _ "<" _ FunctionExpression
     {%
        d => ({
          type: 'assignment_expression',
          variable: d[0],
          init: d[4]
        })
     %}

Variable 
  -> "$" Identifier
     {%
        d => ({
          type: 'variable',
          id: d[1]
        })
     %}

FunctionExpression
  -> ("@"|"~") Identifier _ FunctionParams
     {%
        d => ({
          type: 'function_expression',
          alternate: d[0][0].value === '~',
          callee: d[1],
          arguments: d[3].map(e => e[0])
        })
     %}

FunctionParams
  -> null           {% () => [] %}
     # TODO: would be nice if we didn't require whitespace after the last function parameter
     #       Also, I should rename anything including `parameter` to `argument` to be precise.
   | FunctionParams (ValueExpression|Identifier|String|Variable|Dictionary) __
     {%
        d => [...d[0], d[1]]
     %} 

Dictionary
  -> "[" _ DictionaryItems _ "]"
     {%
        d => ({
          type: 'dictionary',
          entries: d[2]
        })
     %}

DictionaryItems
  -> null           {% () => [] %}
   | DictionaryItems _ String _ ",":?
     {% 
        d => [...d[0], {type: 'entry', key: unwrap(d[2]), value: d[2]}]
     %}
   | DictionaryItems _ (String|Property) __ ValueExpression ",":?
     {%
        d => [...d[0], {type: 'entry', key: unwrap(d[2]), value: d[4]}]
     %}

ValueExpression
  -> %lparen _ (FunctionExpression|String) _ %rparen
     {%
        d => ({
          type: 'value_expression',
          value: d[2][0] 
        })
     %} 

Property 
  -> "." Identifier
     {%
        d => ({
          type: 'property',
          id: d[1]
        })
     %}

String
  -> %string
     {%
        d => ({
          type: d[0].type,
          name: d[0].value,
        }) 
     %}


Identifier 
  -> %ident
     {%
        d => ({
          type: d[0].type,
          name: d[0].value,
        }) 
     %}

__ -> %ws:+ {% () => null %}

_ -> %ws:* {% () => null %}