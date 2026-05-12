export type PetId = 'ping_an' | 'mo' | 'chi' | 'hawk'

export type AffinityLevel = 'low' | 'medium' | 'high'

export interface PetConfig {
  id: PetId
  name: string
  species: string
  emoji: string
}

export interface PetState {
  pet_id: PetId
  affinity: number
  mood: string
  mood_emoji: string
}

export interface MemoryKV {
  key: string
  value: string
}

export interface MemoryDiary {
  content: string
  created_at: string
}

export interface Memory {
  kv: MemoryKV[]
  diary: MemoryDiary[]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  createdAt?: string
}

export interface ClassifyResult {
  is_crisis: boolean
  should_generate_image: boolean
}

export interface ChatApiRequest {
  petId: PetId
  message: string
  history: ChatMessage[]
}

export interface ChatApiResponse {
  reply: string
  imageUrl?: string
  affinityDelta: number
  mood: string
  mood_emoji: string
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PetHomeData {
  petId: PetId
  affinity: number
  mood: string
  moodEmoji: string
  status: string
  quote: string
  diary: string[]
  moments: string[]
}
