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

    // 如果有自定义 API 密钥，添加到请求头
    const apiKey = request.headers.get('X-Proxy-API-Key');
    if (apiKey) {
      headers.set('X-API-Key', apiKey);
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

    // 发送代理请求
    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
    };

    // 只有在非 GET/HEAD 请求时才添加 body
    if (body && request.method !== 'GET' && request.method !== 'HEAD') {
      fetchOptions.body = body;
    }

    const response = await fetch(targetUrl.toString(), fetchOptions);

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

    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

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