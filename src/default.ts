export const defaultSetting = {
  continuousDialogue: true,
  archiveSession: false,
  xaiAPIKey: "",
  xaiAPITemperature: 60,
  systemRule: ""
};

export const defaultMessage = `
- 这是一个基于xAI Grok-3-beta的聊天程序，旨在帮助人们解决工作、学习和生活中的问题。该程序可以使用自然语言处理技术进行问答交互，通过提供实时、个性化的答案，帮助用户快速解决问题。
- 请在设置中填入你的xAI API密钥（格式：在xAI开发者平台获取的API密钥）。
- 请在下方输入框中输入你需要解决的问题，支持连续对话。`;
