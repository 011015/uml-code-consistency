"use client";
import React, { useState } from "react";
import type { GetProp, UploadProps } from "antd";
import dynamic from "next/dynamic";
import styles from "./index.module.scss";
const Upload = dynamic(() => import("antd").then((mod) => mod.Upload));
const LoadingOutlined = dynamic(() =>
  import("@ant-design/icons").then((mod) => mod.LoadingOutlined)
);
const PlusOutlined = dynamic(() =>
  import("@ant-design/icons").then((mod) => mod.PlusOutlined)
);

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    alert("You can only upload JPG/PNG file!");
    // message.error("You can only upload JPG/PNG file!");
  }
  return isJpgOrPng;
};

const UploadDiagram: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      const formData = new FormData();
      formData.append("picture", info.file.originFileObj as FileType);
      getBase64(info.file.originFileObj as FileType, (url) => {
        fetch("http://localhost:8888/recog/class-diagram", {
          method: "POST",
          mode: "cors",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            console.dir(data);
          })
          .catch((error) => {
            console.log("出现错误: " + error);
          });
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className={styles.upload}>
      <Upload
        name="avatar"
        listType="picture-card"
        className={styles.uploadItem}
        showUploadList={false}
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </div>
  );
};

export default UploadDiagram;
