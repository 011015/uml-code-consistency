import * as go from "gojs";
import { v4 as uuidv4 } from "uuid";

const $ = go.GraphObject.make;

// some parameters
const LinePrefix = 20; // vertical starting point in document for all Messages and Activations
const LineSuffix = 30; // vertical length beyond the last message time
export const MessageSpacing = 20; // vertical distance between Messages at different steps
const ActivityWidth = 10; // width of each vertical activity bar
const ActivityStart = 5; // height before start message time
const ActivityEnd = 5; // height beyond end message time

function computeLifelineHeight(duration) {
  return LinePrefix + duration * MessageSpacing + LineSuffix;
}

function computeActivityLocation(act, e) {
  const groupdata = e.diagram.model.findNodeDataForKey(act.group);
  if (groupdata === null) return new go.Point();
  // get location of Lifeline's starting point
  const grouploc = go.Point.parse(groupdata.loc);
  return new go.Point(grouploc.x, convertTimeToY(act.start) - ActivityStart);
}

function backComputeActivityLocation(loc, act, e) {
  e.diagram.model.setDataProperty(
    act,
    "start",
    convertYToTime(loc.y + ActivityStart)
  );
}

function computeActivityHeight(duration) {
  return ActivityStart + duration * MessageSpacing + ActivityEnd;
}
function backComputeActivityHeight(height) {
  return (height - ActivityStart - ActivityEnd) / MessageSpacing;
}

// time is just an abstract small non-negative integer
// here we map between an abstract time and a vertical position
function convertTimeToY(t) {
  return t * MessageSpacing + LinePrefix;
}
function convertYToTime(y) {
  return (y - LinePrefix) / MessageSpacing;
}
function seqLinkContextMenu() {
  return $(
    "ContextMenu",
    $("ContextMenuButton", $(go.TextBlock, "Convert Target"), {
      click: convertTarget,
    }),
    $("ContextMenuButton", $(go.TextBlock, 'Convert "type" to "sync"'), {
      click: (e, obj) => convertType(e, obj, "sync"),
    }),
    $("ContextMenuButton", $(go.TextBlock, 'Convert "type" to "reply"'), {
      click: (e, obj) => convertType(e, obj, "reply"),
    })
  );
}

function groupContextMenu() {
  return $(
    "ContextMenu",
    $("ContextMenuButton", $(go.TextBlock, "Add Activation Rectangle"), {
      click: addRect,
    })
  );
}

export function addObjectMenu() {
  return $(
    "ContextMenu",
    $("ContextMenuButton", $(go.TextBlock, "Add Object"), {
      click: addObject,
    })
  );
}

export function getLine() {
  return new go.List(/*go.Point*/).addAll([
    new go.Point(0, 50),
    new go.Point(100, 50),
  ]);
}

export function getGroupTemplate() {
  return $(
    go.Group,
    "Vertical",
    {
      locationSpot: go.Spot.Bottom,
      locationObjectName: "HEADER",
      minLocation: new go.Point(0, 0),
      maxLocation: new go.Point(9999, 0),
      selectionObjectName: "HEADER",
    },
    {
      contextMenu: groupContextMenu(),
    },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    $(
      go.Panel,
      "Auto",
      { name: "HEADER" },
      $(go.Shape, "Rectangle", {
        fill: $(go.Brush, "Linear", {
          0: "#bbdefb",
          1: go.Brush.darkenBy("#bbdefb", 0.1),
        }),
        stroke: null,
      }),
      $(
        go.TextBlock,
        {
          margin: 5,
          font: "400 10pt Source Sans Pro, sans-serif",
          // isMultiline: false,
          editable: true,
          // 文本编辑结束后的事件处理
          textEdited: (textBlock, previousText, currentText) =>
            checkContextNoNull(
              textBlock,
              previousText,
              currentText,
              "Object name cannot be empty."
            ),
        },
        new go.Binding("text", "text").makeTwoWay()
      )
    ),
    $(
      go.Shape,
      {
        figure: "LineV",
        fill: null,
        stroke: "gray",
        strokeDashArray: [3, 3],
        width: 1,
        alignment: go.Spot.Center,
        portId: "",
        fromLinkable: true,
        fromLinkableDuplicates: true,
        toLinkable: true,
        toLinkableDuplicates: true,
        cursor: "pointer",
      },
      new go.Binding("height", "duration", computeLifelineHeight)
    )
  );
}

