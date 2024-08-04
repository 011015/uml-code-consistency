import * as go from "gojs";
import { v4 as uuidv4 } from "uuid";
import {
  getLine,
  getReplyTemplate,
  getSyncTemplate,
  getGroupTemplate,
  getNodeTemplate,
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
    groupTemplate: getGroupTemplate(),
  });
  myPalette.linkTemplateMap.add("sync", getSyncTemplate());
  myPalette.linkTemplateMap.add("reply", getReplyTemplate());

  myPalette.model = new go.GraphLinksModel({
    linkCategoryProperty: "type",
    linkKeyProperty: "key",
    linkDataArray: [
      {
        key: uuidv4(),
        type: "sync",
        points: getLine(),
      },
      {
        key: uuidv4(),
        type: "reply",
        points: getLine(),
      },
    ],
  });
  return myPalette;
}
