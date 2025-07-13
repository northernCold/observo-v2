"use client";

import { Scroll } from "./scroll";
import { List } from "./list";
import type { ListItem } from "@/lib/widget-data-service";

// 示例数据
const newsItems: ListItem[] = [
  {
    id: "1",
    title: "全球气候峰会达成重要协议",
    content: "各国承诺减排目标",
    link: "#",
    date: "2025-07-11",
  },
  {
    id: "2",
    title: "科技巨头发布季度财报",
    content: "营收超预期增长",
    link: "#",
    date: "2025-07-11",
  },
  {
    id: "3",
    title: "太空探索取得新突破",
    content: "火星任务进展顺利",
    link: "#",
    date: "2025-07-10",
  },
  {
    id: "4",
    title: "新冠疫苗接种进展",
    content: "全球接种率持续提升",
    link: "#",
    date: "2025-07-10",
  },
];

const taskItems: ListItem[] = [
  {
    id: "1",
    title: "完成项目文档",
    content: "截止日期：今天",
    status: "进行中",
  },
  { id: "2", title: "代码审查", content: "需要团队协作", status: "待处理" },
  { id: "3", title: "部署测试环境", content: "环境配置完成", status: "已完成" },
  { id: "4", title: "用户反馈整理", content: "收集用户意见", status: "进行中" },
];

// 演示组件1：水平滚动的列表卡片
function ScrollHorizontalListDemo() {
  return (
    <div className="h-48 border rounded-lg p-4">
      <h3 className="text-sm font-medium mb-2">新闻列表 - 水平滚动</h3>
      <div className="h-36">
        <Scroll direction="horizontal" showScrollbar={true}>
          <div className="min-w-[200px] h-32 mr-4">
            <List
              title="今日要闻"
              items={newsItems.slice(0, 2)}
              listType="none"
            />
          </div>
          <div className="min-w-[200px] h-32 mr-4">
            <List
              title="科技新闻"
              items={newsItems.slice(2, 4)}
              listType="none"
            />
          </div>
          <div className="min-w-[200px] h-32 mr-4">
            <List title="更多新闻" items={newsItems} listType="disc" />
          </div>
        </Scroll>
      </div>
    </div>
  );
}

// 演示组件2：垂直滚动的任务列表
function ScrollVerticalListDemo() {
  return (
    <div className="h-48 border rounded-lg p-4">
      <h3 className="text-sm font-medium mb-2">任务列表 - 垂直滚动</h3>
      <div className="h-36">
        <Scroll direction="vertical" showScrollbar={true}>
          <div className="mb-4">
            <List
              title="今日任务"
              items={taskItems.slice(0, 2)}
              listType="decimal"
            />
          </div>
          <div className="mb-4">
            <List
              title="本周任务"
              items={taskItems.slice(2, 4)}
              listType="square"
            />
          </div>
          <div className="mb-4">
            <List title="所有任务" items={taskItems} listType="disc" />
          </div>
        </Scroll>
      </div>
    </div>
  );
}

// 演示组件3：简单文本滚动
function ScrollTextDemo() {
  return (
    <div className="h-32 border rounded-lg p-4">
      <h3 className="text-sm font-medium mb-2">快讯滚动</h3>
      <div className="h-20">
        <Scroll direction="horizontal" showScrollbar={false}>
          <span className="text-green-600">📈 股票上涨 5%</span>
          <span className="text-blue-600">🎯 项目进度 80%</span>
          <span className="text-red-600">🔥 热门新闻：科技股大涨</span>
          <span className="text-purple-600">⚡ 系统性能优化完成</span>
          <span className="text-yellow-600">🎉 用户突破 1000 万</span>
        </Scroll>
      </div>
    </div>
  );
}

