# Grok-3 客户端 

这是一个基于xAI Grok-3-beta API的聊天客户端，从原有的ChatGPT客户端改造而来。

## 项目特点

- 使用xAI Grok-3-beta模型进行对话
- 支持连续对话功能
- 支持会话历史记录
- 支持温度设置调整回答多样性
- 支持系统角色提示词

## API更新说明

本项目已从OpenAI ChatGPT API更新为xAI Grok API。主要更改包括：

1. API端点从`https://api.openai.com/v1`更改为`https://api.x.ai/v1`
2. 模型名称从`gpt-3.5-turbo`更改为`grok-3-beta`
3. 环境变量从`OPENAI_API_KEY`更改为`XAI_API_KEY`

## API密钥格式说明

xAI API密钥格式示例：
- 可能是`xai-BAeXu2cjhpz34fOxHbOqd8to...`格式
- 确保使用从xAI开发者平台获取的完整密钥

## 部署方式

1. 克隆此仓库
2. 创建`.env`文件并设置`XAI_API_KEY`环境变量
3. 运行`pnpm i`安装依赖
4. 使用`pnpm dev`本地调试或`pnpm build`构建

## 环境变量

```
XAI_API_KEY=你的xAI_API密钥
```

## 如何获取xAI API密钥

1. 访问xAI开发者平台
2. 注册/登录您的账户
3. 在开发者设置中创建新的API密钥
4. 将生成的API密钥复制到应用的设置中

## 技术栈

- Astro
- SolidJS
- Vercel部署 

## 常见问题

**Q: 为什么提示"没有填写xAI API key"？**
A: 确保您已在设置中填入有效的xAI API密钥，或在环境变量中设置了`XAI_API_KEY`。如果仍有问题，尝试清除浏览器缓存。

**Q: 对话没有响应怎么办？**
A: 检查您的API密钥是否有效，以及xAI API服务是否可用。某些地区可能需要使用代理服务器访问xAI API。

**Q: 收到连接错误如何处理？**
A: 
1. 确保API密钥格式正确
2. 检查网络连接，特别是在某些地区可能需要VPN
3. 清除浏览器缓存和本地存储
4. 刷新页面并重试 