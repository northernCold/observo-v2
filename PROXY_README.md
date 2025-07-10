# Observo - 安全的动态代理配置

这个项目实现了具有多层安全防护的动态代理功能，防止恶意滥用。

## 🔒 安全特性

### 核心安全措施
- ✅ **IP 地址过滤**: 自动阻止访问私有IP、localhost、内网地址
- ✅ **协议限制**: 仅允许 HTTP/HTTPS 协议
- ✅ **域名黑名单**: 内置危险域名黑名单，阻止访问云服务元数据端点
- ✅ **速率限制**: 每IP每分钟最多100次请求
- ✅ **请求大小限制**: 请求体最大1MB
- ✅ **超时控制**: 30秒请求超时
- ✅ **域名白名单**: 可配置允许的域名列表

### 可配置的安全选项
- 🔧 **域名白名单控制**: 通过环境变量启用/禁用
- 🔧 **自定义允许域名**: 支持子域名匹配
- 🔧 **实时监控**: 统计请求数据和阻止情况
- 🔧 **详细日志**: 记录所有安全事件

## 🚀 快速开始

### 1. 环境配置

```bash
# 代理安全配置
PROXY_ENABLE_DOMAIN_WHITELIST=true
PROXY_ALLOWED_DOMAINS=jsonplaceholder.typicode.com,httpbin.org,api.github.com
```

### 2. 启动服务

```bash
pnpm dev
```

### 3. 访问页面

- **代理测试**: `http://localhost:3000/proxy-demo`
- **安全管理**: `http://localhost:3000/security-dashboard`

## 🛡️ 安全防护详情

### 1. 网络安全
```typescript
// 自动阻止的地址范围
- localhost, 127.0.0.1
- 私有网络: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
- 云服务元数据: 169.254.169.254, metadata.google.internal
```

### 2. 请求限制
```typescript
// 安全限制配置
{
  maxBodySize: 1024 * 1024,    // 1MB
  requestTimeout: 30000,        // 30秒
  rateLimit: {
    requests: 100,              // 每分钟100次
    windowMs: 60 * 1000
  }
}
```

### 3. 域名控制
```bash
# 启用白名单模式
PROXY_ENABLE_DOMAIN_WHITELIST=true

# 允许的域名列表
PROXY_ALLOWED_DOMAINS=api.trusted.com,public-api.service.com
```

## 📊 监控和管理

### 安全仪表板
访问 `/security-dashboard` 查看：
- 总请求统计
- 被阻止的请求数量
- 速率限制触发次数
- 热门访问域名

### 日志监控
```bash
# 查看安全日志
tail -f logs/security.log

# 常见安全事件
"Security check failed for IP x.x.x.x: Access to private IP addresses is not allowed"
"Rate limit exceeded for IP x.x.x.x"
"Target domain is not in the allowed list"
```

## 🔧 配置示例

### 生产环境配置
```bash
# 严格模式 - 只允许特定域名
PROXY_ENABLE_DOMAIN_WHITELIST=true
PROXY_ALLOWED_DOMAINS=api.partner1.com,api.partner2.com

# 可选：更严格的速率限制
PROXY_RATE_LIMIT_REQUESTS=50
PROXY_RATE_LIMIT_WINDOW=60000
```

### 开发环境配置
```bash
# 宽松模式 - 允许常见测试API
PROXY_ENABLE_DOMAIN_WHITELIST=false
PROXY_ALLOWED_DOMAINS=jsonplaceholder.typicode.com,httpbin.org
```

## ⚠️ 安全建议

### 1. 生产部署建议
- 启用域名白名单
- 配置反向代理 (Nginx/Cloudflare)
- 使用 HTTPS 加密传输
- 定期监控访问日志

### 2. 网络安全
- 部署在受信任的网络环境
- 使用防火墙限制出站连接
- 定期更新依赖包

### 3. 访问控制
- 添加身份验证
- 限制管理页面访问
- 使用 API 密钥管理

## 🚫 被阻止的请求类型

代理会自动阻止以下类型的请求：

1. **内网扫描**: 访问私有IP地址
2. **本地服务**: 访问localhost服务
3. **云元数据**: 访问云服务商元数据端点
4. **恶意协议**: 非HTTP/HTTPS协议
5. **超大请求**: 超过1MB的请求体
6. **频繁请求**: 超过速率限制的请求

## 🔍 故障排除

### 常见错误和解决方案

1. **"Target domain is blocked for security reasons"**
   - 检查域名是否在黑名单中
   - 确认不是私有IP地址

2. **"Rate limit exceeded"**
   - 等待限制时间窗口重置
   - 检查是否有异常的高频请求

3. **"Target domain is not in the allowed list"**
   - 确认域名已添加到白名单
   - 检查 `PROXY_ENABLE_DOMAIN_WHITELIST` 设置

## 📱 API 使用示例

```typescript
// 安全的代理调用
const proxyAPI = new ProxyAPI('https://api.trusted.com');

try {
  const data = await proxyAPI.get('users');
  console.log(data);
} catch (error) {
  if (error.message.includes('blocked')) {
    console.log('请求被安全策略阻止');
  } else if (error.message.includes('rate limit')) {
    console.log('请求过于频繁，请稍后再试');
  }
}
```

通过这些安全措施，您的代理服务现在可以安全地部署到生产环境，有效防止恶意滥用。