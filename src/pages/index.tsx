"use client";
import React from "react";
import dynamic from "next/dynamic";

import MyTabs from "@/components/Tabs";

const Layout = dynamic(() => import("antd").then((mod) => mod.Layout));
const Content = dynamic(() => import("antd").then((mod) => mod.Layout.Content));
const Footer = dynamic(() => import("antd").then((mod) => mod.Layout.Footer));

export default function Page() {
  return (
    <Layout style={{ width: "100vw", height: "100vh", display: "flex" }}>
      <Content style={{ flex: "1" }}>
        <MyTabs />
      </Content>
      <Footer
        style={{
          flex: "0",
          alignItems: "center",
          justifyContent: "center",
          columnGap: 5,
          display: "flex",
        }}
      >
        <img src="/logo.png" style={{ height: 15, width: 15 }} />
        <span>Created by lhq</span>
      </Footer>
    </Layout>
  );
}
