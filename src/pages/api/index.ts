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

  try {
    const response = await fetch(`https://api.x.ai/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": `application/json`
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
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        body: JSON.stringify({
          success: false,
          message: errorData?.error?.message || `API请求失败: ${response.status}`
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
        message: `API请求错误: ${error.message || "未知错误"}`
      })
    }
  }
}
