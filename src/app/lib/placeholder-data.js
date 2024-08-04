const { v4: uuidv4 } = require("uuid");
// setup a few example class nodes and relationships
const nodes = [
  {
    key: uuidv4(),
    name: "BankAccount",
  },
  {
    key: uuidv4(),
    name: "Person",
  },
  {
    key: uuidv4(),
    name: "Student",
  },
  {
    key: uuidv4(),
    name: "Professor",
  },
  {
    key: uuidv4(),
    name: "Course",
  },
  {
    key: uuidv4(),
    name: "Test",
  },
];

const properties = [
  {
    id: uuidv4(),
    name: "owner",
    type: "String",
    visibility: "public",
    node_id: nodes[0].key,
  },
  {
    id: uuidv4(),
    name: "balance",
    type: "Currency",
    visibility: "public",
    default_value: "0",
    node_id: nodes[0].key,
  },
  {
    id: uuidv4(),
    name: "name",
    type: "String",
    visibility: "public",
    node_id: nodes[1].key,
  },
  {
    id: uuidv4(),
    name: "birth",
    type: "Date",
    visibility: "protected",
    node_id: nodes[1].key,
  },
  {
    id: uuidv4(),
    name: "classes",
    type: "List",
    visibility: "public",
    node_id: nodes[2].key,
  },
  {
    id: uuidv4(),
    name: "classes",
    type: "List",
    visibility: "public",
    node_id: nodes[3].key,
  },

  {
    id: uuidv4(),
    name: "name",
    type: "String",
    visibility: "public",
    node_id: nodes[4].key,
  },
  {
    id: uuidv4(),
    name: "description",
    type: "String",
    visibility: "public",
    node_id: nodes[4].key,
  },
  {
    id: uuidv4(),
    name: "professor",
    type: "Professor",
    visibility: "public",
    node_id: nodes[4].key,
  },
  {
    id: uuidv4(),
    name: "location",
    type: "String",
    visibility: "public",
    node_id: nodes[4].key,
  },
  {
    id: uuidv4(),
    name: "times",
    type: "List",
    visibility: "public",
    node_id: nodes[4].key,
  },
  {
    id: uuidv4(),
    name: "prerequisites",
    type: "List",
    visibility: "public",
    node_id: nodes[4].key,
  },
  {
    id: uuidv4(),
    name: "students",
    type: "List",
    visibility: "public",
    node_id: nodes[4].key,
  },
  {
    id: uuidv4(),
    name: "name",
    type: "String",
    visibility: "public",
    node_id: nodes[5].key,
  },
  {
    id: uuidv4(),
    name: "description",
    type: "String",
    visibility: "private",
    node_id: nodes[5].key,
  },
];

const methods = [
  {
    id: uuidv4(),
    name: "deposit",
    type: "void",
    visibility: "public",
    node_id: nodes[0].key,
  },
  {
    id: uuidv4(),
    name: "withdraw",
    type: "void",
    visibility: "public",
    node_id: nodes[0].key,
  },
  {
    id: uuidv4(),
    name: "getCurrentAge",
    type: "int",
    visibility: "public",
    node_id: nodes[1].key,
  },
  {
    id: uuidv4(),
    name: "attend",
    type: "void",
    visibility: "private",
    node_id: nodes[2].key,
  },
  {
    id: uuidv4(),
    name: "sleep",
    type: "void",
    visibility: "private",
    node_id: nodes[2].key,
  },
  {
    id: uuidv4(),
    name: "teach",
    type: "void",
    visibility: "private",
    node_id: nodes[3].key,
  },
];

const parameters = [
  { id: uuidv4(), name: "amount", type: "Currency", method_id: methods[0].id },
  { id: uuidv4(), name: "amount", type: "Currency", method_id: methods[1].id },
  { id: uuidv4(), name: "class", type: "Course", method_id: methods[3].id },
  { id: uuidv4(), name: "class", type: "Course", method_id: methods[5].id },
  { id: uuidv4(), name: "student", type: "String", method_id: methods[5].id },
];

const links = [
  {
    key: uuidv4(),
    from: nodes[0].key,
    to: nodes[2].key,
    relationship: "Generalization",
  },
  {
    key: uuidv4(),
    from: nodes[2].key,
    to: nodes[0].key,
    relationship: "Generalization",
  },
  {
    key: uuidv4(),
    from: nodes[1].key,
    to: nodes[3].key,
    relationship: "Association",
  },
  {
    key: uuidv4(),
    from: nodes[1].key,
    to: nodes[4].key,
    relationship: "Composition",
  },
  {
    key: uuidv4(),
    from: nodes[5].key,
    to: nodes[2].key,
    relationship: "Dependency",
  },
];

module.exports = {
  nodes,
  properties,
  methods,
  parameters,
  links,
};
