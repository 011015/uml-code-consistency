import dynamic from "next/dynamic";
import styles from "./index.module.scss";
import React, { useState, useRef, useEffect } from "react";
import { type GetProp, type UploadProps, type TreeDataNode } from "antd";
import { NodeData, Link } from "@/app/lib/definitions";
import MySpin from "../Spin";
import ClsDiagramEditor from "../Editor/ClsDiagramEditor";
import TextEditor from "../Editor/TextEditor";
import { ContentState, EditorState } from "draft-js";
import CodeEditor from "../Editor/CodeEditor";
import useStore from "@/store";
import * as XLSX from "xlsx";
import type { UploadFile } from "antd";
import { v4 as uuidv4 } from "uuid";
import { Draggable } from "../Draggable";
import JSZip from "jszip";

const Flex = dynamic(() => import("antd").then((mod) => mod.Flex));
const Button = dynamic(() => import("antd").then((mod) => mod.Button));
const Upload = dynamic(() => import("antd").then((mod) => mod.Upload));
const Tree = dynamic(() => import("antd").then((mod) => mod.Tree));
const UploadOutlined = dynamic(() =>
  import("@ant-design/icons").then((mod) => mod.UploadOutlined)
);
const UpOutlined = dynamic(() =>
  import("@ant-design/icons").then((mod) => mod.UpOutlined)
);
const DownOutlined = dynamic(() =>
  import("@ant-design/icons").then((mod) => mod.DownOutlined)
);
const LeftOutlined = dynamic(() =>
  import("@ant-design/icons").then((mod) => mod.LeftOutlined)
);
const RightOutlined = dynamic(() =>
  import("@ant-design/icons").then((mod) => mod.RightOutlined)
);
const ExclamationCircleOutlined = dynamic(() =>
  import("@ant-design/icons").then((mod) => mod.ExclamationCircleOutlined)
);
const Segmented = dynamic(() => import("antd").then((mod) => mod.Segmented));
const Menu = dynamic(() => import("antd").then((mod) => mod.Menu));
const Form = dynamic(() => import("antd").then((mod) => mod.Form));
const FormItem = dynamic(() => import("antd").then((mod) => mod.Form.Item));

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

// const UploadFiles = () => {
//   const normFile = (e: any) => {
//     console.log("test: ");
//     console.dir(e);
//     if (Array.isArray(e)) {
//       return e;
//     }
//     return e?.fileList;
//   };
//   const handleFinish = (values) => {
//     console.log("sucess:");
//     console.dir(values);
//   };

//   return (
//     <Flex
//       style={{
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Form
//         labelCol={{ span: 12 }}
//         wrapperCol={{ span: 12 }}
//         onFinish={handleFinish}
//         style={{ width: "100%" }}
//       >
//         <FormItem
//           label="上传UML图"
//           name="xmlFile"
//           valuePropName="fileList"
//           getValueFromEvent={normFile}
//         >
//           <Upload>
//             <Button icon={<UploadOutlined />}>上传图片</Button>
//           </Upload>
//         </FormItem>
//         <FormItem
//           label="上传设计文档"
//           name="docFiles"
//           valuePropName="fileList"
//           getValueFromEvent={normFile}
//         >
//           <Upload directory>
//             <Button icon={<UploadOutlined />}>上传文档</Button>
//           </Upload>
//         </FormItem>
//         <FormItem
//           label="上传代码文件夹"
//           name="codeFiles"
//           valuePropName="fileList"
//           getValueFromEvent={normFile}
//         >
//           <Upload directory>
//             <Button icon={<UploadOutlined />}>上传代码</Button>
//           </Upload>
//         </FormItem>
//         <FormItem wrapperCol={{ offset: 12, span: 12 }}>
//           <Button type="primary" htmlType="submit">
//             提交
//           </Button>
//         </FormItem>
//       </Form>
//     </Flex>
//   );
// };