export function getNodeTemplate() {
  return $(
    go.Node,
    {
      locationSpot: go.Spot.Top,
      locationObjectName: "SHAPE",
      minLocation: new go.Point(NaN, LinePrefix - ActivityStart),
      maxLocation: new go.Point(NaN, 19999),
      selectionObjectName: "SHAPE",
      resizable: true,
      resizeObjectName: "SHAPE",
      resizeAdornmentTemplate: $(
        go.Adornment,
        "Spot",
        $(go.Placeholder),
        $(
          go.Shape, // only a bottom resize handle
          {
            alignment: go.Spot.Bottom,
            cursor: "col-resize",
            desiredSize: new go.Size(6, 6),
            fill: "yellow",
          }
        )
      ),
    },
    new go.Binding("location", "", computeActivityLocation).makeTwoWay(
      backComputeActivityLocation
    ),
    $(
      go.Shape,
      "Rectangle",
      {
        name: "SHAPE",
        fill: "white",
        stroke: "black",
        width: ActivityWidth,
        // allow Activities to be resized down to 1/4 of a time unit
        minSize: new go.Size(ActivityWidth, computeActivityHeight(0.25)),
      },
      new go.Binding("height", "duration", computeActivityHeight).makeTwoWay(
        backComputeActivityHeight
      )
    )
  );
}

export function getSyncTemplate() {
  return $(
    MessageLink, // defined below
    { selectionAdorned: true, curviness: 0 },
    {
      contextMenu: seqLinkContextMenu(),
    },
    new go.Binding("points").makeTwoWay(),
    $(go.Shape, "Rectangle", {
      stroke: "black",
    }),
    $(go.Shape, { toArrow: "OpenTriangle", stroke: "black" }),
    $(
      go.TextBlock,
      {
        font: "400 9pt Source Sans Pro, sans-serif",
        segmentIndex: 0,
        segmentFraction: 1,
        // segmentOffset: new go.Point(NaN, NaN),
        isMultiline: false,
        editable: true,
      },
      new go.Binding("segmentOffset", "", determineSegmentOffset).ofObject(),
      new go.Binding("text", "text").makeTwoWay()
    )
  );
}

export function getReplyTemplate() {
  return $(
    MessageLink, // defined below
    { selectionAdorned: true, curviness: 0 },
    {
      contextMenu: seqLinkContextMenu(),
    },
    new go.Binding("points").makeTwoWay(),
    $(go.Shape, "Rectangle", {
      stroke: "black",
      strokeDashArray: [3, 3],
      strokeWidth: 1,
    }),
    $(go.Shape, { toArrow: "OpenTriangle", stroke: "black" }),
    $(
      go.TextBlock,
      {
        font: "400 9pt Source Sans Pro, sans-serif",
        segmentIndex: 0,
        segmentFraction: 1,
        // segmentOffset: new go.Point(NaN, NaN),
        isMultiline: false,
        editable: true,
      },
      new go.Binding("segmentOffset", "", determineSegmentOffset).ofObject(),
      new go.Binding("text", "text").makeTwoWay()
    )
  );
}

// a custom routed Link
class MessageLink extends go.Link {
  constructor() {
    super();
    this.time = 0; // use this "time" value when this is the temporaryLink
  }

  getLinkPoint(node, port, spot, from, ortho, othernode, otherport) {
    const p = port.getDocumentPoint(go.Spot.Center);
    const r = port.getDocumentBounds();
    const op = otherport.getDocumentPoint(go.Spot.Center);

    const data = this.data;
    const time = data !== null ? data.time : this.time; // if not bound, assume this has its own "time" property

    const aw = this.findActivityWidth(node, time);
    const x = op.x > p.x ? p.x + aw / 2 : p.x - aw / 2;
    const y = convertTimeToY(time);
    return new go.Point(x, y);
  }

