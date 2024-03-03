import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ReactDiagram, ReactPalette } from "gojs-react";
import { NodeData, Link } from "@/app/lib/definitions";
import { initDiagram, initPalette } from "@/diagram/class";
import { v4 as uuidv4 } from "uuid";

const Flex = dynamic(() => import("antd").then((mod) => mod.Flex));

function getNodes() {
  return fetch("api/nodes/read", {
    method: "get",
  });
}

function getLinks() {
  return fetch("api/links/read", {
    method: "get",
  });
}

function ClassDiagram() {
  const [nodes, setNodes] = useState<Array<NodeData>>([]);
  const [links, setLinks] = useState<Array<Link>>([]);
  const [json, setJson] = useState({});
  const myRef = useRef(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const responses = await Promise.all([getNodes(), getLinks()]);
        const initNodes = await responses[0].json();
        const initLinks = await responses[1].json();
        setNodes(initNodes.message);
        setLinks(initLinks.message);
      } catch (error) {
        // 处理可能的错误
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);
  function handleModelChange(changes: any) {
    console.log(changes);
    console.dir(nodes);
    const {
      insertedNodeKeys,
      modifiedNodeData,
      insertedLinkKeys,
      modifiedLinkData,
    } = changes;
    if (insertedNodeKeys) {
    }
    if (modifiedNodeData) {
    }
    if (insertedLinkKeys) {
    }
    if (modifiedLinkData) {
    }
  }
  function handleSave() {
    console.dir(nodes);
    const diagram = JSON.parse(myRef.current.getDiagram().model.toJson());
    console.log("save");
    setJson(diagram);
  }
  function handleLoad() {
    console.log("load");
    console.dir(json);
    setLinks(json.linkDataArray);
    setNodes(json.nodeDataArray);
  }
  return (
    <Flex style={{ height: "100%" }}>
      <ReactPalette
        initPalette={initPalette}
        divClassName="myDiagramPalette"
        style={{ height: "100%", width: 200 }}
        nodeDataArray={[{ name: "className" }]}
      />
      <Flex vertical style={{ flex: 1, height: "100%" }}>
        <ReactDiagram
          ref={myRef}
          style={{
            flex: 1,
            border: "solid 1px black",
            backgroundColor: "white",
          }}
          initDiagram={initDiagram}
          divClassName="myDiagram"
          nodeDataArray={nodes}
          linkDataArray={links}
          onModelChange={handleModelChange}
        />
        <Flex>
          <button onClick={handleSave}>保存</button>
          <button onClick={handleLoad}>加载</button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ClassDiagram;
