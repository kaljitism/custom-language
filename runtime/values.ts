export type ValueType = "null" | "number";

export interface RuntimeVal {
  type: ValueType;
}

export interface NullVal {
  type: "null";
  value: "null";
}

export interface NumVal {
  type: "number";
  value: number;
}

