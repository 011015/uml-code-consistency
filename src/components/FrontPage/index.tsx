import React, { useState } from "react";
import dynamic from "next/dynamic";
import MyMenu from "./Menu";
import styles from "./index.module.scss";
import { Flex } from "antd";

const Typography = dynamic(() => import("antd").then((mod) => mod.Typography));
const Paragraph = dynamic(() =>
  import("antd").then((mod) => mod.Typography.Paragraph)
);
const Title = dynamic(() => import("antd").then((mod) => mod.Typography.Title));
const Text = dynamic(() => import("antd").then((mod) => mod.Typography.Text));

function FrontIntro() {
  return (
    <Typography>
      <Title level={2}>介绍</Title>
      <blockquote>
        <Text strong>UML&Code Trace</Text>
        是一个<Text strong>软件架构设计图与代码追踪工具</Text>
        ——对架构设计图进行识别，并建立图与代码之间的追踪关系，让开发者快速了解项目的总体架构。
      </blockquote>
      <Paragraph>
        在GitHub、主流期刊等开源项目中，可以发现架构设计图多以位图形式存储且抽象层次较高，并不会与代码一一对应。这对于刚接触大项目的开发者来说，要在短时间内理解项目的总体架构是困难的，而且市场上没有工具可以帮助他们建立图与代码的追踪关系。因此开发此工具的目的是为了让开发者在接触一个新的大项目时，可以借助此工具快速获得图与代码之间的追踪关系，快速了解项目的总体架构，从而对项目进行迭代开发等工作。
      </Paragraph>
      <Paragraph>
        由于软件架构设计图与代码涉及范围较为广阔，所以为了缩小范围，专注于实现主要功能，本人调研了目前最常用的架构设计图和代码，踏上了开发此工具的路程。根据调研结果可知，目前最常用的架构设计图是类图和顺序图，最常用的编程语言是Java，主流建模工具为StarUML。因此此工具
        <Text strong>目前仅支持</Text>追踪
        <Text strong>StarUML建模工具</Text>
        绘制的<Text strong>类图和顺序图</Text>与<Text strong>Java编程语言</Text>
        之间的关系。
      </Paragraph>
      <Paragraph>
        在调研中还发现了不同的开发者使用了各种类型的建模工具，并按照自己对架构设计图的了解，绘制了各式各样的架构设计图，这些架构设计图大多不规范。不规范的设计图会加剧图识别的难度，因此为了让图识别算法更加精确，该工具要求用户上传
        <Text strong>符合UML图标准</Text>
        的设计图，下文会详细介绍符合标准的设计图必须遵守的规则。
      </Paragraph>
    </Typography>
  );
}

function FrontFunc() {
  return (
    <Typography>
      <Title level={2}>核心功能</Title>
      <Paragraph>
        本工具主要有两个核心功能：图识别功能和图代码追踪功能。<br></br>
        图识别功能可分为类图识别（CR）和顺序图识别（SR）。<br></br>
        图代码追踪功能可分为类图与Java代码间的追踪（CT）和顺序图与Java代码间的追踪（ST）。
        <br></br>
        下图展示了两个核心功能的流程图。图代码追踪功能建立在图识别功能的基础上。
      </Paragraph>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/images/flow-chart.png" style={{ width: 784, height: 682 }} />
      </div>
      <Title level={5}>
        简单了解了工具的功能后，下面我们开始创建新项目吧！
      </Title>
      <Paragraph>步骤一：点击“+”号，创建新项目。</Paragraph>
      <div>
        <img src="/images/step1.png" style={{ width: 409, height: 27 }} />
      </div>
      <Paragraph>
        步骤二：填写项目名称，选择需要执行的功能。点击确定后，创建项目成功。
      </Paragraph>
      <div>
        <img src="/images/step2.png" style={{ width: 323, height: 228.5 }} />
      </div>
    </Typography>
  );
}

