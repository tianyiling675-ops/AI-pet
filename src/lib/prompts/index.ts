import type { PetId, Memory } from '@/types'
import { buildPingAnPrompt } from './ping_an'
import { buildMoPrompt } from './mo'
import { buildChiPrompt } from './chi'
import { buildHawkPrompt } from './hawk'

export const CRISIS_RESPONSE = `（停顿）

你说的这句话，我认真听到了。

如果你现在很难受，可以拨打：
北京心理危机研究与干预中心：010-82951332
全国心理援助热线：400-161-9995

我在这里。`

export function buildSystemPrompt(
  petId: PetId,
  affinity: number,
  memory: Memory
): string {
  switch (petId) {
    case 'ping_an': return buildPingAnPrompt(affinity, memory)
    case 'mo':      return buildMoPrompt(affinity, memory)
    case 'chi':     return buildChiPrompt(affinity, memory)
    case 'hawk':    return buildHawkPrompt(affinity, memory)
  }
}
