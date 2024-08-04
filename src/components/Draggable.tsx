import React, { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./index.module.scss";
const Flex = dynamic(() => import("antd").then((mod) => mod.Flex));
interface Props {
  children: React.JSX.Element[];
  width: string[];
}
export function Draggable({ children, width }: Props) {
  const [resize, setResize] = useState(0);
  const [clientX, setClientX] = useState(0);
  const [openResize, setOpenResize] = useState(false);
  const [preSize, setPreSize] = useState(0);

  return (
    <Flex
      style={{
        width: "100%",
        height: "100%",
        cursor: openResize ? "e-resize" : "default",
        overflow: "hidden",
      }}
      onMouseMove={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (openResize) {
          const offset = e.clientX - clientX;
          setResize(preSize + offset);
        }
      }}
      onMouseUp={(e) => {
        if (openResize) {
          setOpenResize(false);
        }
      }}
    >
      {React.cloneElement(children[0], {
        style: {
          minWidth: "5%",
          maxWidth: "95%",
          width: `calc(${width[0]} + ${resize}px)`,
          ...children[0].props.style,
        },
      })}
      <div
        className={styles.skeleton}
        onMouseDown={(e) => {
          setOpenResize(true);
          setClientX(e.clientX);
          setPreSize(resize);
        }}
      ></div>
      {React.cloneElement(children[1], {
        style: {
          minWidth: "5%",
          maxWidth: "95%",
          width: `calc(${width[1]} - ${resize}px)`,
          ...children[1].props.style,
        },
      })}
    </Flex>
  );
}
