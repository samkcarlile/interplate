{{ $fnName < @text 'Enter a function name: ' }}
{{ $message < @choose 'Choose a message: ' ['Hello', 'Hi', '你好'] }}

function {{ fnName }}() {
  console.log("{{ message }}");
}

{{ fnName }}();