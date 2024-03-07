import * as go from "gojs";
import { v4 as uuidv4 } from "uuid";
import {
  linkStyle,
  linkSelectionAdornmentTemplate,
  getLine,
  getNodeTemplate,
} from "./common";
const $ = go.GraphObject.make;

export function initPalette() {
  const myPalette = $(go.Palette, {
    maxSelectionCount: 1,
    initialAutoScale: go.Diagram.Uniform,
    initialDocumentSpot: go.Spot.TopCenter,
    initialViewportSpot: go.Spot.TopCenter,
    initialContentAlignment: go.Spot.Center,
    layout: $(go.GridLayout, {
      wrappingColumn: 1,
      cellSize: new go.Size(2, 2),
    }),
    nodeTemplate: getNodeTemplate(),
  });
  myPalette.linkTemplateMap.add(
    "Generalization",
    $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      linkStyle(),
      { isTreeLink: true },
      new go.Binding("points"),
      $(go.Shape),
      $(go.Shape, { toArrow: "Triangle", fill: "white" })
    )
  );
  myPalette.linkTemplateMap.add(
    "Association",
    $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      linkStyle(),
      new go.Binding("points"),
      $(go.Shape)
    )
  );
  myPalette.linkTemplateMap.add(
    "Realization",
    $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      linkStyle(),
      new go.Binding("points"),
      $(go.Shape, { strokeDashArray: [3, 2] }),
      $(go.Shape, { toArrow: "Triangle", fill: "white" })
    )
  );
  myPalette.linkTemplateMap.add(
    "Dependency",
    $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      linkStyle(),
      new go.Binding("points"),
      $(go.Shape, { strokeDashArray: [3, 2] }),
      $(go.Shape, { toArrow: "OpenTriangle" })
    )
  );
  myPalette.linkTemplateMap.add(
    "Composition",
    $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      linkStyle(),
      new go.Binding("points"),
      $(go.Shape),
      $(go.Shape, { toArrow: "StretchedDiamond", scale: 1.3 })
    )
  );
  myPalette.linkTemplateMap.add(
    "Aggregation",
    $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      linkStyle(),
      new go.Binding("points"),
      $(go.Shape),
      $(go.Shape, { toArrow: "StretchedDiamond", fill: "white", scale: 1.3 })
    )
  );

  myPalette.model = new go.GraphLinksModel({
    linkCategoryProperty: "relationship",
    linkKeyProperty: "key",
    nodeDataArray: [
      {
        key: uuidv4(),
        name: "className",
      },
    ],
    linkDataArray: [
      {
        key: uuidv4(),
        relationship: "Generalization",
        points: getLine(),
      },
      { key: uuidv4(), relationship: "Association", points: getLine() },
      { key: uuidv4(), relationship: "Realization", points: getLine() },
      { key: uuidv4(), relationship: "Dependency", points: getLine() },
      { key: uuidv4(), relationship: "Composition", points: getLine() },
      { key: uuidv4(), relationship: "Aggregation", points: getLine() },
    ],
  });
  return myPalette;
}
