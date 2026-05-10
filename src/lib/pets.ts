import type { PetConfig, PetId } from '@/types'

export type AffinityLevelEn = 'low' | 'medium' | 'high'

export interface PetCopy {
  type: string
  cta: string
  statusByAffinity: Record<AffinityLevelEn, string>
  quotes: readonly string[]
  emptyDiary: string
}

export const petCopyMap: Record<PetId, PetCopy> = {
  ping_an: {
    type: '猫',
    cta: '去找平安聊聊',
    statusByAffinity: {
      low:    '趴在远一点的地方',
      medium: '窝在桌边',
      high:   '轻轻靠了过来',
    },
    quotes: [
      '（沉默了一会儿）嗯。',
      '（蹭了蹭你的手）你回来了。',
      '你烦的时候耳朵会动。',
      '（眯了眯眼睛）……知道了。',
      '你说吧，我听着。',
      '（轻轻搭上来）上次你也这么说。后来你办到了。',
      '……不用说话也没关系。',
      '（挪近了一点）你叹气的声音比平时轻。',
      '嗯。在呢。',
      '（看着你）你今天不太一样。',
      '……去哪了。回来了就好。',
      '有什么事就说。',
    ],
    emptyDiary: '还没聊过什么，它在等你。',
  },
  mo: {
    type: '边牧',
    cta: '坐到默旁边',
    statusByAffinity: {
      low:    '安静地坐着',
      medium: '看着窗外',
      high:   '把那块石头放近了一点',
    },
    quotes: [
      '我在想，影子是不是也有自己的影子。',
      '你有没有想过，时间是从哪个方向流的？',
      '……也许吧。',
      '我去外面坐了一会儿。风很大。',
      '不知道为什么，但我觉得今天不太一样。',
      '你有没有见过两片完全一样的叶子？',
      '……我在想一件事。你陪我想一会儿可以吗？',
      '沉默也是一种回答。',
      '你刚才叹气的声音，比平时轻一点。怎么了？',
      '我在想，如果把所有记忆都忘掉，剩下的还算是你吗？',
      '有些事不需要解释，待着就好。',
      '……风把什么东西带走了。我不确定是什么。',
    ],
    emptyDiary: '还没聊过什么，它在想一个问题。',
  },
  chi: {
    type: '幼龙',
    cta: '听赤汇报',
    statusByAffinity: {
      low:    '正在练习喷火',
      medium: '举着小石子等你看',
      high:   '把龙珠雏形藏在爪下',
    },
    quotes: [
      '待本龙长大，必将……先算了，今天的训练还没做完。',
      '此事，本龙记下了。',
      '哼，不过是小场面。',
      '……那个，你最近还好吗？本龙只是随口问问。',
      '本龙今日喷火训练有所突破！虽然只是一点火星，但方向是对的！',
      '待本龙长大之后，就不需要你帮忙了。现在嘛……',
      '你笑什么！本龙只是还没长开！',
      '……本龙有个问题，但不是很重要的那种问题。',
      '今日遭遇重大挫折，然而本龙毫不在意。',
      '……那个。谢谢你还在。',
      '哼！本龙不需要安慰！……但如果你要说，本龙可以听一听。',
      '今天的蚂蚁又没被吓到。下次一定。',
    ],
    emptyDiary: '还没聊过什么，它在练习喷火。',
  },
  hawk: {
    type: '无名',
    cta: '看看鹰是否还在',
    statusByAffinity: {
      low:    '不在窗台上',
      medium: '刚回来',
      high:   '留下了一根羽毛',
    },
    quotes: [
      '看见了。',
      '浪费。',
      '随你。',
      '飞了一圈。',
      '……',
      '不必。',
      '有意思。',
      '还在。',
      '风向变了。',
      '你来了。',
      '不用解释。',
      '留着吧。',
    ],
    emptyDiary: '还没聊过什么，它不知道在不在。',
  },
} as const

export const PETS: Record<PetId, PetConfig> = {
  ping_an: { id: 'ping_an', name: '平安', species: '橘猫', emoji: '🐱' },
  mo:      { id: 'mo',      name: '默',   species: '边境牧羊犬', emoji: '🐕' },
  chi:     { id: 'chi',     name: '赤',   species: '幼龙', emoji: '🐉' },
  hawk:    { id: 'hawk',    name: '鹰',   species: '鹰', emoji: '🦅' },
}

export const PET_IDS = Object.keys(PETS) as PetId[]

export function affinityToLevel(affinity: number): '低' | '中' | '高' {
  if (affinity < 40) return '低'
  if (affinity < 70) return '中'
  return '高'
}

export function affinityToLevelEn(affinity: number): 'low' | 'medium' | 'high' {
  if (affinity < 40) return 'low'
  if (affinity < 70) return 'medium'
  return 'high'
}
