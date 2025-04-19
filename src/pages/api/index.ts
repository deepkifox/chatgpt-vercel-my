import type { APIRoute } from "astro"

export const post: APIRoute = async ({ request }) => {
  const { message, key } = (await request.json()) ?? {}
  if (!message) {
    return {
      body: JSON.stringify({
        success: false,
        message: "message is required"
      })
    }
  }
  if (!key) {
    return {
      body: JSON.stringify({
        success: false,
        message: "xai api key is required"
      })
    }
  }

  // 记录请求信息（不包括敏感数据）
  console.log("API请求：", {
    endpoint: "https://api.x.ai/v1/chat/completions",
    hasKey: !!key,
    messageLength: message.length
  })

  try {
    // 创建一个完整的请求配置对象，便于调试
    const requestConfig = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "grok-3-beta",
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      })
    }
    
    const response = await fetch(`https://api.x.ai/v1/chat/completions`, requestConfig)
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => "无法解析错误响应")
      let errorJson = {}
      try {
        errorJson = JSON.parse(errorText)
      } catch (e) {
        // 如果不是JSON格式，保持errorJson为空对象
      }
      
      console.error("xAI API请求失败:", {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      })
      
      // 根据状态码提供更具体的错误信息
      let errorMessage = `API请求失败: ${response.status}`
      if (response.status === 401 || response.status === 403) {
        errorMessage = "API密钥无效或未授权，请检查您的xAI API密钥"
      } else if (response.status === 429) {
        errorMessage = "API请求过多，请稍后再试"
      } else if (response.status >= 500) {
        errorMessage = "xAI服务器错误，请稍后再试"
      }
      
      // 添加更多详细信息（如果存在）
      if (errorJson.error?.message) {
        errorMessage += `: ${errorJson.error.message}`
      }
      
      return {
        body: JSON.stringify({
          success: false,
          message: errorMessage,
          details: errorJson.error || null
        })
      }
    }
    
    let result = await response.json()
    return {
      body: JSON.stringify({
        success: true,
        message: "ok",
        data: result?.choices?.[0].message
      })
    }
  } catch (error: any) {
    console.error("xAI API请求错误:", error)
    return {
      body: JSON.stringify({
        success: false,
        message: `API请求错误: ${error.message || "未知错误"}`,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      })
    }
  }
}
