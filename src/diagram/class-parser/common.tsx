import * as go from "gojs";
import { v4 as uuidv4 } from "uuid";

const $ = go.GraphObject.make;

function linkStyle() {
  return {
    curve: go.Link.JumpOver,
    isTreeLink: false,
    fromEndSegmentLength: 0,
    toEndSegmentLength: 0,
  };
}

export function getLine() {
  return new go.List(/*go.Point*/).addAll([
    new go.Point(60, 40),
    new go.Point(160, 140),
  ]);
}

const nodeSelectionAdornmentTemplate = $(
  go.Adornment,
  "Auto",
  $(go.Shape, {
    fill: null,
    stroke: "deepskyblue",
    strokeWidth: 1,
    strokeDashArray: [4, 2],
  }),
  $(go.Placeholder)
);

const linkSelectionAdornmentTemplate = $(
  go.Adornment,
  "Link",
  { locationSpot: go.Spot.Center },
  $(
    go.Shape,
    // isPanelMain declares that this Shape shares the Link.geometry
    { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 10 }
  ) // use selection object's strokeWidth
);

// 继承
export function getGenTemplate() {
  return $(
    go.Link,
    {
      locationSpot: go.Spot.Center,
      selectable: true,
      selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
    },
    {
      contextMenu: linkContextMenu(),
    },
    { relinkableFrom: true, relinkableTo: true, reshapable: true },
    linkStyle(),
    { isTreeLink: true },
    new go.Binding("points").makeTwoWay(),
    $(go.Shape, { isPanelMain: true, strokeWidth: 1 }),
    $(go.Shape, {
      isPanelMain: true,
      stroke: "transparent",
      strokeWidth: 10,
    }),
    $(go.Shape, { toArrow: "Triangle", fill: "white", scale: 1 })
  );
}

// 实现
export function getRealTemplate() {
  return $(
    go.Link,
    {
      locationSpot: go.Spot.Center,
      selectable: true,
      selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
    },
    {
      contextMenu: linkContextMenu(),
    },
    { relinkableFrom: true, relinkableTo: true, reshapable: true },
    linkStyle(),
    new go.Binding("points").makeTwoWay(),
    $(go.Shape, { isPanelMain: true, strokeDashArray: [3, 2], strokeWidth: 1 }),
    $(go.Shape, {
      isPanelMain: true,
      stroke: "transparent",
      strokeWidth: 10,
    }),
    $(go.Shape, { toArrow: "Triangle", fill: "white", scale: 1 })
  );
}

// 依赖
export function getDepTemplate() {
  return $(
    go.Link,
    {
      locationSpot: go.Spot.Center,
      selectable: true,
      selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
    },
    {
      contextMenu: linkContextMenu(),
    },
    { relinkableFrom: true, relinkableTo: true, reshapable: true },
    linkStyle(),
    new go.Binding("points").makeTwoWay(),
    $(go.Shape, { isPanelMain: true, strokeDashArray: [3, 2], strokeWidth: 1 }),
    $(go.Shape, {
      isPanelMain: true,
      stroke: "transparent",
      strokeWidth: 10,
    }),
    $(go.Shape, { toArrow: "OpenTriangle", scale: 1 })
  );
}

export function getCompTemplate() {
  return $(
    go.Link,
    {
      locationSpot: go.Spot.Center,
      selectable: true,
      selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
    },
    {
      contextMenu: linkContextMenu(),
    },
    { relinkableFrom: true, relinkableTo: true, reshapable: true },
    linkStyle(),
    new go.Binding("points").makeTwoWay(),
    $(go.Shape, { isPanelMain: true, strokeWidth: 1 }),
    $(go.Shape, {
      isPanelMain: true,
      stroke: "transparent",
      strokeWidth: 10,
    }),
    $(go.Shape, { toArrow: "StretchedDiamond", scale: 1 })
  );
}

export function getAggTemplate() {
  return $(
    go.Link,
    {
      locationSpot: go.Spot.Center,
      selectable: true,
      selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
    },
    {
      contextMenu: linkContextMenu(),
    },
    { relinkableFrom: true, relinkableTo: true, reshapable: true },
    linkStyle(),
    new go.Binding("points").makeTwoWay(),
    $(go.Shape, { isPanelMain: true, strokeWidth: 1 }),
    $(go.Shape, {
      isPanelMain: true,
      stroke: "transparent",
      strokeWidth: 10,
    }),
    $(go.Shape, { toArrow: "StretchedDiamond", fill: "white", scale: 1 })
  );
}

