import {
  BinaryExpr,
  NumericLiteral,
  Program,
  Stmt,
} from "../frontend/abstract_syntax_tree.ts";
import { NullVal, NumVal, RuntimeVal } from "./values.ts";

function evalProgram(program: Program): RuntimeVal {
  let lastEvaluated: RuntimeVal = {
    type: "null",
    value: "null",
  } as NullVal;

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
  }

  return lastEvaluated;
}

function evaluateBinaryExpr(binop: BinaryExpr): RuntimeVal {
  const lhs = evaluate(binop.left);
  const rhs = evaluate(binop.right);

  if (lhs.type == "number" && rhs.type == "number") {
    return evaluateNumericBinaryExpr(
      lhs as NumVal,
      rhs as NumVal,
        binop.operator,
    );
  } else if (lhs.type | rhs.type)

  // One or both are null
  return { type: "null", value: "null" } as unknown as "NullVal";
}

function evaluateNumericBinaryExpr(
  lhs: NumVal,
  rhs: NumVal,
  operator: string,
): NumVal {
  let result: number;
  if (operator == "+") {
    result = lhs.value + rhs.value;
  } else if (operator == "-") {
    result = lhs.value - rhs.value;
  } else if (operator == "*") {
    result = lhs.value * rhs.value;
  } else if (operator == "/") {
    if (rhs.value == 0) {
      console.error("This AST Node can not be interpreted");
      Deno.exit(1);
    }
    result = lhs.value / rhs.value;
  } else if (operator == "%") {
    if (rhs.value == 0) {
      console.error("This AST Node can not be interpreted");
      Deno.exit(1);
    }
    result = lhs.value % rhs.value;
  } else {
    console.error("Operator Undefined");
    Deno.exit(1);
  }

  return { value: result, type: "number" };
}

export function evaluate(astNode: Stmt): RuntimeVal {
  switch (astNode.kind) {
    case "Program":
      return evalProgram(astNode as Program);
    
    case "NullLiteral":
      return { value: "null", type: "null" } as NullVal;
    
    case "NumericLiteral":
      return {
        value: ((astNode as NumericLiteral).value),
        type: "number",
      } as NumVal;
      
    case "BinaryExpr":
      return evaluateBinaryExpr(astNode as BinaryExpr);

    
    default:
      console.error(
        "This AST Node not yet been setup for interpretation.",
        astNode,
      );
      Deno.exit(0);
  }
}
