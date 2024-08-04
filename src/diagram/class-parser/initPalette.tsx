import * as go from "gojs";
import { v4 as uuidv4 } from "uuid";
import {
  getLine,
  getNodeTemplate,
  getGenTemplate,
  getRealTemplate,
  getDepTemplate,
  getCompTemplate,
} from "./common";
const $ = go.GraphObject.make;

export function initPalette() {
  const myPalette = $(go.Palette, {
    maxSelectionCount: 1,
    initialAutoScale: go.Diagram.Uniform,
    initialDocumentSpot: go.Spot.Center,
    initialViewportSpot: go.Spot.Center,
    initialContentAlignment: go.Spot.Center,
    minScale: 0.2,
    layout: $(go.GridLayout, {}),
    nodeTemplate: getNodeTemplate(),
  });
  myPalette.linkTemplateMap.add("Generalization", getGenTemplate());
  myPalette.linkTemplateMap.add("Realization", getRealTemplate());
  myPalette.linkTemplateMap.add("Dependency", getDepTemplate());
  myPalette.linkTemplateMap.add("Composition", getCompTemplate());

  myPalette.model = new go.GraphLinksModel({
    linkCategoryProperty: "relationship",
    linkKeyProperty: "key",
    linkDataArray: [
      {
        key: uuidv4(),
        relationship: "Generalization",
        points: getLine(),
      },
      // { key: uuidv4(), relationship: "Association", points: getLine() },
      { key: uuidv4(), relationship: "Realization", points: getLine() },
      { key: uuidv4(), relationship: "Dependency", points: getLine() },
      { key: uuidv4(), relationship: "Composition", points: getLine() },
      // { key: uuidv4(), relationship: "Aggregation", points: getLine() },
    ],
  });
  return myPalette;
}
