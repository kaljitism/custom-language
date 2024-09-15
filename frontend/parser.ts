import {
  BinaryExpr,
  Expr,
  Identifier,
  NumericLiteral,
  Program,
  Stmt,
} from "./abstract_syntax_tree.ts";
import { Token, tokenize, TokenType } from "./lexer.ts";

export default class Parser {
  private tokens: Token[] = [];

  private notEOF(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private at(): Token {
    return this.tokens[0];
  }

  private eat() {
    return this.tokens.shift() as Token;
  }
  
  // deno-lint-ignore no-explicit-any
  private expect(type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      return console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
    }
    return prev;
  }
  
  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    // Parse until the end of the file
    while (this.notEOF()) {
      program.body.push(this.parseStmt());
    }

    return program;
  }

  private parseStmt(): Stmt {
    // Skip to parseExpr()
    return this.parseExpr();
  }

  private parseExpr(): Expr {
    return this.parseAdditiveExpr();
  }

  // Orders of Precedence
  //
  // AssignmentExpr
  // MemberExpr
  // FunctionCall
  // LogicalExpr
  // ComparisonExpr
  // AdditiveExpr
  // MultiplicativeExpr
  // UnaryExpr
  // PrimaryExpr

  private parseMultiplicativeExpr(): Expr {
    let left = this.parsePrimaryExpr();

    while (
      this.at().value == "*" ||
      this.at().value == "/" ||
      this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parsePrimaryExpr();

      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  // (10 + 5) - 5
  private parseAdditiveExpr(): Expr {
    let left = this.parseMultiplicativeExpr();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parseMultiplicativeExpr();

      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parsePrimaryExpr(): Expr {
    const currentToken = this.at().type;

    switch (currentToken) {
      case TokenType.Identifier: {
        return {
          kind: "Identifier",
          value: this.eat().value,
        } as Identifier;
      }

      case TokenType.Number: {
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;
      }

      case TokenType.OpenParenthesis: {
        this.eat(); // eat the opening paren
        const value = this.parseExpr();
        this.expect(
          TokenType.ClosedParenthesis,
          "Unexpected token found inside the parenthesized expression." +
            " Expected closing parenthesis.",
        ); // eat the closing paren
        return value;
      }

      default:
        console.error("Unexpected Token found during parsing! ", this.at());
        Deno.exit(1);
    }
  }
}
