'use client';

import { useState } from 'react';
import { ProxyAPI } from '@/lib/proxy-api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ProxyDemo() {
  const [proxyUrl, setProxyUrl] = useState('https://jsonplaceholder.typicode.com');
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('posts/1');
  const [queryParams, setQueryParams] = useState('');
  const [response, setResponse] = useState('');
  const [responseMetadata, setResponseMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequest = async () => {
    try {
      setLoading(true);
      setError('');
      setResponse('');
      setResponseMetadata(null);

      const proxyAPI = new ProxyAPI(proxyUrl, apiKey || undefined);
      
      // 解析查询参数
      const params: Record<string, string> = {};
      if (queryParams) {
        queryParams.split('&').forEach(param => {
          const [key, value] = param.split('=');
          if (key && value) {
            params[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        });
      }

      // 使用 getWithMetadata 获取详细响应信息
      const metadata = await proxyAPI.getWithMetadata(endpoint, Object.keys(params).length > 0 ? params : undefined);
      const result = metadata.data;

      // 根据响应类型格式化显示
      if (typeof result === 'string') {
        // 检查是否是 XML
        if (result.trim().startsWith('<?xml') || result.trim().startsWith('<')) {
          setResponse(result);
        } else {
          try {
            // 尝试解析为 JSON 并格式化
            const parsed = JSON.parse(result);
            setResponse(JSON.stringify(parsed, null, 2));
          } catch {
            // 如果不是 JSON，直接显示
            setResponse(result);
          }
        }
      } else if (result instanceof ArrayBuffer) {
        // 二进制数据
        setResponse(`[Binary data: ${result.byteLength} bytes]`);
      } else {
        // 对象类型
        setResponse(JSON.stringify(result, null, 2));
      }

      setResponseMetadata(metadata);
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">动态代理 API 测试</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 请求配置 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">请求配置</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                代理目标 URL
              </label>
              <input
                type="url"
                value={proxyUrl}
                onChange={(e) => setProxyUrl(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="https://api.example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                API 密钥 (可选)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="输入 API 密钥"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                请求端点
              </label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="posts/1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                查询参数
              </label>
              <input
                type="text"
                value={queryParams}
                onChange={(e) => setQueryParams(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="userId=1&title=foo"
              />
            </div>

            <Button 
              onClick={handleRequest}
              disabled={loading || !proxyUrl || !endpoint}
              className="w-full"
            >
              {loading ? '发送中...' : '发送请求'}
            </Button>
          </div>
        </Card>

        {/* 响应结果 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">响应结果</h2>
          
          <div className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 font-medium">错误:</p>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {responseMetadata && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  响应信息
                </label>
                <div className="bg-blue-50 p-3 rounded-md text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div><strong>状态码:</strong> {responseMetadata.status}</div>
                    <div><strong>状态文本:</strong> {responseMetadata.statusText}</div>
                    <div><strong>内容类型:</strong> {responseMetadata.contentType || 'unknown'}</div>
                    <div><strong>响应大小:</strong> {response.length} 字符</div>
                  </div>
                </div>
              </div>
            )}

            {response && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  响应数据
                  {responseMetadata?.contentType && (
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
                      {responseMetadata.contentType.split(';')[0]}
                    </span>
                  )}
                </label>
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 text-sm">
                  {response}
                </pre>
              </div>
            )}

            {!response && !error && !loading && (
              <div className="text-gray-500 text-center py-8">
                配置请求参数并点击发送请求查看结果
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 预设示例 */}
      <Card className="p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">预设示例</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setProxyUrl('https://jsonplaceholder.typicode.com');
              setEndpoint('posts/1');
              setQueryParams('');
            }}
            className="text-left"
          >
            <div>
              <div className="font-medium">JSON API 示例</div>
              <div className="text-sm text-gray-600">JSONPlaceholder</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              setProxyUrl('https://httpbin.org');
              setEndpoint('xml');
              setQueryParams('');
            }}
            className="text-left"
          >
            <div>
              <div className="font-medium">XML API 示例</div>
              <div className="text-sm text-gray-600">HTTPBin XML</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              setProxyUrl('https://httpbin.org');
              setEndpoint('get');
              setQueryParams('test=data&timestamp=' + new Date().toISOString());
            }}
            className="text-left"
          >
            <div>
              <div className="font-medium">GET 请求示例</div>
              <div className="text-sm text-gray-600">HTTPBin GET</div>
            </div>
          </Button>
        </div>
      </Card>

      {/* 使用说明 */}
      <Card className="p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">使用说明</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">基本参数</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>代理目标 URL:</strong> 输入要代理的 API 服务器地址</li>
                <li>• <strong>API 密钥:</strong> 如果目标 API 需要认证，请输入 API 密钥</li>
                <li>• <strong>请求端点:</strong> 输入具体的 API 端点路径</li>
                <li>• <strong>查询参数:</strong> 输入 URL 查询参数 (key=value 形式)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">支持的响应格式</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>JSON:</strong> 自动格式化显示</li>
                <li>• <strong>XML:</strong> 保持原始格式</li>
                <li>• <strong>HTML:</strong> 显示源代码</li>
                <li>• <strong>文本:</strong> 纯文本显示</li>
                <li>• <strong>二进制:</strong> 显示大小信息</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>注意:</strong> 此代理工具会自动检测响应类型并智能解析。如果遇到 JSON 解析错误，
              系统会自动回退到文本格式显示，确保您能看到原始响应内容。
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}