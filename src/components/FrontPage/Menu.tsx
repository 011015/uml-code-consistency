import React, { useState } from "react";
import dynamic from "next/dynamic";
import type { MenuProps } from "antd";

const Menu = dynamic(() => import("antd").then((mod) => mod.Menu));

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  // icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    // icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    <div style={{ paddingTop: 8 }}>UML&Code Trace</div>,
    "front",
    [
      { type: "divider" },
      getItem("介绍", "front-intro"),
      getItem("核心功能", "front-func"),
    ],
    "group"
  ),
  getItem(
    <div style={{ paddingTop: 8 }}>CR(Class Diagram Recognize)</div>,
    "CR",
    [
      { type: "divider" },
      getItem("介绍", "CR-intro"),
      getItem("操作指南", "CR-guide"),
    ],
    "group"
  ),
  getItem(
    <div style={{ paddingTop: 8 }}>CT(Class Diagram Trace)</div>,
    "CT",
    [
      { type: "divider" },
      getItem("介绍", "CT-intro"),
      getItem("操作指南", "CT-guide"),
    ],
    "group"
  ),
  getItem(
    <div style={{ paddingTop: 8 }}>SR(Sequence Diagram Recognize)</div>,
    "SR",
    [
      { type: "divider" },
      getItem("介绍", "SR-intro"),
      getItem("操作指南", "SR-guide"),
    ],
    "group"
  ),
  getItem(
    <div style={{ paddingTop: 8 }}>ST(Sequence Diagram Trace)</div>,
    "ST",
    [
      { type: "divider" },
      getItem("介绍", "ST-intro"),
      getItem("操作指南", "ST-guide"),
    ],
    "group"
  ),
];

const MyMenu: React.FC<{
  setMenu: Function;
  style?: object;
  className?: string;
}> = ({ setMenu, style, className }) => {
  const [overflow, setOverflow] = useState("hidden");
  return (
    <Menu
      mode="inline"
      className={className}
      style={{ ...style, overflow }}
      items={items}
      defaultSelectedKeys={["front-intro"]}
      onClick={({ key }) => setMenu(key)}
      onMouseEnter={() => setOverflow("auto")}
      onMouseLeave={() => setOverflow("hidden")}
    />
  );
};

export default MyMenu;