const getFileContent = (file) => {
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

const UploadDiagram = ({ type }: { type: string }) => {
  const [nodes, setNodes] = useState<Array<NodeData>>([]);
  const [links, setLinks] = useState<Array<Link>>([]);
  const [loading, setLoading] = useState<"init" | "loading" | "finish">("init");
  const [openEditor, setOpenEditor] = useState(true);
  const [show, setShow] = useState(false);
  const [template, setTemplate] = useState(new Map());
  const { setCurDiagFile, resetDiagData } = useStore();

  const beforeUploadDiagram = (file: FileType) => {
    const isSvg = file.type === "image/svg+xml";
    if (!isSvg) {
      alert("You can only upload SVG file!");
      // message.error("You can only upload JPG/PNG file!");
    }
    return isSvg;
  };

  const handleChangeDiagram: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading("loading");
    }
    if (info.file.status === "done") {
      getFileContent(info.file.originFileObj as FileType)
        .then((content) => {
          const parser = new DOMParser();
          const svg = parser.parseFromString(
            content as string,
            "image/svg+xml"
          );
          const json = svg.documentElement.getAttribute("data-json");
          const size = svg.documentElement.getAttribute("data-size");
          const data = JSON.parse(json ?? "{}");
          setCurDiagFile(info.file.name);
          resetDiagData(json);
          setNodes(data.nodeDataArray);
          setLinks(data.linkDataArray);
          let temp;
          if (type === "class") {
            temp = {
              key: uuidv4(),
              name: "className",
              location: "60 40",
              // titleFont, contentFont, btnDesiredSize
              ...JSON.parse(size ?? "{}"),
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
        })
        .catch((err) => {
          console.log(err);
          setLoading("finish");
        });
    }
  };

  return (
    <div
      className={
        show
          ? `${styles.arrowOuterContainer} ${styles.selectContainer}`
          : styles.arrowOuterContainer
      }
      style={openEditor ? { width: "45%", flex: "1 1 45%" } : { width: "0" }}
    >
      <div
        className={styles.diagram}
        style={openEditor ? { width: "100%" } : { width: "0" }}
      >
        <div
          className={styles.upload}
          style={loading === "init" ? { display: "flex" } : { display: "none" }}
        >
          <Upload
            beforeUpload={beforeUploadDiagram}
            onChange={handleChangeDiagram}
          >
            <Button icon={<UploadOutlined />}>上传图片</Button>
          </Upload>
          <span>请上传 SVG 文件</span>
        </div>
        <div
          style={
            loading === "loading" ? { display: "flex" } : { display: "none" }
          }
        >
          <MySpin />
        </div>
        {loading === "finish" && (
          <ClsDiagramEditor
            initNodes={nodes}
            initLinks={links}
            template={template}
            type={type}
          />
        )}
      </div>
      <div
        className={styles.arrowColumnContainer}
        style={
          openEditor
            ? { transform: "translate(0, -50%)" }
            : { transform: "translate(100%, -50%)" }
        }
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <Button
          style={show ? { display: "block" } : { display: "none" }}
          className={
            openEditor
              ? `${styles.columnArrow} ${styles["column-arrow-open"]}`
              : `${styles.columnArrow} ${styles["column-arrow-close"]}`
          }
          onClick={() => {
            setOpenEditor(!openEditor);
            setShow(!show);
          }}
        >
          {openEditor ? <LeftOutlined /> : <RightOutlined />}
        </Button>
      </div>
    </div>
  );
};
const UploadDocument = ({ type }: any) => {
  // <文档路径名, 文档文本>
  // const [documents, setDocuments] = useState(new Map());
  // const [fileNames, setFileNames] = useState<string[]>([]);
  const fileNames = useRef<string[]>([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState<"init" | "loading" | "finish">("init");
  const [openEditor, setOpenEditor] = useState(true);
  const [show, setShow] = useState(false);
  const { docsData, setCurDocFile, setDocsData } = useStore();

  const handleChangeDocument: UploadProps["onChange"] = (info) => {
    if (info.fileList.some((file) => file.status === "uploading")) {
      setLoading("loading");
    }
    if (info.fileList.every((file) => file.status === "done")) {
      const newFileList = info.fileList.filter((uploadFile: UploadFile) => {
        const file = uploadFile.originFileObj as FileType;
        let isStandard =
          type === "class"
            ? file.name.endsWith(".txt") || file.name.endsWith(".xls")
            : file.name.endsWith(".json");
        return isStandard;
      });
      const promises = newFileList.map((uploadFile: UploadFile) => {
        const file = uploadFile.originFileObj as FileType;
        return getFileContent(file);
      });
      Promise.all(promises)
        .then((contents) => {
          let text = "";
          contents.map((content, index) => {
            const file = newFileList[index];

            // 循环里需要使用函数式更新，因为状态更新是异步的，以确保是基于最新的状态进行更新
            // setFileNames((fileNames) => [...fileNames, file.name]);
            // react的状态更新机制依赖于不可变数据模式，如下并不会触发组件重新渲染
            // setDocuments(documents.set(file.name, initEditorState));

            if (file.name.endsWith(".xls")) {
              const workbook = XLSX.read(content, { type: "binary" });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const json = XLSX.utils.sheet_to_json(worksheet);
              const newFileName = file.name.substring(
                0,
                file.name.lastIndexOf(".")
              );
              console.dir(json);
              setDocsData(newFileName + ".json", JSON.stringify(json));
            } else {
              if (file.name.indexOf("-ziyan") === -1) {
                fileNames.current.push(file.name);
              }
              setDocsData(file.name, content);
              if (text === "") {
                // 展示第一个文档内容
                text = content as string;
              }
            }
            // documents.current.set(file.name, content);
          });
          const contentState = ContentState.createFromText(text);
          const initEditorState = EditorState.createWithContent(contentState);
          setEditorState(initEditorState);
          setLoading("finish");
          setOpenEditor(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading("finish");
        });
    }
  };
  return (
    <div
      className={
        show
          ? `${styles.arrowOuterContainer} ${styles.selectContainer}`
          : styles.arrowOuterContainer
      }
      style={openEditor ? { width: "10%", flex: "1 1 10%" } : { width: "0" }}
    >
      <div
        className={styles.document}
        style={
          openEditor ? { width: "100%" } : { width: "0", overflow: "hidden" }
        }
      >
        <div
          className={styles.upload}
          style={loading === "init" ? { display: "flex" } : { display: "none" }}
        >
          <Upload
            multiple={type === "class"}
            showUploadList={false}
            onChange={handleChangeDocument}
          >
            <Button icon={<UploadOutlined />}>上传文档</Button>
          </Upload>
          {type === "class" ? (
            <span>请上传 TXT/XLS 文件</span>
          ) : (
            <span>请上传 JSON 文件</span>
          )}
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
                options={fileNames.current}
                onChange={(value) => {
                  setCurDocFile(value);
                  const content = docsData.get(value);
                  const contentState = ContentState.createFromText(
                    content as string
                  );
                  const initEditorState =
                    EditorState.createWithContent(contentState);
                  setEditorState(initEditorState);
                }}
              />
            </div>
            <TextEditor initEditorState={editorState} />
          </>
        )}
      </div>
      <div
        className={styles.arrowColumnContainer}
        style={
          openEditor
            ? { transform: "translate(0, -50%)" }
            : { transform: "translate(100%, -50%)" }
        }
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <Button
          style={show ? { display: "block" } : { display: "none" }}
          className={
            openEditor
              ? `${styles.columnArrow} ${styles["column-arrow-open"]}`
              : `${styles.columnArrow} ${styles["column-arrow-close"]}`
          }
          onClick={() => {
            setOpenEditor(!openEditor);
            setShow(!show);
          }}
        >
          {openEditor ? <LeftOutlined /> : <RightOutlined />}
        </Button>
      </div>
    </div>
  );
};

const UploadCode = ({ uuid }: { uuid: string }) => {
  const fileTree = useRef<TreeDataNode[]>([]);
  const [loading, setLoading] = useState<"init" | "loading" | "finish">("init");
  const [openEditor, setOpenEditor] = useState(true);
  const [show, setShow] = useState(false);
  const [code, setCode] = useState({ code: "", line: 0 });
  const [expandedKeys, setExpandedKeys] = useState<Array<string>>([]);
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
  const myRef = useRef(null);

  const {
    setCurCodeFile,
    setCodesData,
    codesData,
    setOnSelectTree,
    onSelectTree,
  } = useStore();

  useEffect(() => {
    setOnSelectTree(
      ({
        line = 0,
        path = fileTree.current[0].title as string,
      }: {
        line: number;
        path: string;
      }) => {
        setCurCodeFile(path);
        setCode({ code: codesData.get(path), line });
        const fileDir = [];
        for (let index = path.indexOf("/"); index !== -1; ) {
          fileDir.push(path.substring(0, index));
          index = path.indexOf("/", index + 1);
        }
        setExpandedKeys(fileDir);
        setSelectedKeys([path]);
      }
    );
  }, []);
  const createNode = (
    node: TreeDataNode,
    curFilePaths: string[],
    newFilePaths: string[]
  ) => {
    if (newFilePaths.length === 0) {
      return;
    }
    if (node.children) {
      let i = 0;
      for (; i < node.children.length; i++) {
        if (node.children[i].title === newFilePaths[0]) {
          curFilePaths.push(newFilePaths.shift() as string);
          createNode(node.children[i], curFilePaths, newFilePaths);
          break;
        }
      }
      if (i === node.children.length) {
        curFilePaths.push(newFilePaths.shift() as string);
        const child = {
          title: curFilePaths[curFilePaths.length - 1],
          key: curFilePaths.join("/"),
          // icon: <CarryOutOutlined />,
        };
        node.children.push(child);
        createNode(child, curFilePaths, newFilePaths);
      }
    } else {
      curFilePaths.push(newFilePaths.shift() as string);
      const child = {
        title: curFilePaths[curFilePaths.length - 1],
        key: curFilePaths.join("/"),
        // icon: <CarryOutOutlined />,
      };
      node.children = [];
      node.children.push(child);
      createNode(child, curFilePaths, newFilePaths);
    }
  };

  const handleChangeCode = () => {
    setLoading("loading");
    const fileList = Array.from(myRef.current.files).filter((file) => {
      const isJava = file.webkitRelativePath.endsWith(".java");
      const filter = file.webkitRelativePath.includes("src/test/");
      return isJava && !filter;
    });

    const promises = fileList.map((file) => getFileContent(file));
    Promise.all(promises)
      .then((contents) => {
        contents.map((content, index) => {
          const file = fileList[index];
          // 循环里需要使用函数式更新，因为状态更新是异步的，以确保是基于最新的状态进行更新
          if (file) {
            const newFilePaths = file.webkitRelativePath.split("/");
            const curFilePaths = newFilePaths.splice(0, 1);
            if (fileTree.current.length > 0) {
              const root = fileTree.current[0];
              createNode(root, curFilePaths, newFilePaths);
            } else {
              const root = {
                title: curFilePaths[0],
                key: curFilePaths[0],
                // icon: <CarryOutOutlined />,
              };
              fileTree.current.push(root);
              createNode(root, curFilePaths, newFilePaths);
              setExpandedKeys([root.key]);
              setSelectedKeys([root.key]);
            }
            // react的状态更新机制依赖于不可变数据模式，如下并不会触发组件重新渲染
            // codes.current.set(file.originFileObj.webkitRelativePath, content);
            setCodesData(file.webkitRelativePath, content);
          }
        });
        setLoading("finish");
      })
      .catch((err) => {
        console.log(err);
        setLoading("finish");
      });
  };

  return (
    <div
      className={
        show
          ? `${styles.arrowOuterContainer} ${styles.selectContainer}`
          : styles.arrowOuterContainer
      }
      style={openEditor ? { width: "45%", flex: "1 1 45%" } : { width: "0" }}
    >
      <div
        className={styles.code}
        style={
          openEditor ? { width: "100%" } : { width: "0", overflow: "hidden" }
        }
      >
        <div
          style={{
            display: loading === "init" ? "flex" : "none",
            position: "relative",
          }}
        >
          <div className={styles.upload}>
            <label
              htmlFor={uuid}
              className="ant-btn css-dev-only-do-not-override-15oevsh ant-btn-default"
            >
              <span className="ant-btn-icon">
                <UploadOutlined />
              </span>
              <span>上传代码</span>
            </label>
            <span>请上传 JAVA 文件</span>
          </div>

          <input
            ref={myRef}
            id={uuid}
            className={styles.btnCode}
            type="file"
            webkitdirectory="true"
            onChange={handleChangeCode}
          />
        </div>
        <div
          style={
            loading === "loading" ? { display: "block" } : { display: "none" }
          }
        >
          <MySpin />
        </div>
        {loading === "finish" && (
          <Draggable
            children={[
              <div
                key={0}
                className={styles.treeContainer}
                style={{
                  height: "100%",
                }}
              >
                <div
                  style={{ fontWeight: 600, padding: 5, textAlign: "center" }}
                >
                  文件目录
                </div>
                <Tree
                  style={{ borderTop: "1px solid #d9d9d9" }}
                  showLine
                  expandedKeys={expandedKeys}
                  selectedKeys={selectedKeys}
                  onSelect={(selectedKeys: React.Key[]) => {
                    onSelectTree({ path: selectedKeys[0], line: 0 });
                  }}
                  onExpand={(selectedKeys: any) => {
                    setExpandedKeys(selectedKeys);
                  }}
                  treeData={fileTree.current}
                />
              </div>,
              <CodeEditor
                key={1}
                infoCode={code}
                style={{
                  height: "100%",
                }}
              />,
            ]}
            width={["20%", "80%"]}
          />
        )}
      </div>
      <div
        className={styles.arrowColumnContainer}
        style={
          openEditor
            ? { transform: "translate(0, -50%)" }
            : { transform: "translate(100%, -50%)" }
        }
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <Button
          style={show ? { display: "block" } : { display: "none" }}
          className={
            openEditor
              ? `${styles.columnArrow} ${styles["column-arrow-open"]}`
              : `${styles.columnArrow} ${styles["column-arrow-close"]}`
          }
          onClick={() => {
            setOpenEditor(!openEditor);
            setShow(!show);
          }}
        >
          {openEditor ? <LeftOutlined /> : <RightOutlined />}
        </Button>
      </div>
    </div>
  );
};

const Editors = ({ type, uuid }: any) => {
  const [openEditor, setOpenEditor] = useState(true);
  const [show, setShow] = useState(false);

  return (
    <div
      className={
        show
          ? `${styles.container} ${styles.arrowOuterContainer} ${styles.selectContainer}`
          : `${styles.container} ${styles.arrowOuterContainer}`
      }
      style={
        openEditor
          ? { height: "calc(80% - 37px - 2.5px)", flex: "1 1 80%" }
          : { height: "0" }
      }
    >
      <div
        className={styles.innerContainer}
        style={
          openEditor
            ? {
                height: "100%",
                flex: "1 1 0",
                opacity: 1,
              }
            : { height: "0", opacity: 0 }
        }
      >
        <div className={styles.editorContainer}>
          <UploadDiagram type={type} />
          <UploadDocument type={type} />
          <UploadCode uuid={uuid} />
        </div>
      </div>
      <div
        className={styles.arrowRowContainer}
        style={
          openEditor
            ? { transform: "translate(50%, 0)" }
            : { transform: "translate(50%, 100%)" }
        }
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <Button
          style={show ? { display: "block" } : { display: "none" }}
          className={
            openEditor
              ? `${styles.rowArrow} ${styles["row-arrow-open"]}`
              : `${styles.rowArrow} ${styles["row-arrow-close"]}`
          }
          onClick={() => {
            setOpenEditor(!openEditor);
            setShow(!show);
          }}
        >
          {openEditor ? <UpOutlined /> : <DownOutlined />}
        </Button>
      </div>
    </div>
  );
};

const Track = (prop: any) => {
  const { loading, result, type } = prop;
  const [clsNames, setClsNames] = useState<any>();
  const [openEditor, setOpenEditor] = useState(true);
  const [show, setShow] = useState(false);
  const [res, setRes] = useState([]);
  const { onSelectTree } = useStore();

  useEffect(() => {
    if (result) {
      const tmp = Array.from(Object.entries(result)).map(([name, paths]) => {
        return { key: name, label: name };
      });
      setClsNames(tmp);
      setRes(result[tmp[0].key]);
    }
  }, [result]);

  return (
    <div
      className={
        show
          ? `${styles.container} ${styles.arrowOuterContainer} ${styles.selectContainer}`
          : `${styles.container} ${styles.arrowOuterContainer}`
      }
      style={
        openEditor
          ? { height: "calc(20% - 2.5px)", flex: "1 1 20%" }
          : { height: "0" }
      }
    >
      {loading === "init" && (
        <div
          style={{
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            rowGap: 5,
            padding: 5,
          }}
        >
          <ExclamationCircleOutlined
            style={{ fontSize: 20, color: "#2e75d3" }}
          />
          <p style={{ margin: 4 }}>点击按钮，获得追踪结果</p>
        </div>
      )}
      <div
        style={{
          height: "100%",
          display: loading === "loading" ? "block" : "none",
          overflow: "hidden",
        }}
      >
        <MySpin />
      </div>
      {loading === "finish" && (
        <div
          className={styles.resContainer}
          style={
            openEditor
              ? {
                  height: "100%",
                }
              : { height: "0", overflow: "hidden" }
          }
        >
          <Draggable
            children={[
              <div key={0} className={styles.list}>
                {clsNames && (
                  <Menu
                    style={{ width: "100%", minHeight: "100%" }}
                    defaultSelectedKeys={[clsNames[0].key]}
                    items={clsNames}
                    onClick={({ key }) => {
                      setRes(result[key]);
                    }}
                  />
                )}
              </div>,
              <div key={1} className={styles.output}>
                {res.map((item: { line: number; path: string }) => (
                  <p style={{ margin: 4 }}>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectTree(item);
                      }}
                    >
                      {type === "class"
                        ? item.path
                        : `${item.path}: ${item.line}`}
                    </a>
                  </p>
                ))}
              </div>,
            ]}
            width={["20%", "80%"]}
          />
        </div>
      )}
      <div
        className={styles.arrowRowContainer}
        style={
          openEditor
            ? { transform: "translate(50%, 0)" }
            : { transform: "translate(50%, 100%)" }
        }
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <Button
          style={show ? { display: "block" } : { display: "none" }}
          className={
            openEditor
              ? `${styles.rowArrow} ${styles["row-arrow-open"]}`
              : `${styles.rowArrow} ${styles["row-arrow-close"]}`
          }
          onClick={() => {
            setOpenEditor(!openEditor);
            setShow(!show);
          }}
        >
          {openEditor ? <UpOutlined /> : <DownOutlined />}
        </Button>
      </div>
    </div>
  );
};

