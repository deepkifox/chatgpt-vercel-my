import type { APIRoute } from "astro"
import {
  createParser,
  ParsedEvent,
  ReconnectInterval
} from "eventsource-parser"

const localEnv = import.meta.env.XAI_API_KEY
const vercelEnv = process.env.XAI_API_KEY

const apiKeys = ((localEnv || vercelEnv)?.split(/\s*\|\s*/) ?? []).filter(
  Boolean
)

export const post: APIRoute = async context => {
  const body = await context.request.json()
  const apiKey = apiKeys.length
    ? apiKeys[Math.floor(Math.random() * apiKeys.length)]
    : ""
  let { messages, key = apiKey, temperature = 0.6 } = body

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  if (!key) {
    return new Response("没有填写 xAI API key", { status: 400 })
  }
  if (!messages) {
    return new Response("没有输入任何文字", { status: 400 })
  }

  console.log("API请求：", {
    endpoint: "https://api.x.ai/v1/chat/completions",
    hasKey: !!key,
    messagesCount: messages.length,
    temperature
  })

  try {
    const requestConfig = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "grok-3",
        messages,
        temperature,
        stream: true
      })
    }

    const completion = await fetch("https://api.x.ai/v1/chat/completions", requestConfig)

    if (!completion.ok) {
      const errorText = await completion.text().catch(() => "无法解析错误响应")
      let errorJson = {}
      try {
        errorJson = JSON.parse(errorText)
      } catch (e) {
        // 如果不是JSON格式，保持errorJson为空对象
      }
      
      console.error("xAI API请求失败:", {
        status: completion.status,
        statusText: completion.statusText,
        errorBody: errorText
      })
      
      let errorMessage = `API请求失败: ${completion.status}`
      if (completion.status === 401 || completion.status === 403) {
        errorMessage = "API密钥无效或未授权，请检查您的xAI API密钥"
      } else if (completion.status === 429) {
        errorMessage = "API请求过多，请稍后再试"
      } else if (completion.status >= 500) {
        errorMessage = "xAI服务器错误，请稍后再试"
      }
      
      if (errorJson.error?.message) {
        errorMessage += `: ${errorJson.error.message}`
      }
      
      return new Response(
        JSON.stringify({
          error: true,
          message: errorMessage,
          details: errorJson.error || null
        }),
        { 
          status: completion.status, 
          headers: { "Content-Type": "application/json" } 
        }
      )
    }

    const stream = new ReadableStream({
      async start(controller) {
        const streamParser = (event: ParsedEvent | ReconnectInterval) => {
          if (event.type === "event") {
            const data = event.data
            if (data === "[DONE]") {
              controller.close()
              return
            }
            try {
              const json = JSON.parse(data)
              const text = json.choices[0].delta?.content
              if (text) {
                const queue = encoder.encode(text)
                controller.enqueue(queue)
              }
            } catch (e) {
              console.error("解析流数据错误:", e)
              controller.error(e)
            }
          }
        }

        const parser = createParser(streamParser)
        try {
          for await (const chunk of completion.body as any) {
            parser.feed(decoder.decode(chunk))
          }
        } catch (e) {
          console.error("读取流数据错误:", e)
          controller.error(e)
        }
      }
    })

    return new Response(stream)
  } catch (error: any) {
    console.error("xAI API请求错误:", error)
    return new Response(
      JSON.stringify({ 
        error: true, 
        message: `API请求错误: ${error.message || "未知错误"}`,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
