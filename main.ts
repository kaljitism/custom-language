import Parser from './frontend/parser.ts';

repl();

function repl() {
  const parser = new Parser();
  
  while (true) {
    console.log("Repl v0.1");
    const input = prompt(">");
    
    // Check for no user input or exit keyword
    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }
    
    const program = parser.produceAST(input);
    console.log(program);
  }
}