export function getAssTemplate() {
  return $(
    go.Link,
    {
      locationSpot: go.Spot.Center,
      selectable: true,
      selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
    },
    {
      contextMenu: linkContextMenu(),
    },
    { relinkableFrom: true, relinkableTo: true, reshapable: true },
    linkStyle(),
    new go.Binding("points").makeTwoWay(),
    $(go.Shape, { isPanelMain: true, strokeWidth: 1 }),
    $(go.Shape, {
      isPanelMain: true,
      stroke: "transparent",
      strokeWidth: 10,
    })
  );
}

// show visibility or access as a single character at the beginning of each property or method
function convertVisibility(v: string) {
  switch (v) {
    case "public":
      return "+";
    case "private":
      return "-";
    case "protected":
      return "#";
    case "package":
      return "~";
    default:
      return v;
  }
}

const checkContextNoNull = function (
  textBlock: any,
  previousText: any,
  currentText: any,
  tips: any
) {
  // 在这里执行名称的内容格式检查
  if (!currentText.trim()) {
    alert(tips);
    textBlock.text = previousText; // 如果检查失败，还原到之前的文本
  }
  // 可以添加更多的内容格式检查
};

// the item template for properties
const propertyTemplate = $(
  go.Panel,
  "Horizontal",
  { contextMenu: makePropertyContextMenu() },
  // property visibility/access
  $(
    go.TextBlock,
    {
      isMultiline: false,
      editable: false,
      contextMenu: makeVisibilityContextMenu(),
    },
    new go.Binding("text", "visibility", convertVisibility)
  ),
  // property name, underlined if scope=="class" to indicate static property
  $(
    go.TextBlock,
    {
      isMultiline: false,
      editable: true,
      textEdited: (textBlock: any, previousText: any, currentText: any) =>
        checkContextNoNull(
          textBlock,
          previousText,
          currentText,
          "Property name cannot be empty."
        ),
    },
    new go.Binding("text", "name").makeTwoWay(),
    new go.Binding("isUnderline", "scope", (s) => s[0] === "c")
  ),
  // property type, if known
  $(go.TextBlock, "", new go.Binding("text", "type", (t) => (t ? ": " : ""))),
  $(
    go.TextBlock,
    { isMultiline: false, editable: true },
    new go.Binding("text", "type").makeTwoWay()
  ),
  $(
    go.TextBlock,
    "",
    new go.Binding("text", "default_value", (s) => (s ? " = " : ""))
  ),
  // property default value, if any
  $(
    go.TextBlock,
    { isMultiline: false, editable: true },
    new go.Binding("text", "default_value").makeTwoWay()
  )
);
const parameterTemplate = $(
  go.Panel,
  "Horizontal",
  { contextMenu: parameterContextMenu() },
  $(
    go.TextBlock,
    "(",
    new go.Binding("visible", "", function (_, obj) {
      const data = obj.panel.data.index.split(" ");
      const index = parseInt(data[0]);
      return index === 0;
    }).ofObject()
  ),
  // 可编辑的参数名称
  $(
    go.TextBlock,
    { isMultiline: false, editable: true },
    new go.Binding("text", "name").makeTwoWay()
  ),
  // 显示类型
  $(go.TextBlock, "", new go.Binding("text", "type", (t) => (t ? ": " : ""))),
  $(
    go.TextBlock,
    { isMultiline: false, editable: true },
    new go.Binding("text", "type").makeTwoWay()
  ),
  // 分隔符，对最后一个参数隐藏
  $(
    go.TextBlock,
    ", ",
    new go.Binding("visible", "", function (_, obj) {
      const data = obj.panel.data.index.split(" ");
      const index = parseInt(data[0]);
      const length = parseInt(data[1]);
      return index < length - 1;
    }).ofObject()
  ),
  $(
    go.TextBlock,
    ")",
    new go.Binding("visible", "", function (_, obj) {
      const data = obj.panel.data.index.split(" ");
      const index = parseInt(data[0]);
      const length = parseInt(data[1]);
      return index === length - 1;
    }).ofObject()
  )
);
// the item template for methods
const methodTemplate = $(
  go.Panel,
  "Horizontal",
  { contextMenu: methodContextMenu() },
  // method visibility/access
  $(
    go.TextBlock,
    {
      isMultiline: false,
      editable: false,
      contextMenu: makeVisibilityContextMenu(),
    },
    new go.Binding("text", "visibility", convertVisibility)
  ),
  // method name, underlined if scope=="class" to indicate static method
  $(
    go.TextBlock,
    {
      isMultiline: false,
      editable: true,
      // 文本编辑结束后的事件处理
      textEdited: (textBlock: any, previousText: any, currentText: any) =>
        checkContextNoNull(
          textBlock,
          previousText,
          currentText,
          "Method name cannot be empty."
        ),
    },
    new go.Binding("text", "name").makeTwoWay(),
    new go.Binding("isUnderline", "scope", (s) => s[0] === "c")
  ),
  // 在parameters数组为空时显示的左括号
  $(
    go.TextBlock,
    "",
    new go.Binding("text", "parameters", (t) => (t.length === 0 ? "()" : ""))
  ),
  $(go.Panel, "Horizontal", new go.Binding("itemArray", "parameters"), {
    margin: 3,
    stretch: go.GraphObject.Fill,
    defaultAlignment: go.Spot.Left,
    background: "lightyellow",
    itemTemplate: parameterTemplate,
  }),
  // method return type, if any
  $(go.TextBlock, "", new go.Binding("text", "type", (t) => (t ? ": " : ""))),
  $(
    go.TextBlock,
    { isMultiline: false, editable: true },
    new go.Binding("text", "type").makeTwoWay()
  )
);
function makePort(
  name: string,
  spot: go.Spot,
  output: boolean,
  input: boolean
) {
  // the port is basically just a small transparent circle
  return $(go.Shape, "Circle", {
    fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
    stroke: null,
    desiredSize: new go.Size(7, 7),
    alignment: spot, // align the port on the main Shape
    alignmentFocus: spot, // just inside the Shape
    portId: name, // declare this object to be a "port"
    fromSpot: spot,
    toSpot: spot, // declare where links may connect at this port
    fromLinkable: output,
    toLinkable: input, // declare whether the user may draw links to/from here
    cursor: "pointer", // show a different cursor to indicate potential link point
  });
}
function showSmallPorts(node: any, show: boolean) {
  node.ports.each((port: any) => {
    if (port.portId !== "") {
      // don't change the default port, which is the big shape
      port.fill = show ? "rgba(0,0,0,.3)" : null;
    }
  });
}
function setVisibility(e: any, obj: any, newValue: any) {
  var diagram = e.diagram;
  diagram.startTransaction("set visibility");
  var data = obj.part.data; // 获取被点击元素绑定的数据
  diagram.model.setDataProperty(
    data,
    "visibility",
    convertVisibility(newValue)
  );
  diagram.commitTransaction("set visibility");
}

