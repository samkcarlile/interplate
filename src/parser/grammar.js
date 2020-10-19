// Generated automatically by nearley, version 2.19.7
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["Content"]},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["BlockExpression"]},
    {"name": "main$ebnf$1$subexpression$1$macrocall$2", "symbols": ["Expression"]},
    {"name": "main$ebnf$1$subexpression$1$macrocall$1", "symbols": [{"literal":"{{"}, "_", "main$ebnf$1$subexpression$1$macrocall$2", "_", {"literal":"}}"}], "postprocess": d => d.slice(2, -2)},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["main$ebnf$1$subexpression$1$macrocall$1"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": 
        d => d[0].map(unwrap)
             },
    {"name": "Content", "symbols": [(lexer.has("content") ? {type: "content"} : content)], "postprocess":  
        d => ({
          type: 'content',
          value: d[0].value,
        }) 
          },
    {"name": "BlockExpression$macrocall$2$subexpression$1", "symbols": ["FunctionExpression"]},
    {"name": "BlockExpression$macrocall$2$subexpression$1", "symbols": ["ObjectExpression"]},
    {"name": "BlockExpression$macrocall$2", "symbols": ["BlockExpression$macrocall$2$subexpression$1"]},
    {"name": "BlockExpression$macrocall$1", "symbols": [{"literal":"{{"}, "_", "BlockExpression$macrocall$2", "_", {"literal":"}}"}], "postprocess": d => d.slice(2, -2)},
    {"name": "BlockExpression", "symbols": ["BlockExpression$macrocall$1", "_", "main", "_", "EndExpression"], "postprocess": 
        d => ({
          type: 'block_expression',
          open: d[0][0][0][0],
          body: d[2],
          close: d[4],
        })
             },
    {"name": "EndExpression$macrocall$2", "symbols": [{"literal":"/"}, "Identifier"]},
    {"name": "EndExpression$macrocall$1", "symbols": [{"literal":"{{"}, "_", "EndExpression$macrocall$2", "_", {"literal":"}}"}], "postprocess": d => d.slice(2, -2)},
    {"name": "EndExpression", "symbols": ["EndExpression$macrocall$1"], "postprocess": 
        d => ({
          type: 'end_expression',
          id: d[0][0][1],
        })
             },
    {"name": "ObjectExpression", "symbols": [{"literal":"#"}, "Identifier"], "postprocess": 
        d => ({
          type: 'object_expression',
          object: d[1],
        }) 
             },
    {"name": "Expression", "symbols": ["FunctionExpression"], "postprocess": id},
    {"name": "Expression", "symbols": ["AssignmentExpression"], "postprocess": id},
    {"name": "Expression", "symbols": ["IdentifierExpression"], "postprocess": id},
    {"name": "IdentifierExpression", "symbols": ["Identifier"], "postprocess":   
        d => ({
          type: 'identifier_expression',
          id: d[0],
        }) 
             },
    {"name": "AssignmentExpression", "symbols": ["Variable", "_", {"literal":"<"}, "_", "FunctionExpression"], "postprocess": 
        d => ({
          type: 'assignment_expression',
          variable: d[0],
          init: d[4]
        })
             },
    {"name": "Variable", "symbols": [{"literal":"$"}, "Identifier"], "postprocess": 
        d => ({
          type: 'variable',
          id: d[1]
        })
             },
    {"name": "FunctionExpression$subexpression$1", "symbols": [{"literal":"@"}]},
    {"name": "FunctionExpression$subexpression$1", "symbols": [{"literal":"~"}]},
    {"name": "FunctionExpression", "symbols": ["FunctionExpression$subexpression$1", "Identifier", "_", "FunctionParams"], "postprocess": 
        d => ({
          type: 'function_expression',
          alternate: d[0][0].value === '~',
          callee: d[1],
          arguments: d[3].map(e => e[0])
        })
             },
    {"name": "FunctionParams", "symbols": [], "postprocess": () => []},
    {"name": "FunctionParams$subexpression$1", "symbols": ["Identifier"]},
    {"name": "FunctionParams$subexpression$1", "symbols": ["String"]},
    {"name": "FunctionParams$subexpression$1", "symbols": ["Variable"]},
    {"name": "FunctionParams$subexpression$1", "symbols": ["Dictionary"]},
    {"name": "FunctionParams", "symbols": ["FunctionParams", "FunctionParams$subexpression$1", "__"], "postprocess": 
        d => [...d[0], d[1]]
             },
    {"name": "Dictionary", "symbols": [{"literal":"["}, "_", "DictionaryItems", "_", {"literal":"]"}], "postprocess": 
        d => ({
          type: 'dictionary',
          entries: d[2]
        })
             },
    {"name": "DictionaryItems", "symbols": [], "postprocess": () => []},
    {"name": "DictionaryItems$ebnf$1", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "DictionaryItems$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DictionaryItems", "symbols": ["DictionaryItems", "_", "String", "_", "DictionaryItems$ebnf$1"], "postprocess":  
        d => [...d[0], {type: 'entry', key: unwrap(d[2]), value: d[2]}]
             },
    {"name": "DictionaryItems$subexpression$1", "symbols": ["String"]},
    {"name": "DictionaryItems$subexpression$1", "symbols": ["Property"]},
    {"name": "DictionaryItems$ebnf$2", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "DictionaryItems$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DictionaryItems", "symbols": ["DictionaryItems", "_", "DictionaryItems$subexpression$1", "__", "ValueExpression", "DictionaryItems$ebnf$2"], "postprocess": 
        d => [...d[0], {type: 'entry', key: unwrap(d[2]), value: d[4]}]
             },
    {"name": "ValueExpression$subexpression$1", "symbols": ["FunctionExpression"]},
    {"name": "ValueExpression$subexpression$1", "symbols": ["String"]},
    {"name": "ValueExpression", "symbols": [{"literal":"("}, "_", "ValueExpression$subexpression$1", "_", {"literal":")"}], "postprocess": 
        d => ({
          type: 'value_expression',
          value: d[2][0] 
        })
             },
    {"name": "Property", "symbols": [{"literal":"."}, "Identifier"], "postprocess": 
        d => ({
          type: 'property',
          id: d[1]
        })
             },
    {"name": "String", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": 
        d => ({
          type: d[0].type,
          name: d[0].value,
        }) 
             },
    {"name": "Identifier", "symbols": [(lexer.has("ident") ? {type: "ident"} : ident)], "postprocess": 
        d => ({
          type: d[0].type,
          name: d[0].value,
        }) 
             },
    {"name": "__$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": () => null},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
