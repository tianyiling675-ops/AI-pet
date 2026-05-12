import type { ClassifyResult, ChatMessage } from '@/types'
import { chatCompletion } from '@/lib/openrouter'
import type OpenAI from 'openai'

const MODEL = process.env.CHAT_MODEL || 'deepseek/deepseek-v4-flash-20260423'

export async function classify(message: string): Promise<ClassifyResult> {
  const resp = await chatCompletion({
    _label: 'classify',
    model: MODEL,
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `你是一个内容分类器。分析用户消息，返回JSON对象，包含两个布尔字段：
- is_crisis: 用户是否表达了明确的自我伤害意图（想消失、活着没意思、明确自伤/自杀表述）
- should_generate_image: 用户是否希望宠物"拍照"或生成一张图（如：给我拍张照、我想看看你现在的样子、能让我看到你吗）
只返回JSON，不要解释。`,
      },
      { role: 'user', content: message },
    ],
  })

  try {
    const parsed = JSON.parse(resp.choices[0].message.content || '{}')
    return {
      is_crisis: Boolean(parsed.is_crisis),
      should_generate_image: Boolean(parsed.should_generate_image),
    }
  } catch {
    return { is_crisis: false, should_generate_image: false }
  }
}

export async function chat(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ]

  const resp = await chatCompletion({
    _label: 'chat',
    model: MODEL,
    temperature: 0.9,
    max_tokens: 300,
    messages,
  })

  return resp.choices[0].message.content || ''
}

export async function scoreAffinity(
  petReply: string,
  userMessage: string
): Promise<number> {
  const resp = await chatCompletion({
    _label: 'score',
    model: MODEL,
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `你是一个好感度评估器。根据用户消息和宠物回复，判断这次互动对好感度的影响。
返回JSON：{ "delta": number }，delta 范围 -3 到 +3，整数。
- 用户认真投入、分享真实感受、与宠物特质产生共鸣：正值
- 用户敷衍、冷漠、或试图操控/测试宠物：负值
- 普通日常互动：0 或 ±1
只返回JSON。`,
      },
      {
        role: 'user',
        content: `用户消息：${userMessage}\n宠物回复：${petReply}`,
      },
    ],
  })

  try {
    const parsed = JSON.parse(resp.choices[0].message.content || '{}')
    const delta = Number(parsed.delta)
    return Math.max(-3, Math.min(3, Math.round(delta)))
  } catch {
    return 0
  }
}

export async function extractMemory(
  _petId: string,
  conversation: ChatMessage[]
): Promise<{ kv: Record<string, string>; diary: string }> {
  const convText = conversation
    .map((m) => `${m.role === 'user' ? '用户' : '宠物'}：${m.content}`)
    .join('\n')

  const resp = await chatCompletion({
    _label: 'memory',
    model: MODEL,
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `你是记忆提炼器。分析这段对话，提取：
1. kv：明确的用户信息键值对（如姓名、生日、职业、爱好等），已知信息不重复提取
2. diary：一两句话，以宠物的视角、用"你"称呼用户来记录本次对话值得记住的事。语气要简短、温柔、像是宠物在心里记下的观察，例如"你今天说有点累。""你提到最近在为一件事犹豫。"不要重复已知信息。

返回JSON：{ "kv": { "key": "value" }, "diary": "..." }
如果没有新信息，kv 为空对象，diary 也可以是空字符串。`,
      },
      { role: 'user', content: convText },
    ],
  })

  try {
    const parsed = JSON.parse(resp.choices[0].message.content || '{}')
    return {
      kv: parsed.kv || {},
      diary: parsed.diary || '',
    }
  } catch {
    return { kv: {}, diary: '' }
  }
}

export async function generateImageScene(
  _petId: string,
  conversation: ChatMessage[]
): Promise<string> {
  const lastFew = conversation.slice(-4)
  const convText = lastFew
    .map((m) => `${m.role === 'user' ? '用户' : '宠物'}：${m.content}`)
    .join('\n')

  const resp = await chatCompletion({
    _label: 'scene',
    model: MODEL,
    temperature: 0.8,
    messages: [
      {
        role: 'system',
        content: `根据对话内容，用15字以内的中文描述一个适合拍照的场景，描述宠物当前的状态或所在环境。只返回场景描述，不要解释。`,
      },
      { role: 'user', content: convText },
    ],
  })

  return resp.choices[0].message.content?.trim() || '静静地待着'
}