  findActivityWidth(node, time) {
    let aw = ActivityWidth;
    if (node instanceof go.Group) {
      // see if there is an Activity Node at this point -- if not, connect the link directly with the Group's lifeline
      if (
        !node.memberParts.any((mem) => {
          const act = mem.data;
          return (
            act !== null &&
            act.start <= time &&
            time <= act.start + act.duration
          );
        })
      ) {
        aw = 0;
      }
    }
    return aw;
  }

  getLinkDirection(
    node,
    port,
    linkpoint,
    spot,
    from,
    ortho,
    othernode,
    otherport
  ) {
    const p = port.getDocumentPoint(go.Spot.Center);
    const op = otherport.getDocumentPoint(go.Spot.Center);
    const right = op.x > p.x;
    return right ? 0 : 180;
  }

  computePoints() {
    console.log("test");
    if (this.fromNode === this.toNode) {
      // also handle a reflexive link as a simple orthogonal loop
      const data = this.data;
      console.log(data);
      const time = data !== null ? data.time : this.time; // if not bound, assume this has its own "time" property
      const p = this.fromNode.port.getDocumentPoint(go.Spot.Center);
      const aw = this.findActivityWidth(this.fromNode, time);

      const x = p.x + aw / 2;
      const y = convertTimeToY(time);
      console.log(time);
      this.clearPoints();
      this.addPoint(new go.Point(x, y));
      this.addPoint(new go.Point(x + 50, y));
      this.addPoint(new go.Point(x + 50, y + 10));
      this.addPoint(new go.Point(x, y + 10));
      return true;
    } else {
      return super.computePoints();
    }
  }
}
// end MessageLink

// A custom LinkingTool that fixes the "time" (i.e. the Y coordinate)
// for both the temporaryLink and the actual newly created Link
export class MessagingTool extends go.LinkingTool {
  constructor() {
    super();

    this.temporaryLink = $(
      MessageLink,
      { selectionAdorned: true, curviness: 0 },
      $(go.Shape, { isPanelMain: true, stroke: "magenta", strokeWidth: 1 }),
      $(go.Shape, { toArrow: "OpenTriangle", stroke: "magenta" })
    );
  }

  isValidLink(fromnode, fromport, tonode, toport) {
    if (fromnode === tonode) {
      // 允许自环
      return true;
    }
    return super.isValidLink(fromnode, fromport, tonode, toport); // 默认逻辑
  }

  doActivate() {
    super.doActivate();
    const time = convertYToTime(this.diagram.firstInput.documentPoint.y);
    this.temporaryLink.time = Math.ceil(time); // round up to an integer value
  }

  insertLink(fromnode, fromport, tonode, toport) {
    const model = this.diagram.model;
    // specify the time of the message
    const startX = fromnode.data.loc.split(" ")[0];
    const endX = tonode.data.loc.split(" ")[0];
    const start = this.temporaryLink.time;
    const type = new Number(startX) <= new Number(endX) ? "sync" : "reply";
    const duration = 0;
    const newlink = {
      from: fromnode.data.key,
      to: tonode.data.key,
      time: start,
      type: type,
      text: "msg",
    };
    // and create a new Activity node data in the "to" group data
    const newact = {
      group: tonode.data.key,
      start: start,
      duration: duration,
    };
    model.addLinkData(newlink);
    model.addNodeData(newact);
    ensureLifelineHeights(model);
    const linkObj = this.diagram.findLinkForData(newlink); // 获取实际的 Link 对象
    return linkObj;
  }
}
// end MessagingTool

// A custom DraggingTool that supports dragging any number of MessageLinks up and down --
// changing their data.time value.
export class MessageDraggingTool extends go.DraggingTool {
  // override the standard behavior to include all selected Links,
  // even if not connected with any selected Nodes
  computeEffectiveCollection(parts, options) {
    const result = super.computeEffectiveCollection(parts, options);
    // add a dummy Node so that the user can select only Links and move them all
    result.add(new go.Node(), new go.DraggingInfo(new go.Point()));
    // normally this method removes any links not connected to selected nodes;
    // we have to add them back so that they are included in the "parts" argument to moveParts
    parts.each((part) => {
      if (part instanceof go.Link) {
        result.add(part, new go.DraggingInfo(part.getPoint(0).copy()));
      }
    });
    return result;
  }

