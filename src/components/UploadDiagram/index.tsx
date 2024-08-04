"use client";
import React, { useState } from "react";
import { type GetProp, type UploadProps } from "antd";
import { NodeData, Link } from "@/app/lib/definitions";
import dynamic from "next/dynamic";
import styles from "./index.module.scss";
import MySpin from "../Spin";
import ClsDiagramEditor from "../Editor/ClsDiagramEditor";
import useStore from "@/store";
import { v4 as uuidv4 } from "uuid";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Upload = dynamic(() => import("antd").then((mod) => mod.Upload));
const Button = dynamic(() => import("antd").then((mod) => mod.Button));
const PlusOutlined = dynamic(() =>
  import("@ant-design/icons").then((mod) => mod.PlusOutlined)
);
const Title = dynamic(() => import("antd").then((mod) => mod.Typography.Title));

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(img);
  });
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    alert("You can only upload JPG/PNG file!");
    // message.error("You can only upload JPG/PNG file!");
  }
  return isJpgOrPng;
};

const UploadIcon = () => {
  return (
    <svg
      t="1713872942643"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4699"
      id="mx_n_1713872942644"
      width="20"
      height="20"
    >
      <path
        d="M856 96H136c-39.701 0-72 32.299-72 72v656c0 39.701 32.299 72 72 72h434.515c17.673 0 32-14.327 32-32s-14.327-32-32-32H136c-4.336 0-8-3.664-8-8V698.319l149.21-106.956a7.934 7.934 0 0 1 6.441 0.255l178 108.577 1.156 0.673c10.997 6.093 23.011 9.09 34.956 9.09 16.157-0.002 32.189-5.489 45.377-16.219L864 434.527v137.438c0 17.673 14.327 32 32 32s32-14.327 32-32V168c0-39.701-32.299-72-72-72zM502.873 643.994l-0.117 0.095a7.955 7.955 0 0 1-8.563 0.989l-178-108.578-1.156-0.672c-22.012-12.195-48.247-12.112-70.18 0.22l-1.531 0.861L128 619.575V168c0-4.336 3.664-8 8-8h720c4.336 0 8 3.664 8 8v184.251L502.873 643.994z"
        fill="#2e75d3"
        p-id="4700"
      ></path>
      <path
        d="M304 224c-61.757 0-112 50.243-112 112s50.243 112 112 112 112-50.243 112-112-50.243-112-112-112z m0 160c-26.467 0-48-21.533-48-48s21.533-48 48-48 48 21.533 48 48-21.533 48-48 48zM928 768h-96v-96c0-17.6-14.4-32-32-32s-32 14.4-32 32v96h-96c-17.6 0-32 14.4-32 32s14.4 32 32 32h96v96c0 17.6 14.4 32 32 32s32-14.4 32-32v-96h96c17.6 0 32-14.4 32-32s-14.4-32-32-32z"
        fill="#2e75d3"
        p-id="4701"
      ></path>
    </svg>
  );
};

let start: Date, end: Date;

const UploadDiagram: React.FC<{ type: string }> = ({ type }) => {
  const [loading, setLoading] = useState<"init" | "loading" | "finish">("init");
  const [imageUrl, setImageUrl] = useState<string>();

  const [nodes, setNodes] = useState<Array<NodeData>>([]);
  const [links, setLinks] = useState<Array<Link>>([]);
  const [template, setTemplate] = useState(new Map());
  const { saveSVG } = useStore();

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "done") {
      setLoading("loading");
      getBase64(info.file.originFileObj as FileType).then((url) =>
        setImageUrl(url as string)
      );
      const formData = new FormData();
      formData.append("picture", info.file.originFileObj as FileType);
      const fetchUrl =
        type === "class"
          ? "http://localhost:8888/recog/class-diagram"
          : "http://localhost:8888/recog/sequence-diagram";
      fetch(fetchUrl, {
        method: "POST",
        mode: "cors",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setNodes(data.nodeDataArray);
          setLinks(data.linkDataArray);
          let temp;
          if (type === "class") {
            temp = {
              key: uuidv4(),
              name: "className",
              location: "60 40",
              // titleFont, contentFont, btnDesiredSize
              ...data.size,
            };
          } else {
            temp = {
              key: uuidv4(),
              text: "objectName",
              isGroup: true,
              duration: 1,
            };
          }
          setTemplate(temp);
          setLoading("finish");
          start = new Date();
        })
        .catch((error) => {
          window.alert("图片不符合要求，解析失败！");
          setLoading("finish");
        });
    }
  };

  const uploadButton = (
    <button
      style={{ border: 0, background: "none", cursor: "pointer" }}
      type="button"
    >
      <UploadIcon />
      <div style={{ marginTop: 8 }}>点击上传图片</div>
    </button>
  );

  return (
    <>
      {imageUrl ? (
        <div className={styles.diagContainer}>
          <div>
            <div
              style={{
                width: "60%",
                height: "100%",
                borderRadius: 8,
                border: "1px solid #d9d9d9",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                backgroundColor: "white",
              }}
            >
              <Title
                level={4}
                style={{
                  margin: 0,
                  textAlign: "center",
                  padding: 5,
                  borderBottom: "1px solid #d9d9d9",
                }}
              >
                识别结果
              </Title>
              <div className={styles.editorContainer}>
                {loading === "loading" ? (
                  <MySpin />
                ) : (
                  <ClsDiagramEditor
                    initNodes={nodes}
                    initLinks={links}
                    template={template}
                    type={type}
                  />
                )}
              </div>
            </div>
            <div
              style={{
                width: "40%",
                height: "100%",
                borderRadius: 8,
                border: "1px solid #d9d9d9",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <Title
                level={4}
                style={{
                  margin: 0,
                  textAlign: "center",
                  padding: 5,
                  backgroundColor: "white",
                  borderBottom: "1px solid #d9d9d9",
                }}
              >
                原图
              </Title>
              <div className={styles.imgContainer}>
                <TransformWrapper minScale={0.2}>
                  <TransformComponent
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                      cursor: "move",
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ height: "100%" }}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={saveSVG}>保存SVG图片</Button>
            <Button
              onClick={() => {
                end = new Date();
                const time = Math.ceil(
                  (end.getTime() - start.getTime()) / 1000
                );
                console.log("手动编辑图共花费了" + time.toString() + "秒");
              }}
            >
              计算时间
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.upload}>
          <Upload
            listType="picture-card"
            className={styles.uploadItem}
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {uploadButton}
          </Upload>
          {type === "class" ? (
            <span>CR——对符合标准的类图进行识别</span>
          ) : (
            <span>SR——对符合标准的顺序图进行识别</span>
          )}
          <span>请上传 JPG/PNG 文件</span>
        </div>
      )}
    </>
  );
};

export default UploadDiagram;
