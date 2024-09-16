import Parser from "./frontend/parser.ts";
import { evaluate } from "./runtime/interpreter.ts";

repl();

function repl() {
  const parser = new Parser();

  console.log("Repl v0.1");
  while (true) {
    const input = prompt(">");

    // Check for no user input or exit keyword
    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }
    
    // Produce AST from source code
    const program = parser.produceAST(input);

    const results = evaluate(program);
    console.log(results);
  }
}