// 演示组件4：不同列表类型对比
function ScrollListTypesDemo() {
  return (
    <div className="h-48 border rounded-lg p-4">
      <h3 className="text-sm font-medium mb-2">列表类型对比 - 水平滚动</h3>
      <div className="h-36">
        <Scroll direction="horizontal" showScrollbar={true}>
          <div className="min-w-[180px] h-32 mr-4 border rounded p-2">
            <List
              title="圆点列表"
              items={newsItems.slice(0, 3)}
              listType="disc"
            />
          </div>
          <div className="min-w-[180px] h-32 mr-4 border rounded p-2">
            <List
              title="数字列表"
              items={taskItems.slice(0, 3)}
              listType="decimal"
            />
          </div>
          <div className="min-w-[180px] h-32 mr-4 border rounded p-2">
            <List
              title="方块列表"
              items={newsItems.slice(1, 4)}
              listType="square"
            />
          </div>
          <div className="min-w-[180px] h-32 mr-4 border rounded p-2">
            <List
              title="字母列表"
              items={taskItems.slice(1, 4)}
              listType="lower-alpha"
            />
          </div>
          <div className="min-w-[180px] h-32 mr-4 border rounded p-2">
            <List
              title="无样式列表"
              items={newsItems.slice(0, 3)}
              listType="none"
            />
          </div>
        </Scroll>
      </div>
    </div>
  );
}

// 演示组件5：混合内容滚动
function ScrollMixedContentDemo() {
  return (
    <div className="h-48 border rounded-lg p-4 bg-gray-50">
      <h3 className="text-sm font-medium mb-2">混合内容滚动</h3>
      <div className="h-36">
        <Scroll
          direction="horizontal"
          showScrollbar={true}
          className="bg-white rounded p-2"
        >
          <div className="min-w-[220px] p-3 border rounded mr-3">
            <List
              title="📰 新闻"
              items={newsItems.slice(0, 2)}
              listType="none"
            />
          </div>
          <div className="min-w-[100px] p-3 border rounded mr-3 flex flex-col justify-center items-center bg-blue-50">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-xs text-gray-500">今日任务</div>
          </div>
          <div className="min-w-[220px] p-3 border rounded mr-3">
            <List
              title="✅ 任务"
              items={taskItems.slice(0, 2)}
              listType="none"
            />
          </div>
          <div className="min-w-[100px] p-3 border rounded mr-3 flex flex-col justify-center items-center bg-green-50">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-xs text-gray-500">完成度</div>
          </div>
        </Scroll>
      </div>
    </div>
  );
}

// 演示组件6：仪表板样式的垂直滚动
function ScrollDashboardDemo() {
  return (
    <div className="h-48 border rounded-lg p-4">
      <h3 className="text-sm font-medium mb-2">仪表板 - 垂直滚动</h3>
      <div className="h-36">
        <Scroll direction="vertical" showScrollbar={true}>
          <div className="mb-4 p-2 bg-blue-50 rounded">
            <div className="text-center text-blue-600 font-bold mb-2">
              📊 数据统计
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>用户数: 1,234</div>
              <div>订单数: 567</div>
            </div>
          </div>
          <div className="mb-4">
            <List
              title="🔥 热门文章"
              items={newsItems.slice(0, 2)}
              listType="decimal"
            />
          </div>
          <div className="mb-4 p-2 bg-green-50 rounded">
            <div className="text-center text-green-600 font-bold mb-2">
              ✅ 今日完成
            </div>
            <div className="text-xs">8 个任务已完成</div>
          </div>
          <div className="mb-4">
            <List
              title="📋 待办事项"
              items={taskItems.slice(0, 3)}
              listType="square"
            />
          </div>
        </Scroll>
      </div>
    </div>
  );
}

// 主演示组件
export function ScrollDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <ScrollHorizontalListDemo />
      <ScrollVerticalListDemo />
      <ScrollTextDemo />
      <ScrollListTypesDemo />
      <ScrollMixedContentDemo />
      <ScrollDashboardDemo />
    </div>
  )
}

export {
  ScrollDashboardDemo,
  ScrollHorizontalListDemo,
  ScrollVerticalListDemo,
  ScrollTextDemo,
  ScrollListTypesDemo,
  ScrollMixedContentDemo,
}

export default ScrollDemo
