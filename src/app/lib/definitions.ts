export type NodeData = Node & {
  properties: Array<Omit<Property, "id" | "node_id">>;
  methods: Array<
    Omit<Method, "id" | "node_id"> & {
      parameters: Array<Omit<Parameter, "id" | "method_id">>;
    }
  >;
  location?: string;
};
export type Node = {
  key: string;
  name: string;
};

export type Property = {
  id: string;
  name: string;
  type: string;
  visibility: "public" | "private" | "protected" | "package";
  default?: string;
  node_id: string;
};
export type Method = {
  id: string;
  name: string;
  type: string;
  visibility: "public" | "private" | "protected" | "package";
  node_id: string;
};
export type Parameter = {
  id: string;
  name: string;
  type: string;
  method_id: string;
};
export type Link = {
  key: string;
  relationship:
    | "Generalization"
    | "Association"
    | "Realization"
    | "Dependency"
    | "Composition"
    | "Aggregation";
  from: string;
  to: string;
};