function makeVisibilityContextMenu() {
  return $(
    "ContextMenu",
    $(
      "ContextMenuButton",
      $(go.TextBlock, 'Convert "visibility" to "public"(+)'),
      {
        click: function (e, obj) {
          setVisibility(e, obj, "public");
        },
      }
    ),
    $(
      "ContextMenuButton",
      $(go.TextBlock, 'Convert "visibility" to "private"(-)'),
      {
        click: function (e, obj) {
          setVisibility(e, obj, "private");
        },
      }
    ),
    $(
      "ContextMenuButton",
      $(go.TextBlock, 'Convert "visibility" to "protected"(#)'),
      {
        click: function (e, obj) {
          setVisibility(e, obj, "protected");
        },
      }
    ),
    $(
      "ContextMenuButton",
      $(go.TextBlock, 'Convert "visibility" to "package"(~)'),
      {
        click: function (e, obj) {
          setVisibility(e, obj, "package");
        },
      }
    )
  );
}

function linkContextMenu() {
  return $(
    "ContextMenu",
    $("ContextMenuButton", $(go.TextBlock, "Convert Target"), {
      click: convertTarget,
    }),
    $(
      "ContextMenuButton",
      $(go.TextBlock, 'Convert "relationship" to "Generalization"'),
      {
        click: (e, obj) => convertRelationship(e, obj, "Generalization"),
      }
    ),
    $(
      "ContextMenuButton",
      $(go.TextBlock, 'Convert "relationship" to "Realization"'),
      {
        click: (e, obj) => convertRelationship(e, obj, "Realization"),
      }
    ),
    $(
      "ContextMenuButton",
      $(go.TextBlock, 'Convert "relationship" to "Dependency"'),
      {
        click: (e, obj) => convertRelationship(e, obj, "Dependency"),
      }
    ),
    $(
      "ContextMenuButton",
      $(go.TextBlock, 'Convert "relationship" to "Composition"'),
      {
        click: (e, obj) => convertRelationship(e, obj, "Composition"),
      }
    )
  );
}

