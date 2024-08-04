import * as go from "gojs";
import {
  getNodeTemplate,
  getGenTemplate,
  getRealTemplate,
  getDepTemplate,
  getCompTemplate,
} from "./common";
import { v4 as uuidv4 } from "uuid";

const $ = go.GraphObject.make;

export function initDiagram() {
  const myDiagram = $(go.Diagram, {
    initialAutoScale: go.Diagram.Uniform,
    initialDocumentSpot: go.Spot.TopLeft,
    initialViewportSpot: go.Spot.TopLeft,
    initialContentAlignment: go.Spot.TopLeft,
    minScale: 0.2,
    "undoManager.isEnabled": true,
    // grid: $(
    //   go.Panel,
    //   "Grid",
    //   $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
    //   $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
    //   $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
    //   $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
    // ),
    "draggingTool.dragsLink": true,
    "draggingTool.isGridSnapEnabled": true,
    "linkingTool.isUnconnectedLinkValid": true,
    "linkingTool.portGravity": 20,
    "linkingTool.archetypeLinkData": { relationship: "Generalization" },
    "relinkingTool.isUnconnectedLinkValid": true,
    "relinkingTool.portGravity": 20,
    "relinkingTool.fromHandleArchetype": $(go.Shape, "Diamond", {
      segmentIndex: 0,
      cursor: "pointer",
      desiredSize: new go.Size(24, 24),
      fill: "tomato",
      stroke: "darkred",
    }),
    "relinkingTool.toHandleArchetype": $(go.Shape, "Diamond", {
      segmentIndex: -1,
      cursor: "pointer",
      desiredSize: new go.Size(24, 24),
      fill: "darkred",
      stroke: "tomato",
    }),
    "linkReshapingTool.handleArchetype": $(go.Shape, "Diamond", {
      desiredSize: new go.Size(21, 21),
      fill: "lightblue",
      stroke: "deepskyblue",
    }),
  });

  // this simple template does not have any buttons to permit adding or
  // removing properties or methods, but it could!
  myDiagram.nodeTemplate = getNodeTemplate();

  myDiagram.linkTemplateMap.add("Generalization", getGenTemplate());
  myDiagram.linkTemplateMap.add("Realization", getRealTemplate());
  myDiagram.linkTemplateMap.add("Dependency", getDepTemplate());
  myDiagram.linkTemplateMap.add("Composition", getCompTemplate());

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