const UploadFiles = ({ type }: { type: string }) => {
  const [loading, setLoading] = useState<"init" | "loading" | "finish">("init");
  const [result, setResult] = useState();
  const { curDiagFile, diagData, docsData, codesData, saveSVG } = useStore();

  const handleFetch = () => {
    const fileList: File[] = [];
    const diagFile = new File([new Blob([diagData])], curDiagFile);
    fileList.push(diagFile);

    // const formData = new FormData();
    // const diagFile = new File([new Blob([diagData])], curDiagFile);
    // formData.append("diagFile", diagFile);
    Array.from(docsData.entries()).map(([fileName, fileContent]) => {
      const blob = new Blob([fileContent]);
      const file = new File([blob], fileName);
      fileList.push(file);
      // formData.append("docFiles", file);
    });
    Array.from(codesData.entries()).map(([fileName, fileContent]) => {
      const blob = new Blob([fileContent]);
      const file = new File([blob], fileName);
      fileList.push(file);
      // formData.append("codeFiles", file);
    });

    const batchSize = 500;
    const totalBatches = Math.ceil(fileList.length / batchSize);
    let batchNumber = 0;
    let batchIndex = 0;

    let start: Date, end: Date;
    // for (let [key, value] of formData.entries()) {
    //   console.log(key);
    //   console.dir(value);
    // }
    if (fileList.length) {
      setLoading("loading");
      start = new Date();
      fetch("http://localhost:8888/generate-upload-id", {
        method: "GET",
        mode: "cors",
      })
        .then((res) => res.json())
        .then((data) => {
          fetchData(data.uploadId);
        })
        .catch((error) => {
          setLoading("init");
          window.alert("服务器出错！");
        });
    }
    function fetchData(uploadId: any) {
      batchNumber++;
      if (batchNumber <= totalBatches) {
        const formData = new FormData();
        formData.append("uploadId", uploadId + "");
        formData.append("batchNumber", batchNumber + "");
        formData.append("totalBatches", totalBatches + "");

        for (
          let i = 0;
          i < batchSize && batchIndex < fileList.length;
          i++, batchIndex++
        ) {
          const file = fileList[batchIndex];
          if (file.name.endsWith(".java")) {
            formData.append("codeFiles", file);
          } else if (file.name.endsWith(".svg")) {
            formData.append("diagFile", file);
          } else {
            formData.append("docFiles", file);
          }
        }

        const fetchUrl =
          type === "class"
            ? "http://localhost:8888/trace/class-diagram"
            : "http://localhost:8888/trace/sequence-diagram";
        fetch(fetchUrl, {
          method: "POST",
          mode: "cors",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.totalBatches) {
              fetchData(uploadId);
            } else {
              setLoading("finish");
              setResult(data);
              end = new Date();
              const time = Math.ceil((end.getTime() - start.getTime()) / 1000);
              console.log("类图代码追踪共花费了" + time.toString() + "秒");
            }
          })
          .catch((error) => {
            setLoading("init");
            window.alert("文件不符合要求，解析失败！");
          });
      }
    }
  };

  const handleSave = () => {
    const blob = new Blob([JSON.stringify(result)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      type === "class" ? "classTraceResult.json" : "sequenceTraceResult.json";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const saveDocument = () => {
    const zip = new JSZip();

    // 将选中的文件添加到 zip 中
    Array.from(docsData.entries()).map(([fileName, fileContent]) => {
      const blob = new Blob([fileContent]);
      const file = new File([blob], fileName);
      zip.file(file.name, file);
    });

    // 生成 ZIP 文件并触发下载
    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  };
  const saveCode = () => {
    const zip = new JSZip();

    Array.from(codesData.entries()).map(([fileName, fileContent]) => {
      const blob = new Blob([fileContent]);
      const file = new File([blob], fileName);
      zip.file(file.name, file);
    });

    // 生成 ZIP 文件并触发下载
    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "code.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        rowGap: 5,
      }}
    >
      <Editors {...{ type, uuid: uuidv4() }} />
      <Track {...{ loading, result, type }} />
      <div style={{ position: "relative" }}>
        <Flex
          justify="start"
          align="center"
          gap={5}
          style={{ position: "absolute", left: 5 }}
        >
          <Button onClick={saveSVG}>保存图片</Button>
          <Button onClick={saveDocument}>保存文档</Button>
          <Button onClick={saveCode}>保存代码</Button>
        </Flex>
        <Flex justify="center" align="center" gap={5}>
          <Button onClick={handleFetch}>获取追踪结果</Button>
          <Button
            style={
              loading === "finish" ? { display: "block" } : { display: "none" }
            }
            onClick={handleSave}
          >
            保存追踪结果
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export default UploadFiles;
