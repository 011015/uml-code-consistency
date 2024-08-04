export type NodeData = Node & {
  properties?: Array<Omit<Property, "id" | "node_id">>;
  methods?: Array<
    Omit<Method, "id" | "node_id"> & {
      parameters: Array<Omit<Parameter, "id" | "method_id">>;
    }
  >;
  location?: string;
  desiredSize?: string;
  btnDesiredSize?: string;
  titleFont?: string;
  contentFont?: string;
};
export type Node = {
  key: string;
  name: string;
};

export type Property = {
  id: string;
  name: string;
  type?: string;
  visibility: "public" | "private" | "protected" | "package";
  default_value?: string;
  node_id: string;
};
export type Method = {
  id: string;
  name: string;
  type?: string;
  visibility: "public" | "private" | "protected" | "package";
  node_id: string;
};
export type Parameter = {
  id: string;
  name: string;
  type: string;
  index: number; // 1: 最后一个, -1: 第一个, 0: 其它
  method_id: string;
};
export type Link = {
  key: string;
  relationship:
    | "Generalization" // 继承
    // | "Association"
    | "Realization" // 实现
    | "Dependency" // 依赖
    // | "Aggregation"
    | "Composition"; // 聚合
  from: string;
  to: string;
};

// no database
export type Object = {
  key: string;
  text: string;
  isGroup: boolean;
  loc: string;
  duration: number;
};

export type Group = {
  group: string;
  start: number;
  duration: number;
};

export type Message = {
  from: string;
  to: string;
  text: string;
  time: number;
  type: "sync" | "async" | "reply";
};