function convertTarget(e: any, obj: any) {
  const item = obj.part.data;
  const from = item.from;
  const to = item.to;
  const myDiagram: go.Diagram = e.diagram;

  // 找到要更新的链接数据对象
  // 假设我们知道要更新的链接的key
  const linkKey = item.key;
  var linkData = myDiagram.model.findLinkDataForKey(linkKey);

  // 检查是否找到了链接数据
  if (linkData) {
    // 开始模型的更改事务
    myDiagram.model.startTransaction("convert Target");

    myDiagram.model.set(linkData, "from", to);
    myDiagram.model.set(linkData, "to", from);

    // 提交事务
    myDiagram.model.commitTransaction("convert Target");
  }
}

function convertRelationship(e: any, obj: any, relationship: string) {
  const item = obj.part.data;
  const myDiagram: go.Diagram = e.diagram;

  // 找到要更新的链接数据对象
  // 假设我们知道要更新的链接的key
  const linkKey = item.key;
  var linkData = myDiagram.model.findLinkDataForKey(linkKey);

  // 检查是否找到了链接数据
  if (linkData) {
    // 开始模型的更改事务
    myDiagram.model.startTransaction("convert Relationship");

    myDiagram.model.set(linkData, "relationship", relationship);

    // 提交事务
    myDiagram.model.commitTransaction("convert Relationship");
  }
}

function makePropertyContextMenu() {
  return $(
    "ContextMenu",
    $("ContextMenuButton", $(go.TextBlock, "Delete Property"), {
      click: deleteProperty,
    })
  );
}

function deleteProperty(e: any, obj: any) {
  const props = obj.part.adornedPart.data.properties;
  const item = obj.part.data;
  const myDiagram: go.Diagram = e.diagram;
  myDiagram.startTransaction("delete Property");

  const index = props.findIndex((prop: any) => {
    return prop === item;
  });
  myDiagram.model.removeArrayItem(props, index);
  myDiagram.commitTransaction("delete Property");
}

function methodContextMenu() {
  return $(
    "ContextMenu",
    $("ContextMenuButton", $(go.TextBlock, "Add Parameter"), {
      click: addParameter,
    }),
    $("ContextMenuButton", $(go.TextBlock, "Delete Method"), {
      click: deleteMethod,
    })
  );
}

function deleteMethod(e: any, obj: any) {
  const methods = obj.part.adornedPart.data.methods;
  const item = obj.part.data;
  const myDiagram: go.Diagram = e.diagram;
  myDiagram.startTransaction("delete Method");

  const index = methods.findIndex((prop: any) => {
    return prop === item;
  });
  myDiagram.model.removeArrayItem(methods, index);
  myDiagram.commitTransaction("delete Method");
}

function parameterContextMenu() {
  return $(
    "ContextMenu",
    $("ContextMenuButton", $(go.TextBlock, "Delete Parameter"), {
      click: deleteParameter,
    })
  );
}

function deleteParameter(e: any, obj: any) {
  const item = obj.part.data;
  const myDiagram = e.diagram;
  const nodeData = obj.part.adornedPart.data;
  const methods = obj.part.adornedPart.data.methods;
  const methodIndex = methods.findIndex((meth: any) => {
    return meth.key === item.meth_key;
  });
  const method = methods[methodIndex];
  myDiagram.startTransaction("delete Parameter");
  const newParams = method.parameters
    .filter((param: any) => {
      return param !== item;
    })
    .map((param: any, i: number, arr: any) => {
      return { ...param, index: i + " " + arr.length };
    });
  const newMethod = { ...method, parameters: newParams };
  const newMethods = [...methods];
  newMethods[methodIndex] = newMethod;
  myDiagram.model.setDataProperty(nodeData, "methods", newMethods);
  myDiagram.commitTransaction("delete Parameter");
}

function addParameter(e: any, obj: any) {
  // 逻辑来添加一个属性
  const method = obj.part.data; // 获取到ContextMenu部件
  // 假设 properties 是一个数组
  method.parameters.push({
    key: uuidv4(),
    name: "New Parameter",
    type: "String",
    meth_key: method.key,
  });
  const newParams = method.parameters.map((param: any, i: number, arr: any) => {
    return { ...param, index: i + " " + arr.length };
  });
  method.parameters = newParams;
  e.diagram.model.updateTargetBindings(method);
}

