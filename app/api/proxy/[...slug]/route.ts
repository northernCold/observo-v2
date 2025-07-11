import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleProxy(request, params.slug);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleProxy(request, params.slug);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleProxy(request, params.slug);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleProxy(request, params.slug);
}

async function handleProxy(request: NextRequest, slug: string[]) {
  try {
    // 从请求头中获取目标 API 基础 URL
    const targetBaseUrl = request.headers.get('X-Proxy-Target');
    
    if (!targetBaseUrl) {
      return NextResponse.json(
        { error: 'Missing X-Proxy-Target header' },
        { status: 400 }
      );
    }

    // 验证 URL 格式
    let targetUrl: URL;
    try {
      // 构建目标 URL
      const targetPath = slug.join('/');
      targetUrl = new URL(targetPath, targetBaseUrl);
    } catch (urlError) {
      console.error('Invalid URL:', urlError);
      return NextResponse.json(
        { error: 'Invalid proxy target URL' },
        { status: 400 }
      );
    }
    
    // 复制查询参数
    const searchParams = request.nextUrl.searchParams;
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    // 准备请求头
    const headers = new Headers();
    
    // 复制重要的请求头，但跳过代理相关的头部
    ['content-type', 'authorization', 'accept', 'user-agent'].forEach(headerName => {
      const value = request.headers.get(headerName);
      if (value) {
        headers.set(headerName, value);
      }
    });

    // 处理 API 密钥认证
    const apiKey = request.headers.get('X-Proxy-API-Key');
    if (apiKey) {
      // 根据目标 API 设置正确的认证头
      const hostname = targetUrl.hostname.toLowerCase();
      
      if (hostname.includes('notion.com')) {
        // Notion API 使用 Bearer token
        headers.set('Authorization', `Bearer ${apiKey}`);
        headers.set('Notion-Version', '2022-06-28');
      } else if (hostname.includes('openai.com') || hostname.includes('api.openai.com')) {
        // OpenAI API 使用 Bearer token
        headers.set('Authorization', `Bearer ${apiKey}`);
      } else if (hostname.includes('anthropic.com')) {
        // Anthropic API 使用 x-api-key
        headers.set('x-api-key', apiKey);
      } else if (hostname.includes('googleapis.com')) {
        // Google APIs 使用 Authorization Bearer
        headers.set('Authorization', `Bearer ${apiKey}`);
      } else if (hostname.includes('github.com')) {
        // GitHub API 使用 Authorization token
        headers.set('Authorization', `token ${apiKey}`);
      } else {
        // 默认尝试多种常见的认证方式
        // 首先尝试 Authorization Bearer (最常用)
        headers.set('Authorization', `Bearer ${apiKey}`);
        // 同时设置其他可能的头部
        headers.set('X-API-Key', apiKey);
      }
    }

    // 准备请求体
    let body: string | FormData | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        body = JSON.stringify(await request.json());
      } else if (contentType?.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

    // 实现重试机制和超时控制
    const maxRetries = 3;
    const timeoutMs = 30000; // 30秒超时
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Proxy attempt ${attempt}/${maxRetries} to ${targetUrl.toString()}`);
        
        // 创建AbortController用于超时控制
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

        // 发送代理请求
        const fetchOptions: RequestInit = {
          method: request.method,
          headers,
          signal: abortController.signal,
        };

        // 只有在非 GET/HEAD 请求时才添加 body
        if (body && request.method !== 'GET' && request.method !== 'HEAD') {
          fetchOptions.body = body;
        }

        const response = await fetch(targetUrl.toString(), fetchOptions);
        
        // 清除超时定时器
        clearTimeout(timeoutId);

        // 检查响应状态
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // 获取响应数据
        const responseData = await response.text();
        
        // 创建响应头
        const responseHeaders = new Headers();
        
        // 复制响应头
        ['content-type', 'cache-control', 'expires', 'last-modified'].forEach(headerName => {
          const value = response.headers.get(headerName);
          if (value) {
            responseHeaders.set(headerName, value);
          }
        });

        // 添加 CORS 头部
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, X-Proxy-Target, X-Proxy-API-Key');

        console.log(`Proxy success on attempt ${attempt} to ${targetUrl.toString()}`);

        return new NextResponse(responseData, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });

      } catch (error) {
        lastError = error as Error;
        console.error(`Proxy attempt ${attempt}/${maxRetries} failed:`, {
          url: targetUrl.toString(),
          error: lastError.message,
          name: lastError.name
        });

        // 如果是最后一次尝试，不再重试
        if (attempt === maxRetries) {
          break;
        }

        // 根据错误类型决定是否重试
        if (lastError.name === 'AbortError') {
          console.log('Request timed out, retrying...');
        } else if (lastError.message.includes('fetch failed') || 
                   lastError.message.includes('network') ||
                   lastError.message.includes('ECONNRESET') ||
                   lastError.message.includes('ETIMEDOUT')) {
          console.log('Network error, retrying...');
        } else {
          // 对于非网络错误（如认证错误），不重试
          console.log('Non-retryable error, stopping retries');
          break;
        }

        // 等待一段时间再重试（指数退避）
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    // 所有重试都失败了
    const errorDetails = lastError ? lastError.message : 'Unknown error';
    console.error('All proxy attempts failed:', {
      url: targetUrl.toString(),
      attempts: maxRetries,
      lastError: errorDetails
    });

    return NextResponse.json(
      { 
        error: 'Proxy request failed', 
        details: errorDetails,
        attempts: maxRetries,
        url: targetUrl.toString()
      },
      { status: 500 }
    );

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// 处理 OPTIONS 请求用于 CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, X-Proxy-Target, X-Proxy-API-Key',
    },
  });
}