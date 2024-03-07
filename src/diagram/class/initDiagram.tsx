import * as go from "gojs";
import {
  linkStyle,
  getNodeTemplate,
  linkSelectionAdornmentTemplate,
} from "./common";
import { v4 as uuidv4 } from "uuid";

const $ = go.GraphObject.make;

export function initDiagram() {
  const myDiagram = $(go.Diagram, {
    initialAutoScale: go.Diagram.Uniform,
    initialDocumentSpot: go.Spot.TopLeft,
    initialViewportSpot: go.Spot.TopLeft,
    initialContentAlignment: go.Spot.TopLeft,
    "undoManager.isEnabled": true,
    grid: $(
      go.Panel,
      "Grid",
      $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
      $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
      $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
      $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
    ),
    "draggingTool.dragsLink": true,
    "draggingTool.isGridSnapEnabled": true,
    "linkingTool.isUnconnectedLinkValid": true,
    "linkingTool.portGravity": 20,
    "relinkingTool.isUnconnectedLinkValid": true,
    "relinkingTool.portGravity": 20,
    "relinkingTool.fromHandleArchetype": $(go.Shape, "Diamond", {
      segmentIndex: 0,
      cursor: "pointer",
      desiredSize: new go.Size(8, 8),
      fill: "tomato",
      stroke: "darkred",
    }),
    "relinkingTool.toHandleArchetype": $(go.Shape, "Diamond", {
      segmentIndex: -1,
      cursor: "pointer",
      desiredSize: new go.Size(8, 8),
      fill: "darkred",
      stroke: "tomato",
    }),
    "linkReshapingTool.handleArchetype": $(go.Shape, "Diamond", {
      desiredSize: new go.Size(7, 7),
      fill: "lightblue",
      stroke: "deepskyblue",
    }),
  });

  // this simple template does not have any buttons to permit adding or
  // removing properties or methods, but it could!
  myDiagram.nodeTemplate = getNodeTemplate();

  myDiagram.linkTemplateMap.add(
    "Generalization",
    $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      linkStyle(),
      { isTreeLink: true },
      $(go.Shape),
      $(go.Shape, { toArrow: "Triangle", fill: "white" })
    )
  );
  myDiagram.linkTemplateMap.add(
    "Association",
    $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      linkStyle(),
      $(go.Shape)
    )
  );
  myDiagram.linkTemplateMap.add(
    "Realization",
    $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      linkStyle(),
      $(go.Shape, { strokeDashArray: [3, 2] }),
      $(go.Shape, { toArrow: "Triangle", fill: "white" })
    )
  );
  myDiagram.linkTemplateMap.add(
    "Dependency",
    $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      linkStyle(),
      $(go.Shape, { strokeDashArray: [3, 2] }),
      $(go.Shape, { toArrow: "OpenTriangle" })
    )
  );
  myDiagram.linkTemplateMap.add(
    "Composition",
    $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      linkStyle(),
      $(go.Shape),
      $(go.Shape, { toArrow: "StretchedDiamond", scale: 1.3 })
    )
  );
  myDiagram.linkTemplateMap.add(
    "Aggregation",
    $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      linkStyle(),
      $(go.Shape),
      $(go.Shape, { toArrow: "StretchedDiamond", fill: "white", scale: 1.3 })
    )
  );

  myDiagram.model = new go.GraphLinksModel({
    linkCategoryProperty: "relationship",
    linkKeyProperty: "key",
    makeUniqueKeyFunction: () => {
      return uuidv4();
    },
    makeUniqueLinkKeyFunction: () => {
      return uuidv4();
    },
  });

  return myDiagram;
}

// export function deleteSelection() {
//   myRobot.keyDown("Del");
//   myRobot.keyUp("Del");
// }
