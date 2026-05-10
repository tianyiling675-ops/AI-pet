import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { PETS, PET_IDS } from '@/lib/pets'
import { createServiceClient } from '@/lib/supabase'
import ChatClient from '@/components/chat/ChatClient'
import type { PetId } from '@/types'

interface Props {
  params: { petId: string }
}

export default async function ChatPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  if (!PET_IDS.includes(params.petId as PetId)) notFound()

  const petId = params.petId as PetId
  const pet = PETS[petId]

  const supabase = createServiceClient()
  const { data: state } = await supabase
    .from('pet_states')
    .select('affinity,mood,mood_emoji')
    .eq('user_id', session.user.id)
    .eq('pet_id', petId)
    .single()

  return (
    <ChatClient
      pet={pet}
      initialMood={state?.mood || '平静'}
      initialMoodEmoji={state?.mood_emoji || '😌'}
    />
  )
}
