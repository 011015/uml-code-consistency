import React from "react";

import dynamic from "next/dynamic";

const Flex = dynamic(() => import("antd").then((mod) => mod.Flex));
const Spin = dynamic(() => import("antd").then((mod) => mod.Spin));

const MySpin = ({ style }: { style?: any }) => (
  <Flex
    style={{ width: "100%", height: "100%", ...style }}
    justify="center"
    align="center"
    gap="middle"
  >
    <Spin />
  </Flex>
);

export default MySpin;
