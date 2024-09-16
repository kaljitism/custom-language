export enum TokenType {
  // Literal Types
  Null,
  Number,
  Identifier,

  // Keywords
  Let,

  // Grouping Operators
  Equals,
  OpenParenthesis,
  ClosedParenthesis,
  BinaryOperator,

  EOF,
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  null: TokenType.Null,
};

export interface Token {
  value: string;
  type: TokenType;
}

function token(value = "", type: TokenType): Token {
  return { value, type };
}

function isAlpha(src: string) {
  return src.toUpperCase() != src.toLowerCase();
}

function isInteger(str: string) {
  const character = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return (character >= bounds[0] && character <= bounds[1]);
}

function isSkippable(str: string) {
  return str == " " || str == "\n" || str == "\t";
}

export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");

  // Build each token until the end of the file
  while (src.length > 0) {
    // Handle single character token
    if (src[0] == "(") {
      tokens.push(token(
        src.shift(),
        TokenType.OpenParenthesis,
      ));
    } else if (src[0] == ")") {
      tokens.push(token(
        src.shift(),
        TokenType.ClosedParenthesis,
      ));
    } else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "*" ||
      src[0] == "/" ||
      src[0] == "%"
    ) {
      tokens.push(token(
        src.shift(),
        TokenType.BinaryOperator,
      ));
    } else if (src[0] == "=") {
      tokens.push(token(
        src.shift(),
        TokenType.Equals,
      ));
    } // Handle multi-character token

    else {
      // Build Number token
      if (isInteger(src[0])) {
        let num = "";
        while (src.length > 0 && isInteger(src[0])) {
          num += src.shift();
        }

        tokens.push(token(
          num,
          TokenType.Number,
        ));
      } else if (isAlpha(src[0])) {
        let identifier = "";
        while (src.length > 0 && isAlpha(src[0])) {
          identifier += src.shift();
        }

        // Check for reserved keywords
        const reserved = KEYWORDS[identifier];

        if (typeof reserved == "number") {
          tokens.push(token(
            identifier,
            TokenType.Identifier,
          ));
        } else {
          tokens.push(token(
            identifier,
            reserved,
          ));
        }
      } else if (isSkippable(src[0])) {
        src.shift(); // Skips the current character
      } else {
        console.log("Unrecognized character found in source: ", src.shift());
        // Deno.exit(1);
      }
    }
  }

  tokens.push(token(
    "EndOfFile",
    TokenType.EOF,
  ));
  return tokens;
}
