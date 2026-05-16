import OpenAI from 'openai'
import type { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat/completions'

const DEV = process.env.NODE_ENV === 'development'

function log(label: string, data: unknown) {
  if (DEV) console.log(`[OpenRouter] ${label}`, JSON.stringify(data, null, 2))
}

export const orClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    'X-Title': 'AI Pet',
  },
})

type CompletionParams = ChatCompletionCreateParamsNonStreaming

// Seedream 响应中 message.images 不在 OpenAI SDK 类型里，需要强转
interface ImageChoice {
  message: {
    images?: Array<{ image_url: { url: string } }>
  }
}

export async function imageGeneration(prompt: string): Promise<string | null> {
  const model = process.env.IMAGE_MODEL || 'bytedance-seed/seedream-4.5'
  log('→ imageGen', { model, prompt: prompt.slice(0, 60) + '…' })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 60_000)

  let resp: OpenAI.Chat.ChatCompletion
  try {
    resp = await orClient.chat.completions.create(
      {
        model,
        stream: false,
        // modalities 不在标准 SDK 类型里，强转绕过
        ...({ modalities: ['image'] } as object),
        messages: [{ role: 'user', content: prompt }],
      } as CompletionParams,
      { signal: controller.signal }
    )
  } catch (err: unknown) {
    clearTimeout(timer)
    if (err instanceof OpenAI.APIError) {
      if (err.status === 401) { log('← imageGen ERR', '401 认证失败'); return null }
      if (err.status === 429) { log('← imageGen ERR', '429 超限'); return null }
    }
    if (err instanceof Error && err.name === 'AbortError') {
      log('← imageGen ERR', 'timeout 60s'); return null
    }
    log('← imageGen ERR', err instanceof Error ? err.message : String(err))
    return null
  }
  clearTimeout(timer)

  const choice = (resp.choices[0] as unknown as ImageChoice)
  const url = choice?.message?.images?.[0]?.image_url?.url ?? null

  log('← imageGen', {
    model: resp.model,
    hasImage: Boolean(url),
    cost: (resp as unknown as { usage?: { cost?: number } }).usage?.cost,
  })

  return url
}

export async function chatCompletion(
  params: CompletionParams & { _label?: string }
): Promise<OpenAI.Chat.ChatCompletion> {
  const label = params._label || 'chat'
  const { _label: _, ...rest } = params

  log(`→ ${label}`, { model: rest.model, messages: rest.messages?.length })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30_000)

  let resp: OpenAI.Chat.ChatCompletion
  try {
    resp = await orClient.chat.completions.create(
      { ...rest, stream: false },
      { signal: controller.signal }
    )
  } catch (err: unknown) {
    clearTimeout(timer)
    if (err instanceof OpenAI.APIError) {
      if (err.status === 401) throw new Error('OpenRouter 认证失败：请检查 OPENROUTER_API_KEY')
      if (err.status === 429) throw new Error('OpenRouter 请求超限（429），请稍后重试')
      const body = err.error ? JSON.stringify(err.error) : err.message
      throw new Error(`OpenRouter ${err.status} [model=${rest.model}]: ${body}`)
    }
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('OpenRouter 请求超时（30s）')
    }
    throw err
  }
  clearTimeout(timer)

  log(`← ${label}`, {
    model: resp.model,
    tokens: resp.usage?.total_tokens,
    cost: (resp as unknown as { usage?: { cost?: number } }).usage?.cost,
  })

  return resp
}
