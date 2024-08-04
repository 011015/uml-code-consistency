import React, { useEffect, useState, useRef } from "react";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import useStore from "@/store";

let timer: any;
const CodeEditor = ({
  infoCode = { code: "", line: 0 },
  style,
}: {
  infoCode: { code: string; line: number };
  style?: any;
}) => {
  const { curCodeFile, setCodesData } = useStore();
  const [code, setCode] = useState(infoCode);

  const editorRef = useRef(null);

  const selectLine = (lineNumber: number) => {
    const editor = editorRef.current.editor;

    const session = editor.getSession();
    // 清除之前的选择
    session.getSelection().clearSelection();
    // 移动光标到指定行，行号从0开始，所以需要减1
    editor.gotoLine(lineNumber, 0, true);
    // 选择整行
    session.getSelection().selectLine();
  };

  const handleChange = (value: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setCodesData(curCodeFile, value);
    }, 200);
    setCode({ ...code, code: value });
  };

  useEffect(() => {
    setCode(infoCode);
    selectLine(infoCode.line);
  }, [infoCode]);

  return (
    <AceEditor
      ref={editorRef}
      placeholder="Coding..."
      mode="java"
      theme="monokai"
      readOnly={!curCodeFile.endsWith(".java")}
      value={code.code}
      onChange={handleChange}
      style={style}
    />
  );
};

export default CodeEditor;
