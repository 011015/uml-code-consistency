import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ReactDiagram, ReactPalette } from "gojs-react";
import { NodeData, Link } from "@/app/lib/definitions";
import {
  initDiagram as classDiagram,
  initPalette as classPalette,
} from "@/diagram/class";
import {
  initDiagram as sequenceDiagram,
  initPalette as sequencePalette,
} from "@/diagram/sequence";

import useStore from "@/store";
import styles from "./index.module.scss";

const Flex = dynamic(() => import("antd").then((mod) => mod.Flex));
const Text = dynamic(() => import("antd").then((mod) => mod.Typography.Text));

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

let timer: any;

function ClsDiagramEditor({
  initNodes = [],
  initLinks = [],
  template = new Map(),
  type,
}: {
  initNodes?: NodeData[];
  initLinks?: Link[];
  template: Map<string, string>;
  type: string;
}) {
  const [nodes, setNodes] = useState<Array<NodeData>>(initNodes);
  const [links, setLinks] = useState<Array<Link>>(initLinks);
  const myRef = useRef(null);
  const { setSaveSVG, resetDiagData } = useStore();

  useEffect(() => {
    setNodes(initNodes);
  }, [initNodes]);

  useEffect(() => {
    setLinks(initLinks);
  }, [initLinks]);

  useEffect(() => {
    setSaveSVG(handleSaveSVG);
  }, []);

  function handleSaveSVG() {
    const myDiagram = myRef.current.getDiagram();
    const svg = myDiagram.makeSvg({
      scale: 1,
      background: "white",
    });
    const data = myDiagram.model.toJson();
    svg.setAttribute("data-json", data);

    if (type === "class") {
      const size = JSON.stringify(template);
      svg.setAttribute("data-size", size);
    }
    const svgstr = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgstr], { type: "image/svg+xml" });
    const url = window.URL.createObjectURL(blob);
    const filename =
      type === "class" ? "classDiagram.svg" : "sequenceDiagram.svg";
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  const handleChange = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const myDiagram = myRef.current.getDiagram();
      const data = myDiagram.model.toJson();
      resetDiagData(data);
    }, 200);
  };

  return (
    <Flex style={{ height: "100%", width: "100%" }} vertical>
      <div style={type === "class" ? { display: "flex" } : { display: "none" }}>
        <Text
          style={{
            margin: 0,
            padding: 5,
            writingMode: "tb",
            fontWeight: "bold",
            borderRight: "1px solid #d9d9d9",
          }}
        >
          工具栏
        </Text>
        <ReactPalette
          initPalette={type === "class" ? classPalette : sequencePalette}
          divClassName={styles.myDiagramPalette}
          nodeDataArray={[template]}
        />
      </div>
      <Flex vertical style={{ flex: "1", height: "100%", width: "100%" }}>
        <ReactDiagram
          ref={myRef}
          style={{
            flex: 1,
            borderTop: "solid 1px #d9d9d9",
            backgroundColor: "white",
          }}
          initDiagram={type === "class" ? classDiagram : sequenceDiagram}
          divClassName={styles.myDiagram}
          nodeDataArray={nodes}
          linkDataArray={links}
          onModelChange={(e) => {
            console.log(e);
          }}
          onModelChange={handleChange}
        />
      </Flex>
    </Flex>
  );
}

export default ClsDiagramEditor;
