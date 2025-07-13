"use client"

import { Container } from './container'
import { List } from './list'
import { Clock } from './clock'
import type { ListItem } from "@/lib/widget-data-service"

// 示例数据
const sampleItems: ListItem[] = [
  { id: '1', title: '任务一', content: '完成项目设计', status: '进行中' },
  { id: '2', title: '任务二', content: '代码审查', status: '待处理' },
  { id: '3', title: '任务三', content: '测试部署', status: '已完成' },
]

// 演示组件1：iOS 风格基础容器样式
function ContainerBasicDemo() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">iOS 风格基础样式</h3>
      <div className="grid grid-cols-2 gap-4">
        <Container background="primary" border="light" shadow="soft">
          <h4 className="font-medium mb-2">主要容器</h4>
          <p className="text-sm text-gray-600">iOS 主要卡片样式</p>
        </Container>
        
        <Container background="secondary" border="separator" shadow="medium">
          <h4 className="font-medium mb-2">次要容器</h4>
          <p className="text-sm text-gray-600">iOS 次要卡片样式</p>
        </Container>
        
        <Container background="glass" border="glass" shadow="elevated">
          <h4 className="font-medium mb-2">毛玻璃效果</h4>
          <p className="text-sm text-gray-600">iOS 毛玻璃卡片</p>
        </Container>
        
        <Container background="tinted" border="accent" shadow="floating">
          <h4 className="font-medium mb-2">渐变容器</h4>
          <p className="text-sm text-gray-600">iOS 渐变背景卡片</p>
        </Container>
      </div>
    </div>
  )
}

// 演示组件2：iOS 风格布局方向
function ContainerLayoutDemo() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">iOS 风格布局</h3>
      
      {/* 行布局 */}
      <Container direction="row" gap="comfortable" background="primary" padding="comfortable">
        <div className="bg-blue-100/80 p-3 rounded-lg">Widget 1</div>
        <div className="bg-green-100/80 p-3 rounded-lg">Widget 2</div>
        <div className="bg-yellow-100/80 p-3 rounded-lg">Widget 3</div>
      </Container>
      
      {/* 列布局 */}
      <Container direction="col" gap="cozy" background="secondary" padding="spacious">
        <div className="bg-red-100/80 p-3 rounded-lg">Widget A</div>
        <div className="bg-purple-100/80 p-3 rounded-lg">Widget B</div>
        <div className="bg-pink-100/80 p-3 rounded-lg">Widget C</div>
      </Container>
      
      {/* 网格布局 */}
      <Container direction="grid" gap="comfortable" background="tinted" padding="spacious" className="grid-cols-3">
        <div className="bg-white/90 p-4 rounded-xl shadow-sm">Grid 1</div>
        <div className="bg-white/90 p-4 rounded-xl shadow-sm">Grid 2</div>
        <div className="bg-white/90 p-4 rounded-xl shadow-sm">Grid 3</div>
        <div className="bg-white/90 p-4 rounded-xl shadow-sm">Grid 4</div>
        <div className="bg-white/90 p-4 rounded-xl shadow-sm">Grid 5</div>
        <div className="bg-white/90 p-4 rounded-xl shadow-sm">Grid 6</div>
      </Container>
    </div>
  )
}

