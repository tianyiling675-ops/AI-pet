import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { PETS, PET_IDS, petCopyMap, affinityToLevelEn } from '@/lib/pets'
import { createServiceClient } from '@/lib/supabase'
import ChatClient from '@/components/chat/ChatClient'
import type { PetId } from '@/types'

interface Props {
  params: { petId: string }
}

export default async function ChatPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session?.user?.id) redirect('/login')

  if (!PET_IDS.includes(params.petId as PetId)) notFound()

  const petId = params.petId as PetId
  const pet = PETS[petId]
  const userId = session.user.id
  const supabase = createServiceClient()

  const [{ data: state }, { data: historyRows }, { data: diaryRows }, { data: momentRows }] = await Promise.all([
    supabase
      .from('pet_states')
      .select('affinity,mood,mood_emoji')
      .eq('user_id', userId)
      .eq('pet_id', petId)
      .single(),
    supabase
      .from('chat_messages')
      .select('role,content,created_at')
      .eq('user_id', userId)
      .eq('pet_id', petId)
      .order('created_at', { ascending: true }),
    supabase
      .from('memories_diary')
      .select('content')
      .eq('user_id', userId)
      .eq('pet_id', petId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('pet_moments')
      .select('image_url')
      .eq('user_id', userId)
      .eq('pet_id', petId)
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const affinity = state?.affinity ?? 50
  const initialStatus = petCopyMap[petId].statusByAffinity[affinityToLevelEn(affinity)]

  const initialMessages = (historyRows ?? []).map((row) => ({
    role: row.role as 'user' | 'assistant',
    content: row.content,
    createdAt: row.created_at as string,
  }))

  return (
    <ChatClient
      pet={pet}
      initialMood={state?.mood ?? '平静'}
      initialMoodEmoji={state?.mood_emoji ?? '😌'}
      initialStatus={initialStatus}
      initialMessages={initialMessages}
      initialMemories={(diaryRows ?? []).map((r) => r.content)}
      initialMoments={(momentRows ?? []).map((r) => r.image_url)}
    />
  )
}
