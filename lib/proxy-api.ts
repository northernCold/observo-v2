// 精简的代理 API 工具函数 - 支持 GET 和 POST 请求
export class ProxyAPI {
  private baseUrl: string;
  private targetUrl: string;
  private apiKey?: string;

  constructor(
    targetUrl: string,
    apiKey?: string,
    baseUrl: string = '/api/proxy'
  ) {
    this.baseUrl = baseUrl;
    this.targetUrl = targetUrl;
    this.apiKey = apiKey;
  }

  private getHeaders(additionalHeaders?: Record<string, string>): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json, text/plain, */*',
      'X-Proxy-Target': this.targetUrl,
      ...additionalHeaders
    };

    if (this.apiKey) {
      headers['X-Proxy-API-Key'] = this.apiKey;
    }

    return headers;
  }

  // 智能解析响应内容
  private async parseResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    
    if (!contentType) {
      return await response.text();
    }

    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch (error) {
        console.warn('Failed to parse JSON response, returning as text:', error);
        return await response.text();
      }
    } else if (contentType.includes('text/xml') || contentType.includes('application/xml')) {
      return await response.text();
    } else if (contentType.includes('text/')) {
      return await response.text();
    } else {
      return await response.arrayBuffer();
    }
  }

  // GET 请求
  async get(path: string, params?: Record<string, string>) {
    const url = new URL(`${this.baseUrl}/${path}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return this.parseResponse(response);
  }

  // POST 请求
  async post(path: string, body?: any, additionalHeaders?: Record<string, string>) {
    const url = new URL(`${this.baseUrl}/${path}`, window.location.origin);

    const headers = this.getHeaders(additionalHeaders);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return this.parseResponse(response);
  }

  // 获取原始响应（不解析内容）
  async getRaw(path: string, params?: Record<string, string>): Promise<Response> {
    const url = new URL(`${this.baseUrl}/${path}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return response;
  }

  // 获取响应信息（包括头部和内容类型）
  async getWithMetadata(path: string, params?: Record<string, string>) {
    const url = new URL(`${this.baseUrl}/${path}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await this.parseResponse(response);
    
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      contentType: response.headers.get('content-type'),
    };
  }

  // 更新代理目标地址
  setTargetUrl(targetUrl: string) {
    this.targetUrl = targetUrl;
  }

  // 更新 API 密钥
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  // 获取当前代理目标地址
  getTargetUrl(): string {
    return this.targetUrl;
  }
}

// 使用示例：
// const proxyAPI = new ProxyAPI('https://api.example.com', 'your-api-key');
// const data = await proxyAPI.get('users');
// const postData = await proxyAPI.post('users', { name: 'John' });
// const dataWithParams = await proxyAPI.get('users', { page: '1', limit: '10' });