function CRIntro() {
  return (
    <Typography>
      <Title level={2}>介绍</Title>
      <blockquote>
        <Text strong>CR</Text>是一个<Text strong>类图识别功能</Text>
        ——对符合标准的类图进行识别。
      </blockquote>
      <Title level={5}>标准</Title>
      <Paragraph>
        类关系分为以下四种类型：
        <br />
        聚合关系：方块+实线。 <br />
        继承关系：三角形+实线。 <br />
        实现关系：三角形+虚线。 <br />
        依赖关系：箭头+虚线。
      </Paragraph>
      <Paragraph>
        类矩形包含三个矩形：
        <br />
        第一个矩形：表示类名。[&lt;类名&gt;]
        <br />
        第二个矩形：表示类属性。[&lt;可见性&gt;&lt;属性名&gt;: &lt;属性类型&gt;]
        <br />
        第三个矩形：表示类方法。[&lt;可见性&gt;&lt;方法名&gt;(&lt;参数名称&gt;:&lt;参数类型&gt;[,
        &lt;参数名称&gt;:&lt;参数类型&gt;]): &lt;返回类型&gt;]
        <br />
        可见性可分为public(+), private(-), protected(#), package(~)。
      </Paragraph>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src="/images/class-standard.png"
          style={{ width: 496, height: 137 }}
        />
      </div>
      <Paragraph>为加深对功能的了解，下面展示了功能的流程图。</Paragraph>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src="/images/diagram-recog.png"
          style={{ width: 237, height: 316 }}
        />
      </div>
    </Typography>
  );
}

function CRGuide() {
  return (
    <Typography>
      <Title level={2}>操作指南</Title>
      <Paragraph>
        【Ctrl+Z】：撤销。 【Ctrl+Y】：恢复。 【Ctrl+滚轮】：缩放。
        【选中+Del】：删除。
        <br />
        可在指定区域右击添加或删除某个元素。 欢迎用户手动操作一遍探索各种功能。
      </Paragraph>
      <video controls style={{ width: "65%" }}>
        <source src="/videos/CR.mp4" type="video/mp4" />
      </video>
    </Typography>
  );
}

function CTIntro() {
  return (
    <Typography>
      <Title level={2}>介绍</Title>
      <blockquote>
        <Text strong>CT</Text>是一个<Text strong>类图代码追踪功能</Text>
        ——建立类图与Java代码之间的追踪关系。
      </blockquote>
      <Paragraph>
        用户需要上传CR所保存的SVG图片，设计文档及代码。设计文档是可选的，它通常记录了类信息，上传设计文档有助于建立更准确的追踪关系。
      </Paragraph>
      <Paragraph>为加深对功能的了解，下面展示了功能的流程图。</Paragraph>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src="/images/diagram-trace.png"
          style={{ width: 192, height: 315 }}
        />
      </div>
    </Typography>
  );
}

function CTGuide() {
  return (
    <Typography>
      <Title level={2}>操作指南</Title>
      <Paragraph>
        【Ctrl+Z】：撤销。 【Ctrl+Y】：恢复。 【Ctrl+滚轮】：缩放。
        【选中+Del】：删除。
        <br />
        可在指定区域右击添加或删除某个元素。 欢迎用户手动操作一遍探索各种功能。
      </Paragraph>
      <video controls style={{ width: "65%" }}>
        <source src="/videos/CT.mp4" type="video/mp4" />
      </video>
    </Typography>
  );
}

function SRIntro() {
  return (
    <Typography>
      <Title level={2}>介绍</Title>
      <blockquote>
        <Text strong>SR</Text>是一个<Text strong>顺序图识别功能</Text>
        ——对符合标准的顺序图进行识别。
      </blockquote>
      <Title level={5}>标准</Title>
      <Paragraph>
        对象：包含对象名称的矩形。
        <br />
        信息：SR只能根据方向识别正向或逆向信息。
      </Paragraph>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src="/images/sequence-standard.png"
          style={{ width: 429, height: 81 }}
        />
      </div>
      <Paragraph>为加深对功能的了解，下面展示了功能的流程图。</Paragraph>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src="/images/diagram-recog.png"
          style={{ width: 237, height: 316 }}
        />
      </div>
    </Typography>
  );
}

function SRGuide() {
  return (
    <Typography>
      <Title level={2}>操作指南</Title>
      <Paragraph>
        【Ctrl+Z】：撤销。 【Ctrl+Y】：恢复。 【Ctrl+滚轮】：缩放。
        【选中+Del】：删除。
        <br />
        可在指定区域右击添加或删除某个元素。 欢迎用户手动操作一遍探索各种功能。
      </Paragraph>
      <video controls style={{ width: "65%" }}>
        <source src="/videos/SR.mp4" type="video/mp4" />
      </video>
    </Typography>
  );
}

function STIntro() {
  return (
    <Typography>
      <Title level={2}>介绍</Title>
      <blockquote>
        <Text strong>ST</Text>是一个<Text strong>顺序图代码追踪功能</Text>
        ——建立顺序图与Java代码之间的追踪关系。
      </blockquote>
      <Paragraph>
        用户需要上传SR所保存的SVG图片，CT的追踪结果文档及代码。
      </Paragraph>
      <Paragraph>为加深对功能的了解，下面展示了功能的流程图。</Paragraph>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src="/images/diagram-trace.png"
          style={{ width: 192, height: 315 }}
        />
      </div>
    </Typography>
  );
}

function STGuide() {
  return (
    <Typography>
      <Title level={2}>操作指南</Title>
      <Paragraph>
        【Ctrl+Z】：撤销。 【Ctrl+Y】：恢复。 【Ctrl+滚轮】：缩放。
        【选中+Del】：删除。
        <br />
        可在指定区域右击添加或删除某个元素。 欢迎用户手动操作一遍探索各种功能。
      </Paragraph>
      <video controls style={{ width: "65%" }}>
        <source src="/videos/ST.mp4" type="video/mp4" />
      </video>
    </Typography>
  );
}

export default function FrontPage() {
  const [menu, setMenu] = useState("front-intro");

  return (
    <div className={styles.container}>
      <MyMenu className={styles.menu} setMenu={setMenu} />
      <div className={styles.content}>
        {menu === "front-intro" && <FrontIntro />}
        {menu === "front-func" && <FrontFunc />}
        {menu === "CR-intro" && <CRIntro />}
        {menu === "CR-guide" && <CRGuide />}
        {menu === "CT-intro" && <CTIntro />}
        {menu === "CT-guide" && <CTGuide />}
        {menu === "SR-intro" && <SRIntro />}
        {menu === "SR-guide" && <SRGuide />}
        {menu === "ST-intro" && <STIntro />}
        {menu === "ST-guide" && <STGuide />}
      </div>
    </div>
  );
}