function classContextMenu() {
  return $(
    "ContextMenu",
    $("ContextMenuButton", $(go.TextBlock, "Add Property"), {
      click: (e, obj: any) => {
        // 逻辑来添加一个属性
        const contextMenu = obj.part; // 获取到ContextMenu部件
        const node = contextMenu.data; // 获取到绑定数据（节点数据）
        if (node.properties && node.properties.length) {
          node.properties.push({
            key: uuidv4(),
            name: "New Property",
            type: "String",
            visibility: "public",
          });
        } else {
          node.properties = [
            {
              key: uuidv4(),
              name: "New Property",
              type: "String",
              visibility: "public",
            },
          ];
        }
        e.diagram.model.updateTargetBindings(node);
      },
    }),
    $("ContextMenuButton", $(go.TextBlock, "Add Method"), {
      click: (e, obj) => {
        const contextMenu = obj.part;
        const node = contextMenu.data;
        if (node.methods && node.methods.length) {
          node.methods.push({
            key: uuidv4(),
            name: "newMethod",
            parameters: [],
            visibility: "public",
          });
        } else {
          node.methods = [
            {
              key: uuidv4(),
              name: "newMethod",
              parameters: [],
              visibility: "public",
            },
          ];
        }
        e.diagram.model.updateTargetBindings(node);
      },
    })
  );
}
export function getNodeTemplate() {
  return $(
    go.Node,
    "Auto",
    {
      selectable: true,
      selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
    },
    {
      // locationSpot: go.Spot.Center,
      fromSpot: go.Spot.AllSides,
      toSpot: go.Spot.AllSides,
    },
    {
      contextMenu: classContextMenu(),
    },
    $(go.Shape, { fill: "lightyellow" }),
    $(
      go.Panel,
      "Table",
      { defaultRowSeparatorStroke: "black" },
      // header
      $(
        go.TextBlock,
        {
          row: 0,
          columnSpan: 2,
          margin: new go.Margin(10, 20, 10, 20),
          alignment: go.Spot.Center,
          isMultiline: false,
          editable: true,
          textEdited: (textBlock: any, previousText: any, currentText: any) =>
            checkContextNoNull(
              textBlock,
              previousText,
              currentText,
              "Class name cannot be empty."
            ),
        },
        new go.Binding("text", "name").makeTwoWay()
      ),
      // properties
      $(
        go.TextBlock,
        "Properties",
        { row: 1 },
        new go.Binding("visible", "visible", (v) => !v).ofObject("PROPERTIES")
      ),
      $(
        go.Panel,
        "Vertical",
        { name: "PROPERTIES" },
        new go.Binding("itemArray", "properties"),
        {
          row: 1,
          margin: 3,
          stretch: go.GraphObject.Fill,
          defaultAlignment: go.Spot.Left,
          background: "lightyellow",
          itemTemplate: propertyTemplate,
        }
      ),
      $(
        "PanelExpanderButton",
        "PROPERTIES",
        {
          row: 1,
          column: 1,
          alignment: go.Spot.TopRight,
          visible: false,
        },
        new go.Binding("visible", "properties", (arr) => arr.length > 0)
      ),
      // methods
      $(
        go.TextBlock,
        "Methods",
        { row: 2 },
        new go.Binding("visible", "visible", (v) => !v).ofObject("METHODS")
      ),
      $(
        go.Panel,
        "Vertical",
        { name: "METHODS" },
        new go.Binding("itemArray", "methods"),
        {
          row: 2,
          margin: 3,
          stretch: go.GraphObject.Fill,
          defaultAlignment: go.Spot.Left,
          background: "lightyellow",
          itemTemplate: methodTemplate,
        }
      ),
      $(
        "PanelExpanderButton",
        "METHODS",
        { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
        new go.Binding("visible", "methods", (arr) => arr.length > 0)
      )
    ),
    new go.Binding("location", "location", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    // four small named ports, one on each side:
    makePort("T", go.Spot.Top, true, true),
    makePort("L", go.Spot.Left, true, true),
    makePort("R", go.Spot.Right, true, true),
    makePort("B", go.Spot.Bottom, true, true),
    {
      // handle mouse enter/leave events to show/hide the ports
      mouseEnter: (e, node) => showSmallPorts(node, true),
      mouseLeave: (e, node) => showSmallPorts(node, false),
    }
  );
}
