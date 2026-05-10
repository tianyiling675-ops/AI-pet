import type { PetConfig, PetId } from '@/types'

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
