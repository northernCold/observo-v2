"use client"

import type { WidgetLayout } from '@/types/widget'
import { useEffect, useState } from 'react'

interface WaterCounterProps extends WidgetLayout {
  dailyGoal?: number // 每日目标毫升数
  cupSize?: number   // 单次饮水量(毫升)
}

interface WaterData {
  date: string
  amount: number // 当日已喝水量(毫升)
  records: { time: string; amount: number }[] // 饮水记录
}

const STORAGE_KEY = 'water-counter-data'

function WaterCounter(props: WaterCounterProps) {
  const { 
    title = '每日饮水', 
    dailyGoal = 2000, // 默认2000ml
    cupSize = 200      // 默认200ml一杯
  } = props

  const [waterData, setWaterData] = useState<WaterData>({
    date: new Date().toDateString(),
    amount: 0,
    records: []
  })

  const today = new Date().toDateString()

  // 从localStorage加载数据
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        // 如果是新的一天，重置数据
        if (data.date !== today) {
          const newData = {
            date: today,
            amount: 0,
            records: []
          }
          setWaterData(newData)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
        } else {
          setWaterData(data)
        }
      } catch (error) {
        console.error('Failed to load water data:', error)
      }
    }
  }, [today])

  // 保存数据到localStorage
  const saveData = (data: WaterData) => {
    setWaterData(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  // 添加饮水记录
  const addWater = (amount: number) => {
    const now = new Date()
    const timeString = now.toTimeString().slice(0, 5) // HH:MM
    
    const newData: WaterData = {
      date: today,
      amount: waterData.amount + amount,
      records: [...waterData.records, { time: timeString, amount }]
    }
    
    saveData(newData)
  }

  // 撤销最后一次记录
  const undoLast = () => {
    if (waterData.records.length === 0) return
    
    const newRecords = [...waterData.records]
    const lastRecord = newRecords.pop()
    
    const newData: WaterData = {
      date: today,
      amount: waterData.amount - (lastRecord?.amount || 0),
      records: newRecords
    }
    
    saveData(newData)
  }

  // 计算进度百分比
  const progress = Math.min((waterData.amount / dailyGoal) * 100, 100)
  const isGoalReached = waterData.amount >= dailyGoal

  return (
    <div className="h-full w-full p-3">
      <div className="h-full w-full flex flex-col">
        <h3 className="text-sm font-medium mb-3 truncate" title={title}>
          {title}
        </h3>
        
        {/* 进度显示 */}
        <div className="flex-1 flex flex-col justify-center items-center mb-3">
          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-blue-600">
              {waterData.amount}ml
            </div>
            <div className="text-xs text-gray-500">
              目标: {dailyGoal}ml
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="w-full max-w-32 bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isGoalReached ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="text-xs text-gray-500">
            {progress.toFixed(0)}% 
            {isGoalReached && ' 🎉 目标达成!'}
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => addWater(cupSize)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded transition-colors"
            >
              +{cupSize}ml
            </button>
            <button
              onClick={() => addWater(cupSize / 2)}
              className="flex-1 bg-blue-400 hover:bg-blue-500 text-white text-xs py-2 px-3 rounded transition-colors"
            >
              +{cupSize / 2}ml
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={undoLast}
              disabled={waterData.records.length === 0}
              className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs py-1 px-3 rounded transition-colors"
            >
              撤销
            </button>
            <div className="flex-1 text-xs text-gray-500 flex items-center justify-center">
              今日{waterData.records.length}次
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { WaterCounter }
