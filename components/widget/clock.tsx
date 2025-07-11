"use client"

import type { WidgetLayout } from '@/types/widget'
import { useEffect, useState } from 'react'

interface ClockProps extends WidgetLayout {
  format?: '12h' | '24h'
  showDate?: boolean
  timezone?: string
}

function Clock(props: ClockProps) {
  const { 
    title = '时钟', 
    format = '24h', 
    showDate = true,
    timezone = 'Asia/Shanghai'
  } = props

  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour12: format === '12h',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
    return date.toLocaleTimeString('zh-CN', options)
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }
    return date.toLocaleDateString('zh-CN', options)
  }

  return (
    <div className="h-full w-full p-2">
      <div className="h-full w-full flex flex-col justify-center items-center">
        <h3 className="text-sm font-medium mb-4 truncate" title={title}>
          {title}
        </h3>
        
        <div className="text-center">
          <div className="text-2xl font-mono font-bold mb-2">
            {formatTime(time)}
          </div>
          
          {showDate && (
            <div className="text-xs text-gray-500">
              {formatDate(time)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { Clock }
