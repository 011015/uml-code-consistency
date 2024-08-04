import { create } from "zustand";

const useStore = create((set) => ({
  diagData: "",
  // <文档路径名, 文档文本>
  docsData: new Map(),
  // <代码路径名, 代码文本>
  codesData: new Map(),
  curDiagFile: "",
  curDocFile: "",
  curCodeFile: "",
  onSelectTree: new Function(),
  saveSVG: new Function(),
  activeKey: "",
  activeData: new Map(),
  resetDiagData: (data) => set(() => ({ diagData: data })),
  setDocsData: (fileName, data) =>
    set((state) => ({ docsData: state.docsData.set(fileName, data) })),
  resetDocsData: (data) => set(() => ({ docsData: data })),
  setCodesData: (fileName, data) =>
    set((state) => ({ codesData: state.codesData.set(fileName, data) })),
  resetCodesData: (data) => set(() => ({ codesData: data })),
  setCurDiagFile: (fileName) => set(() => ({ curDiagFile: fileName })),
  setCurDocFile: (fileName) => set(() => ({ curDocFile: fileName })),
  setCurCodeFile: (fileName) =>
    set(() => ({
      curCodeFile: fileName,
    })),
  setOnSelectTree: (func) => set(() => ({ onSelectTree: func })),
  setSaveSVG: (func) => set(() => ({ saveSVG: func })),
  setActiveKey: (data) => set(() => ({ activeKey: data })),
  setActiveData: (key, data) =>
    set((state) => ({ activeData: state.activeData.set(key, data) })),
  removeActiveData: (key) =>
    set((state) => {
      state.activeData.delete(key);
      return state.activeData;
    }),
}));

export default useStore;
