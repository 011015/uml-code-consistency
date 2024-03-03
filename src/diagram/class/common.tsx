import * as go from "gojs";

const $ = go.GraphObject.make;

export function linkStyle() {
  return {
    curve: go.Link.JumpOver,
    isTreeLink: false,
    fromEndSegmentLength: 0,
    toEndSegmentLength: 0,
  };
}

export function getLine() {
  return new go.List(/*go.Point*/).addAll([
    new go.Point(0, 0),
    new go.Point(60, 40),
  ]);
}

export const nodeSelectionAdornmentTemplate = $(
  go.Adornment,
  "Auto",
  $(go.Shape, {
    fill: null,
    stroke: "deepskyblue",
    strokeWidth: 1.5,
    strokeDashArray: [4, 2],
  }),
  $(go.Placeholder)
);

export const linkSelectionAdornmentTemplate = $(
  go.Adornment,
  "Link",
  $(
    go.Shape,
    // isPanelMain declares that this Shape shares the Link.geometry
    { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 }
  ) // use selection object's strokeWidth
);

export function getNodeTemplate() {
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

  // the item template for properties
  const propertyTemplate = $(
    go.Panel,
    "Horizontal",
    // property visibility/access
    $(
      go.TextBlock,
      { isMultiline: false, editable: false, width: 12 },
      new go.Binding("text", "visibility", convertVisibility)
    ),
    // property name, underlined if scope=="class" to indicate static property
    $(
      go.TextBlock,
      { isMultiline: false, editable: true },
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
    // property default value, if any
    $(
      go.TextBlock,
      { isMultiline: false, editable: false },
      new go.Binding("text", "default", (s) => (s ? " = " + s : ""))
    )
  );

  // the item template for methods
  const methodTemplate = $(
    go.Panel,
    "Horizontal",
    // method visibility/access
    $(
      go.TextBlock,
      { isMultiline: false, editable: false, width: 12 },
      new go.Binding("text", "visibility", convertVisibility)
    ),
    // method name, underlined if scope=="class" to indicate static method
    $(
      go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding("text", "name").makeTwoWay(),
      new go.Binding("isUnderline", "scope", (s) => s[0] === "c")
    ),
    // method parameters
    $(
      go.TextBlock,
      "()",
      // this does not permit adding/editing/removing of parameters via inplace edits
      new go.Binding("text", "parameters", (parr) => {
        var s = "(";
        for (var i = 0; i < parr.length; i++) {
          var param = parr[i];
          if (i > 0) s += ", ";
          s += param.name + ": " + param.type;
        }
        return s + ")";
      })
    ),
    // method return type, if any
    $(go.TextBlock, "", new go.Binding("text", "type", (t) => (t ? ": " : ""))),
    $(
      go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding("text", "type").makeTwoWay()
    )
  );

  return $(
    go.Node,
    "Auto",
    {
      selectable: true,
      selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
    },
    {
      locationSpot: go.Spot.Center,
      fromSpot: go.Spot.AllSides,
      toSpot: go.Spot.AllSides,
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
          margin: 3,
          alignment: go.Spot.Center,
          font: "bold 12pt sans-serif",
          isMultiline: false,
          editable: true,
        },
        new go.Binding("text", "name").makeTwoWay()
      ),
      // properties
      $(
        go.TextBlock,
        "Properties",
        { row: 1, font: "italic 10pt sans-serif" },
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
        { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
        new go.Binding("visible", "properties", (arr) => arr.length > 0)
      ),
      // methods
      $(
        go.TextBlock,
        "Methods",
        { row: 2, font: "italic 10pt sans-serif" },
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
