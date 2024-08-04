import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import UploadDiagram from "./UploadDiagram";
import UploadFiles from "./UploadFiles";
import ConvertFormat from "./ConvertFormat";
import { v4 as uuidv4 } from "uuid";
import useStore from "@/store";
import ParserDiagram from "./ParserDiagram";
import { cardData } from "./data";
import FrontPage from "./FrontPage";
const Tabs = dynamic(() => import("antd").then((mod) => mod.Tabs));
const Modal = dynamic(() => import("antd").then((mod) => mod.Modal));
const Form = dynamic(() => import("antd").then((mod) => mod.Form));
const FormItem = dynamic(() => import("antd").then((mod) => mod.Form.Item));
const Input = dynamic(() => import("antd").then((mod) => mod.Input));
const Button = dynamic(() => import("antd").then((mod) => mod.Button));
const RadioGroup = dynamic(() => import("antd").then((mod) => mod.Radio.Group));
const RadioButton = dynamic(() =>
  import("antd").then((mod) => mod.Radio.Button)
);

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface TabType {
  label: JSX.Element;
  icon?: JSX.Element;
  children: JSX.Element;
  key: string;
  closable?: boolean;
}

const MyTabs = () => {
  const [items, setItems] = useState<Array<TabType>>([
    {
      label: (
        <div className="tabs-label">
          <img src="/logo.png" />
          <span>UML&Code Trace</span>
        </div>
      ),
      children: <FrontPage />,
      key: "0",
      closable: false,
    },
  ]);
  const [show, setShow] = useState(false);
  const {
    activeKey,
    setActiveKey,
    activeData,
    setActiveData,
    removeActiveData,
    curDiagFile,
    setCurDiagFile,
    diagData,
    resetDiagData,
    curDocFile,
    setCurDocFile,
    docsData,
    resetDocsData,
    curCodeFile,
    setCurCodeFile,
    codesData,
    resetCodesData,
    onSelectTree,
    setOnSelectTree,
  } = useStore();

  useEffect(() => {
    setData();
    setActiveKey(items[0].key);
  }, []);

  const setData = (
    data = {
      diagData: "",
      docsData: new Map(),
      codesData: new Map(),
      curDiagFile: "",
      curDocFile: "",
      curCodeFile: "",
      onSelectTree: new Function(),
    }
  ) => {
    setCurDiagFile(data.curDiagFile);
    resetDiagData(data.diagData);
    setCurDocFile(data.curDocFile);
    resetDocsData(data.docsData);
    setCurCodeFile(data.curCodeFile);
    resetCodesData(data.codesData);
    setOnSelectTree(data.onSelectTree);
  };

  const onChange = (newActiveKey: string) => {
    const tempData = {
      diagData,
      docsData,
      codesData,
      curDiagFile,
      curDocFile,
      curCodeFile,
      onSelectTree,
    };
    const curData = activeData.get(newActiveKey);
    setActiveData(activeKey, tempData);
    setData(curData);
    setActiveKey(newActiveKey);
  };

  const add = () => {
    setShow(true);
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
      const curData = activeData.get(newActiveKey);
      setData(curData);
    }
    removeActiveData(targetKey);
    setActiveKey(newActiveKey);
    setItems(newPanes);
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

  const handleCancel = () => {
    setShow(false);
  };

  const handleFinish = (values: any) => {
    let { labelName, labelType } = values;
    const newActiveKey = uuidv4();
    const newPanes = [...items];
    let child;
    switch (labelType) {
      case "class-recog": {
        child = <UploadDiagram type="class" />;
        labelName = "CR-" + labelName;
        break;
      }
      case "class-trace": {
        child = <UploadFiles type="class" />;
        labelName = "CT-" + labelName;
        break;
      }
      case "sequence-recog": {
        child = <UploadDiagram type="sequence" />;
        labelName = "SR-" + labelName;
        break;
      }
      case "sequence-trace": {
        child = <UploadFiles type="sequence" />;
        labelName = "ST-" + labelName;
        break;
      }
      default: {
        child = <UploadDiagram type="class" />;
        labelName = "CR-" + labelName;
      }
    }

    newPanes.push({
      label: (
        <div className="tabs-label">
          <img src={`./images/${labelType}.png`} />
          <span>{labelName}</span>
        </div>
      ),
      children: child,
      key: newActiveKey,
    });
    const tempData = {
      diagData,
      docsData,
      codesData,
      curDiagFile,
      curDocFile,
      curCodeFile,
      onSelectTree,
    };
    setActiveData(activeKey, tempData);
    setData();
    setActiveKey(newActiveKey);
    setItems(newPanes);
    setShow(false);
  };

  return (
    <>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
        style={{ height: "100%" }}
      />

      {show && (
        <Modal
          open={show}
          title="新增项目"
          onCancel={handleCancel}
          footer={null}
        >
          <Form onFinish={handleFinish} layout="vertical">
            <FormItem
              label="项目名称"
              name="labelName"
              rules={[{ required: true, message: "请输入项目名称" }]}
            >
              <Input />
            </FormItem>
            <FormItem
              label="项目类型"
              name="labelType"
              rules={[{ required: true, message: "请选择项目类型" }]}
            >
              <RadioGroup>
                {cardData.map((card, index) => (
                  <RadioButton
                    key={index}
                    value={card.type}
                    style={{ height: "auto" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "15px 0",
                      }}
                    >
                      <img
                        src={`./images/${card.type}.png`}
                        style={{ width: "60px", height: "60px" }}
                      />
                      <div style={{ textAlign: "center" }}>{card.title}</div>
                    </div>
                  </RadioButton>
                ))}
              </RadioGroup>
            </FormItem>
            <div
              style={{
                display: "flex",
                justifyItems: "center",
                alignContent: "center",
                columnGap: 10,
              }}
            >
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button type="primary" onClick={handleCancel}>
                取消
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default MyTabs;
