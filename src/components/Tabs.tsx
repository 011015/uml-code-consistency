import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import UploadDiagram from "./UploadDiagram";
const Tabs = dynamic(() => import("antd").then((mod) => mod.Tabs));

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface Props {
  initActiveKey: string;
  initItems: any;
}

const MyTabs: React.FC<Props> = ({ initActiveKey, initItems }: Props) => {
  const [activeKey, setActiveKey] = useState(initActiveKey);
  const [items, setItems] = useState(initItems);
  const newTabIndex = useRef(0);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: "New Tab",
      children: <UploadDiagram />,
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
      style={{ height: "100%" }}
    />
  );
};

export default MyTabs;
