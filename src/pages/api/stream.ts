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

  try {
    const completion = await fetch("https://api.x.ai/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      method: "POST",
      body: JSON.stringify({
        model: "grok-3-beta",
        messages,
        temperature,
        stream: true
      })
    })

    if (!completion.ok) {
      const error = await completion.json().catch(() => ({}))
      return new Response(
        JSON.stringify({
          error: true,
          message: error?.error?.message || `API请求失败: ${completion.status}`
        }),
        { status: completion.status, headers: { "Content-Type": "application/json" } }
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
              controller.error(e)
            }
          }
        }

        const parser = createParser(streamParser)
        for await (const chunk of completion.body as any) {
          parser.feed(decoder.decode(chunk))
        }
      }
    })

    return new Response(stream)
  } catch (error: any) {
    console.error("xAI API请求错误:", error)
    return new Response(
      JSON.stringify({ 
        error: true, 
        message: `API请求错误: ${error.message || "未知错误"}` 
      }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
