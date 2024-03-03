"use client";
import React from "react";
import dynamic from "next/dynamic";

import MyTabs from "@/components/Tabs";
import MyMenu from "@/components/Menu";
import ClassDiagram from "@/components/ClassDiagram";

const Layout = dynamic(() => import("antd").then((mod) => mod.Layout));
const Sider = dynamic(() => import("antd").then((mod) => mod.Layout.Sider));
const Header = dynamic(() => import("antd").then((mod) => mod.Layout.Header));
const Content = dynamic(() => import("antd").then((mod) => mod.Layout.Content));
const Footer = dynamic(() => import("antd").then((mod) => mod.Layout.Footer));

const initialItems = [
  { label: "Tab 1", children: <ClassDiagram />, key: "1" },
  { label: "Tab 2", children: <ClassDiagram />, key: "2" },
  {
    label: "Tab 3",
    children: <ClassDiagram />,
    key: "3",
  },
];

export default function Page() {
  return (
    <Layout style={{ width: "100vw", height: "100vh" }}>
      <Header />
      <Layout>
        <Sider theme="light" style={{ overflowY: "auto" }}>
          <MyMenu />
        </Sider>
        <Layout>
          <Content>
            <MyTabs
              initActiveKey={initialItems[0].key}
              initItems={initialItems}
            />
          </Content>
          <Footer style={{ textAlign: "center" }}>Created by lhq</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}
