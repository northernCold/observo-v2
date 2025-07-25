import { NextRequest, NextResponse } from 'next/server'
import { WidgetConfig } from '@/components/widget-config-form'

export async function GET() {
  try {
    // 在服务端，我们可以从数据库或文件系统读取
    // 这里先返回空数组，实际项目中可以连接数据库
    return NextResponse.json([])
  } catch (error) {
    console.error('Failed to load widget configs:', error)
    return NextResponse.json({ error: 'Failed to load configs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const configs: WidgetConfig[] = await request.json()
    
    // 在实际项目中，这里应该保存到数据库
    // 现在我们使用 cookies 作为临时存储
    const response = NextResponse.json({ success: true })
    response.cookies.set('widget-configs', JSON.stringify(configs), {
      maxAge: 60 * 60 * 24 * 30, // 30 天
      httpOnly: false, // 允许客户端访问
      sameSite: 'lax'
    })
    
    return response
  } catch (error) {
    console.error('Failed to save widget configs:', error)
    return NextResponse.json({ error: 'Failed to save configs' }, { status: 500 })
  }
}