  isValidLink(fromnode, fromport, tonode, toport) {
    if (fromnode === tonode) {
      // 允许自环
      return true;
    }
    return super.isValidLink(fromnode, fromport, tonode, toport); // 默认逻辑
  }

  // override to allow dragging when the selection only includes Links
  mayMove() {
    return !this.diagram.isReadOnly && this.diagram.allowMove;
  }

  // override to move Links (which are all assumed to be MessageLinks) by
  // updating their Link.data.time property so that their link routes will
  // have the correct vertical position
  moveParts(parts, offset, check) {
    super.moveParts(parts, offset, check);
    const it = parts.iterator;
    while (it.next()) {
      if (it.key instanceof go.Link) {
        const link = it.key;
        const startY = it.value.point.y; // DraggingInfo.point.y
        console.log(startY);
        let y = startY + offset.y; // determine new Y coordinate value for this link
        const cellY = this.gridSnapCellSize.height;
        y = Math.round(y / cellY) * cellY; // snap to multiple of gridSnapCellSize.height
        // console.log(y);
        const t = Math.max(0, convertYToTime(y));
        link.data.time = t;
        // link.diagram.model.set(link.data, "time", t);
        link.diagram.model.updateTargetBindings(link.data);
        link.invalidateRoute();
      }
    }
  }
}
// end MessageDraggingTool

function determineSegmentOffset(link) {
  // 假设根据线条方向决定y的偏移
  if (link.fromNode.location.x < link.toNode.location.x) {
    return new go.Point(0, -10); // 从左到右
  } else {
    return new go.Point(0, 10); // 从右到左
  }
}

function checkContextNoNull(textBlock, previousText, currentText, tips) {
  // 在这里执行名称的内容格式检查
  if (!currentText.trim()) {
    alert(tips);
    textBlock.text = previousText; // 如果检查失败，还原到之前的文本
  }
  // 可以添加更多的内容格式检查
}

function addRect(e, obj) {
  const item = obj.part.data;
  const model = e.diagram.model;

  const newact = {
    group: item.key,
    start: 0,
    duration: 0,
  };
  // 开始模型的更改事务
  model.startTransaction("add Rect");

  model.addNodeData(newact);
  ensureLifelineHeights(model);

  // 提交事务
  model.commitTransaction("add Rect");
}

function addObject(e, obj) {
  const model = e.diagram.model;
  const mousePoint = e.documentPoint;

  const newobj = {
    key: uuidv4(),
    text: "objectName",
    isGroup: true,
    duration: 1,
    loc: `${mousePoint.x} 0`,
  };
  // 开始模型的更改事务
  model.startTransaction("add Obj");

  model.addNodeData(newobj);
  ensureLifelineHeights(model);

  // 提交事务
  model.commitTransaction("add Obj");
}

function ensureLifelineHeights(model) {
  // iterate over all Activities (ignore Groups)
  const arr = model.nodeDataArray;
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
        model.setDataProperty(gr, "duration", max);
      }
    }
  }
}

function convertTarget(e, obj) {
  const item = obj.part.data;
  const from = item.from;
  const to = item.to;
  const myDiagram = e.diagram;

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

function convertType(e, obj, type) {
  const item = obj.part.data;
  const myDiagram = e.diagram;

  // 找到要更新的链接数据对象
  // 假设我们知道要更新的链接的key
  const linkKey = item.key;
  var linkData = myDiagram.model.findLinkDataForKey(linkKey);

  // 检查是否找到了链接数据
  if (linkData) {
    // 开始模型的更改事务
    myDiagram.model.startTransaction("convert Type");

    myDiagram.model.set(linkData, "type", type);

    // 提交事务
    myDiagram.model.commitTransaction("convert Type");
  }
}
