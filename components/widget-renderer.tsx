import React from "react";
import { Clock } from "@/components/widget/clock";
import { UniversalWidget } from "@/components/widget/universal";
import { Container } from "@/components/widget/container";
import { ResizableContainer } from "@/components/widget/resizable-container";
import { Link } from "@/components/widget/link";
import { Rss } from "@/components/widget/rss";
import { Tabs } from "@/components/widget/tabs";
import { WaterCounter } from "@/components/widget/water-counter";
import { List } from "@/components/widget/list";
import type { GridStyle } from "@/lib/grid-layout-utils";

// 简化的 Widget 配置类型
interface WidgetConfig {
  type:
    | "clock"
    | "universal"
    | "container"
    | "resizable-container"
    | "link"
    | "rss"
    | "tabs"
    | "water-counter"
    | "list";
  props: any;
}

interface WidgetProps {
  config: WidgetConfig;
  style: GridStyle;
}

export function Widget({ config, style }: WidgetProps) {
  const baseStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    position: "absolute" as const,
    willChange: "transform" as const,
    width: style.width,
    height: style.height,
    transform: `translate(${style.transformX}px, ${style.transformY}px)`,
  };

  // 组件映射表
  const componentMap = {
    clock: Clock,
    universal: UniversalWidget,
    container: Container,
    "resizable-container": ResizableContainer,
    link: Link,
    rss: Rss,
    tabs: Tabs,
    "water-counter": WaterCounter,
    list: List,
  } as const;

  const WidgetComponent = componentMap[config.type];

  const renderWidget = WidgetComponent ? (
    <WidgetComponent {...config.props} />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
      <span className="text-gray-500 text-sm">
        Unknown widget type: {config.type}
      </span>
    </div>
  );

  return <div style={baseStyle}>{renderWidget}</div>;
}
