# Grok-3 客户端 ok

这是一个基于xAI Grok-3 API的聊天客户端，从原有的ChatGPT客户端改造而来。

## 项目特点

- 使用xAI Grok-3模型进行对话
- 支持连续对话功能
- 支持会话历史记录
- 支持温度设置调整回答多样性
- 支持系统角色提示词

## 部署方式

1. 克隆此仓库
2. 创建`.env`文件并设置`XAI_API_KEY`环境变量
3. 运行`pnpm i`安装依赖
4. 使用`pnpm dev`本地调试或`pnpm build`构建

## 环境变量

```
XAI_API_KEY=xai_your_api_key_here
```

## 技术栈

- Astro
- SolidJS
- Vercel部署 