import React, { useState, useEffect } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import useStore from "@/store";

let timer: any;
function TextEditor({ initEditorState }: { initEditorState: EditorState }) {
  const [editorState, setEditorState] = useState(initEditorState);
  const { curDocFile, setDocsData } = useStore();

  const handleChange = (editorState: EditorState) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const contentState = editorState.getCurrentContent();
      const text = contentState.getPlainText();
      setDocsData(curDocFile, text);
    }, 200);
    setEditorState(editorState);
  };

  useEffect(() => {
    setEditorState(initEditorState);
  }, [initEditorState]);

  return (
    <div
      style={{
        backgroundColor: "white",
        overflow: "auto",
        width: "100%",
        height: "100%",
      }}
    >
      <Editor editorState={editorState} onChange={handleChange} />
    </div>
  );
}

export default TextEditor;
