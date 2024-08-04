import dynamic from "next/dynamic";
import styles from "./index.module.scss";
import React, { useState, useRef } from "react";
import { type GetProp, type UploadProps } from "antd";
import MySpin from "../Spin";
import TextEditor from "../Editor/TextEditor";
import { ContentState, EditorState } from "draft-js";
import useStore from "@/store";
import * as XLSX from "xlsx";
import type { UploadFile } from "antd";

const Button = dynamic(() => import("antd").then((mod) => mod.Button));
const Upload = dynamic(() => import("antd").then((mod) => mod.Upload));
const UploadOutlined = dynamic(() =>
  import("@ant-design/icons").then((mod) => mod.UploadOutlined)
);
const LeftOutlined = dynamic(() =>
  import("@ant-design/icons").then((mod) => mod.LeftOutlined)
);
const RightOutlined = dynamic(() =>
  import("@ant-design/icons").then((mod) => mod.RightOutlined)
);
const Segmented = dynamic(() => import("antd").then((mod) => mod.Segmented));

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getFileContent = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    if (file.name.endsWith(".xls")) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  });
};

export default function ConvertFormat() {
  const file = useRef(new Map());
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState<"init" | "loading" | "finish">("init");
  const [fileName, setFileName] = useState("");

  const handleChangeDocument: UploadProps["onChange"] = (info) => {
    setLoading("loading");
    if (info.file.status === "done") {
      getFileContent(info.file.originFileObj)
        .then((content) => {
          if (info.file.name.endsWith(".xls")) {
            const workbook = XLSX.read(content, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json: { class: string; path: string }[] =
              XLSX.utils.sheet_to_json(worksheet);
            const newFileName =
              info.file.name.substring(0, info.file.name.lastIndexOf(".")) +
              ".json";
            const res = {};
            const dir = "D:/eclipse-committers/";
            for (let item of json) {
              const path = item.path
                .replaceAll("\\", "/")
                .substring(dir.length);
              if (res[item.class]) {
                const paths = res[item.class];
                paths.push({ line: 0, path });
                res[item.class] = paths;
              } else {
                const paths = [];
                paths.push({ line: 0, path });
                res[item.class] = paths;
              }
            }
            const contentState = ContentState.createFromText(
              JSON.stringify(res)
            );
            const initEditorState = EditorState.createWithContent(contentState);
            setFileName(newFileName);
            setEditorState(initEditorState);
            file.current.set(newFileName, res);
          }
          setLoading("finish");
        })
        .catch((error) => {
          console.log(error);
          setLoading("finish");
        });
    }
  };

  const handleSave = () => {
    const blob = new Blob([JSON.stringify(file.current.get(fileName))]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = fileName;
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className={styles.document} style={{ width: "100%", height: "100%" }}>
      <div
        style={loading === "init" ? { display: "block" } : { display: "none" }}
      >
        <Upload showUploadList={false} onChange={handleChangeDocument}>
          <Button icon={<UploadOutlined />}>上传文档</Button>
        </Upload>
      </div>
      <div
        style={
          loading === "loading" ? { display: "block" } : { display: "none" }
        }
      >
        <MySpin />
      </div>
      {loading === "finish" && (
        <>
          <div style={{ width: "100%" }}>
            <Segmented
              style={{ width: "100%", overflowX: "auto" }}
              options={[fileName]}
            />
          </div>
          <TextEditor initEditorState={editorState} />
          <Button onClick={handleSave}>保存</Button>
        </>
      )}
    </div>
  );
}
