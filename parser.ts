import {Expr, Identifier, Program, Stmt} from './abstract_syntax_tree.ts';
import {Token, tokenize, TokenType} from './lexer.ts';

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
    return this.parsePrimaryExpr();
  }

  private parsePrimaryExpr(): Expr {
    const currentToken = this.at().type;

    switch (currentToken) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;
      default:
        return {} as Stmt;
    }
  }
}
