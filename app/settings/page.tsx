'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProxyAPI } from '@/lib/proxy-api'

export default function SettingsPage() {
  const [notionToken, setNotionToken] = useState('')
  const [isTokenMasked, setIsTokenMasked] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // 加载已保存的 token
  useEffect(() => {
    const savedToken = localStorage.getItem('notion_token')
    if (savedToken) {
      setNotionToken(savedToken)
    }
  }, [])

  // 保存 token
  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')

    try {
      if (notionToken.trim()) {
        localStorage.setItem('notion_token', notionToken.trim())
        setSaveMessage('Token 保存成功！')
      } else {
        localStorage.removeItem('notion_token')
        setSaveMessage('Token 已清除')
      }
    } catch {
      setSaveMessage('保存失败，请重试')
    } finally {
      setIsSaving(false)
      // 3秒后清除消息
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  // 测试 token 有效性
  const handleTestToken = async () => {
    if (!notionToken.trim()) {
      setSaveMessage('请先输入 Token')
      return
    }

    setIsSaving(true)
    setSaveMessage('正在测试连接...')

    try {
      // 使用代理服务器调用 Notion API 避免 CORS 问题
      const proxyAPI = new ProxyAPI('https://api.notion.com', notionToken.trim())
      const userData = await proxyAPI.get('v1/users/me')
      
      setSaveMessage(`连接成功！用户：${userData.name || userData.email || 'Unknown'}`)
    } catch (error) {
      console.error('Token test error:', error)
      if (error instanceof Error && error.message.includes('401')) {
        setSaveMessage('Token 无效或权限不足')
      } else if (error instanceof Error && error.message.includes('403')) {
        setSaveMessage('Token 权限不足，请检查 integration 配置')
      } else {
        setSaveMessage('连接测试失败，请检查 Token 是否正确')
      }
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 5000)
    }
  }

  // 清除 token
  const handleClear = () => {
    setNotionToken('')
    localStorage.removeItem('notion_token')
    setSaveMessage('Token 已清除')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  // 切换显示/隐藏 token
  const toggleTokenVisibility = () => {
    setIsTokenMasked(!isTokenMasked)
  }

  const displayToken = isTokenMasked && notionToken 
    ? notionToken.replace(/./g, '•') 
    : notionToken

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">设置</h1>
        <p className="text-gray-600">配置你的 Notion 集成和其他设置</p>
      </div>

      <div className="space-y-6">
        {/* Notion 设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">N</span>
              </div>
              Notion 集成
            </CardTitle>
            <CardDescription>
              配置 Notion Integration Token 以访问你的 Notion 数据
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Integration Token
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={displayToken}
                    onChange={(e) => setNotionToken(e.target.value)}
                    placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full p-3 border rounded-md font-mono text-sm"
                    disabled={isSaving}
                  />
                  {notionToken && (
                    <button
                      type="button"
                      onClick={toggleTokenVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title={isTokenMasked ? '显示 Token' : '隐藏 Token'}
                    >
                      {isTokenMasked ? '👁️' : '🙈'}
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Token 将保存在浏览器本地存储中，不会上传到服务器
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                variant="default"
              >
                {isSaving ? '保存中...' : '保存'}
              </Button>
              
              <Button 
                onClick={handleTestToken}
                disabled={isSaving || !notionToken.trim()}
                variant="outline"
              >
                {isSaving ? '测试中...' : '测试连接'}
              </Button>
              
              {notionToken && (
                <Button 
                  onClick={handleClear}
                  disabled={isSaving}
                  variant="destructive"
                >
                  清除
                </Button>
              )}
            </div>

            {saveMessage && (
              <div className={`p-3 rounded-md text-sm ${
                saveMessage.includes('成功') || saveMessage.includes('连接成功') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : saveMessage.includes('失败') || saveMessage.includes('无效')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {saveMessage}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle>如何获取 Notion Integration Token</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 space-y-3">
              <div>
                <p className="font-medium mb-2">步骤 1: 创建 Integration</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>访问 <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.notion.so/my-integrations</a></li>
                  <li>点击 "New integration"</li>
                  <li>填写基本信息（名称、描述等）</li>
                  <li>选择关联的 workspace</li>
                  <li>点击 "Submit" 创建</li>
                </ol>
              </div>
              
              <div>
                <p className="font-medium mb-2">步骤 2: 获取 Token</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>在创建的 integration 页面中找到 "Internal Integration Token"</li>
                  <li>点击 "Show" 显示完整 token</li>
                  <li>复制 token（以 "secret_" 开头）</li>
                  <li>粘贴到上面的输入框中</li>
                </ol>
              </div>
              
              <div>
                <p className="font-medium mb-2">步骤 3: 配置权限</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>在需要访问的 Notion 页面或数据库中点击右上角的 "Share"</li>
                  <li>搜索并选择你刚创建的 integration</li>
                  <li>确保给予读取权限</li>
                  <li>点击 "Invite" 完成授权</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 安全提示 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">🔒 安全提示</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Token 仅保存在你的浏览器本地存储中，不会上传到任何服务器</p>
              <p>• 请勿将 Token 分享给他人或在公共场所展示</p>
              <p>• 如果怀疑 Token 泄露，请立即在 Notion 中重新生成</p>
              <p>• 定期检查 integration 的权限设置，移除不必要的访问权限</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}