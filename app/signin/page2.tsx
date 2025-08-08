'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, Shield, Zap } from 'lucide-react'

export default function Login() {
  const handleGoogleLogin = () => {
    // 这里可以集成实际的Google登录逻辑
    console.log("Google login clicked")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            AppName
          </h1>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-none">
          <CardHeader className="text-center space-y-3 pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              欢迎回来
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              使用您的Google账户快速登录
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 px-8 pb-8">
            <Button 
              onClick={handleGoogleLogin}
              className="w-full h-14 text-base font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Chrome className="w-4 h-4 text-white" />
                </div>
                <span>使用Google登录</span>
              </div>
            </Button>

            
          </CardContent>
        </Card>

        {/* 底部文字 */}
        <p className="text-center text-sm text-gray-500 mt-8">
          首次登录将自动创建账户
        </p>
      </div>
    </div>
  )
}
