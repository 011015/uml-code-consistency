import * as go from "gojs";
import { v4 as uuidv4 } from "uuid";
import {
  addObjectMenu,
  MessagingTool,
  MessageDraggingTool,
  MessageSpacing,
  getReplyTemplate,
  getSyncTemplate,
  getGroupTemplate,
  getNodeTemplate,
} from "./common";

const $ = go.GraphObject.make;

export function initDiagram() {
  const myDiagram = $(go.Diagram, {
    allowCopy: false,
    linkingTool: $(MessagingTool), // defined below
    "resizingTool.isGridSnapEnabled": true,
    draggingTool: $(MessageDraggingTool), // defined below
    "draggingTool.gridSnapCellSize": new go.Size(1, MessageSpacing / 4),
    "draggingTool.isGridSnapEnabled": true,
    // automatically extend Lifelines as Activities are moved or resized
    SelectionMoved: ensureLifelineHeights,
    PartResized: ensureLifelineHeights,
    "undoManager.isEnabled": true,
    contextMenu: addObjectMenu(),
  });

  // define the Lifeline Node template.
  myDiagram.groupTemplate = getGroupTemplate();

  // define the Activity Node template
  myDiagram.nodeTemplate = getNodeTemplate();

  // define the Message Link template.
  myDiagram.linkTemplateMap.add("sync", getSyncTemplate());

  // define the Message Link template.
  myDiagram.linkTemplateMap.add("reply", getReplyTemplate());

  myDiagram.model = new go.GraphLinksModel({
    linkCategoryProperty: "type",
    linkKeyProperty: "key",
    makeUniqueKeyFunction: () => {
      return uuidv4();
    },
    makeUniqueLinkKeyFunction: () => {
      return uuidv4();
    },
  });

  function ensureLifelineHeights() {
    // iterate over all Activities (ignore Groups)
    const arr = myDiagram.model.nodeDataArray;
    let max = -1;
    for (let i = 0; i < arr.length; i++) {
      const act = arr[i];

      if (act.isGroup) {
        max = Math.max(max, act.duration);
      } else {
        max = Math.max(max, act.start + act.duration);
      }
    }
    if (max > 0) {
      // now iterate over only Groups
      for (let i = 0; i < arr.length; i++) {
        const gr = arr[i];
        if (!gr.isGroup) continue;
        if (max > gr.duration) {
          // this only extends, never shrinks
          myDiagram.model.setDataProperty(gr, "duration", max);
        }
      }
    }
  }

  return myDiagram;
}
