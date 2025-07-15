"use client"

import { useState } from 'react'
import { ResizableContainer } from './resizable-container'
import { Clock } from './clock'

export function ResizableContainerDemo() {
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 })

  const handleResize = (width: number, height: number) => {
    setDimensions({ width, height })
    console.log(`容器大小已调整为: ${width} x ${height}`)
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">可调整大小的容器演示</h1>
      
      <div className="space-y-8">
        {/* 基础可调整容器 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">基础可调整容器</h2>
          <ResizableContainer
            background="primary"
            shadow="soft"
            padding="comfortable"
            onResize={handleResize}
          >
            <div className="h-full w-full flex flex-col">
              <h3 className="text-lg font-medium mb-2">动态容器</h3>
              <p className="text-gray-600 text-sm mb-4">
                拖拽边缘或角落来调整大小
              </p>
              <div className="text-xs text-gray-500">
                当前尺寸: {dimensions.width} x {dimensions.height}
              </div>
            </div>
          </ResizableContainer>
        </div>

        {/* 包含时钟组件的容器 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">包含组件的可调整容器</h2>
          <ResizableContainer
            background="glass"
            shadow="medium"
            padding="cozy"
            initialWidth={200}
            initialHeight={150}
            minWidth={150}
            minHeight={120}
          >
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">
                  {new Date().toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-500">
                  动态时钟
                </div>
              </div>
            </div>
          </ResizableContainer>
        </div>

        {/* 不同样式的容器 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">不同样式的容器</h2>
          <div className="flex gap-6 flex-wrap">
            {/* 毛玻璃效果 */}
            <ResizableContainer
              background="glass"
              border="glass"
              shadow="floating"
              padding="spacious"
              initialWidth={180}
              initialHeight={120}
            >
              <div className="text-center">
                <div className="text-sm font-medium">毛玻璃效果</div>
                <div className="text-xs text-gray-500 mt-1">Glass Style</div>
              </div>
            </ResizableContainer>

            {/* 渐变背景 */}
            <ResizableContainer
              background="tinted"
              border="accent"
              shadow="elevated"
              padding="comfortable"
              initialWidth={180}
              initialHeight={120}
            >
              <div className="text-center">
                <div className="text-sm font-medium">渐变背景</div>
                <div className="text-xs text-gray-500 mt-1">Tinted Style</div>
              </div>
            </ResizableContainer>

            {/* 暗色主题 */}
            <ResizableContainer
              background="darkGlass"
              border="glass"
              shadow="soft"
              padding="comfortable"
              initialWidth={180}
              initialHeight={120}
            >
              <div className="text-center text-white">
                <div className="text-sm font-medium">暗色主题</div>
                <div className="text-xs text-gray-300 mt-1">Dark Style</div>
              </div>
            </ResizableContainer>
          </div>
        </div>

        {/* 有限制的容器 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">有尺寸限制的容器</h2>
          <ResizableContainer
            background="accent"
            shadow="medium"
            padding="comfortable"
            initialWidth={250}
            initialHeight={150}
            minWidth={200}
            minHeight={100}
            maxWidth={400}
            maxHeight={300}
          >
            <div className="h-full w-full flex flex-col justify-center items-center">
              <div className="text-sm font-medium mb-2">尺寸限制</div>
              <div className="text-xs text-gray-600 text-center">
                最小: 200 x 100<br />
                最大: 400 x 300
              </div>
            </div>
          </ResizableContainer>
        </div>

        {/* 禁用调整大小的容器 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">固定大小容器（不可调整）</h2>
          <ResizableContainer
            background="secondary"
            shadow="subtle"
            padding="comfortable"
            initialWidth={200}
            initialHeight={100}
            resizable={false}
          >
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-sm font-medium text-gray-600">
                固定大小，不可调整
              </div>
            </div>
          </ResizableContainer>
        </div>
      </div>
    </div>
  )
}