// 演示组件3：iOS 风格容器尺寸
function ContainerSizeDemo() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">iOS 风格尺寸</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <Container 
          width={200} 
          height={100} 
          background="primary" 
          border="light" 
          align="center"
          shadow="soft"
        >
          <div className="text-center">
            <div className="font-medium">紧凑尺寸</div>
            <div className="text-sm text-gray-600">200×100px</div>
          </div>
        </Container>
        
        <Container 
          width={300} 
          height={150} 
          background="glass" 
          border="glass" 
          align="center"
          shadow="elevated"
        >
          <div className="text-center">
            <div className="font-medium">标准尺寸</div>
            <div className="text-sm text-gray-600">300×150px</div>
          </div>
        </Container>
        
        <Container 
          height={120} 
          background="accent" 
          border="accent" 
          align="center"
          shadow="medium"
        >
          <div className="text-center">
            <div className="font-medium">固定高度</div>
            <div className="text-sm text-gray-600">自适应宽×120px</div>
          </div>
        </Container>
        
        <Container 
          width={250} 
          background="tinted" 
          border="accent" 
          align="center"
          padding="spacious"
          shadow="floating"
        >
          <div className="text-center">
            <div className="font-medium">固定宽度</div>
            <div className="text-sm text-gray-600">250px×自适应高</div>
          </div>
        </Container>
      </div>
    </div>
  )
}
function ContainerAlignDemo() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">对齐方式</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <Container 
          direction="row" 
          align="center" 
          background="primary" 
          padding="spacious"
          shadow="soft"
          className="h-32"
        >
          <div className="bg-blue-500 text-white p-2 rounded">居中对齐</div>
        </Container>
        
        <Container 
          direction="row" 
          align="between" 
          background="glass" 
          border="glass"
          padding="spacious"
          shadow="elevated"
          className="h-32"
        >
          <div className="bg-green-500/90 text-white p-3 rounded-lg font-medium">左侧</div>
          <div className="bg-red-500/90 text-white p-3 rounded-lg font-medium">右侧</div>
        </Container>
        
        <Container 
          direction="col" 
          align="end" 
          background="tinted" 
          padding="spacious"
          shadow="medium"
          className="h-32"
        >
          <div className="bg-purple-500/90 text-white p-3 rounded-lg font-medium">底部对齐</div>
        </Container>
        
        <Container 
          direction="row" 
          align="around" 
          background="accent" 
          padding="spacious"
          shadow="floating"
          className="h-32"
        >
          <div className="bg-yellow-600/90 text-white p-2 rounded-lg font-medium">A</div>
          <div className="bg-pink-600/90 text-white p-2 rounded-lg font-medium">B</div>
          <div className="bg-indigo-600/90 text-white p-2 rounded-lg font-medium">C</div>
        </Container>
      </div>
    </div>
  )
}

// 演示组件4：实际 Widget 组合
function ContainerWidgetDemo() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">iOS 风格 Widget 组合</h3>
      
      {/* iOS 仪表板布局 */}
      <Container 
        direction="grid" 
        gap="spacious" 
        background="secondary" 
        padding="spacious"
        shadow="elevated"
        className="grid-cols-3"
      >
        {/* 时钟 Widget */}
        <Container background="primary" shadow="soft" padding="comfortable">
          <Clock 
            width={200} 
            height={150} 
            title="当前时间" 
            dataSource={{
              type: 'custom',
              url: '/api/time',
              refreshInterval: 1
            }} 
          />
        </Container>
        
        {/* 任务列表 Widget */}
        <Container background="primary" shadow="medium" padding="comfortable" className="col-span-2">
          <List title="今日任务" items={sampleItems} listType="decimal" />
        </Container>
        
        {/* 统计卡片 */}
        <Container background="tinted" shadow="medium" padding="comfortable" align="center">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">24</div>
            <div className="text-sm text-gray-600">活跃用户</div>
          </div>
        </Container>
        
        <Container background="primary" shadow="medium" padding="comfortable" align="center">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">85%</div>
            <div className="text-sm text-gray-600">完成率</div>
          </div>
        </Container>
        
        <Container background="glass" shadow="elevated" padding="comfortable" align="center">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">12</div>
            <div className="text-sm text-gray-600">新消息</div>
          </div>
        </Container>
      </Container>
      
      {/* iOS 侧边栏布局 */}
      <Container direction="row" gap="spacious" background="primary" border="light" padding="spacious">
        {/* 侧边栏 */}
        <Container 
          direction="col" 
          gap="cozy" 
          background="secondary" 
          padding="comfortable" 
          className="w-64"
        >
          <h4 className="font-semibold">导航菜单</h4>
          <div className="space-y-2">
            <div className="p-3 bg-blue-100/80 rounded-xl cursor-pointer font-medium">首页</div>
            <div className="p-3 bg-gray-100/80 rounded-xl cursor-pointer">设置</div>
            <div className="p-3 bg-gray-100/80 rounded-xl cursor-pointer">帮助</div>
          </div>
        </Container>
        
        {/* 主内容区 */}
        <Container 
          direction="col" 
          gap="comfortable" 
          background="tinted" 
          padding="spacious" 
          className="flex-1"
        >
          <h4 className="font-semibold">主内容区域</h4>
          <Container background="primary" padding="comfortable" shadow="soft">
            <List title="最新文章" items={sampleItems.slice(0, 2)} listType="disc" />
          </Container>
        </Container>
      </Container>
    </div>
  )
}

// 主演示组件
export function ContainerDemo() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Container Widget - iOS 设计风格</h2>
        <p className="text-gray-600">专门用于存放其他 widget 的布局容器，采用 iOS 设计语言</p>
      </div>
      
      <ContainerBasicDemo />
      <ContainerLayoutDemo />
      <ContainerSizeDemo />
      <ContainerAlignDemo />
      <ContainerWidgetDemo />
    </div>
  )
}

export default ContainerDemo
