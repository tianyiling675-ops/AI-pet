import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { PET_IDS, petCopyMap, affinityToLevelEn } from '@/lib/pets'
import { pickQuotesForAllPets } from '@/lib/pets.server'
import PetSelectClient from '@/components/pet/PetSelectClient'
import type { PetId, PetHomeData } from '@/types'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const userId = session.user.id
  const userEmail = session.user.email ?? ''
  const supabase = createServiceClient()

  const [{ data: stateRows }, { data: diaryRows }] = await Promise.all([
    supabase
      .from('pet_states')
      .select('pet_id, affinity, mood, mood_emoji')
      .eq('user_id', userId),
    supabase
      .from('memories_diary')
      .select('pet_id, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(12),
  ])

  const quotes = pickQuotesForAllPets()

  const diaryByPet: Record<string, string[]> = {}
  for (const row of diaryRows ?? []) {
    if (!diaryByPet[row.pet_id]) diaryByPet[row.pet_id] = []
    if (diaryByPet[row.pet_id].length < 3) {
      diaryByPet[row.pet_id].push(row.content)
    }
  }

  const stateMap = Object.fromEntries(
    (stateRows ?? []).map((s) => [s.pet_id, s])
  )

  const petsData: PetHomeData[] = PET_IDS.map((petId: PetId) => {
    const state = stateMap[petId]
    const affinity: number = state?.affinity ?? 50
    const level = affinityToLevelEn(affinity)
    return {
      petId,
      affinity,
      mood: state?.mood ?? '平静',
      moodEmoji: state?.mood_emoji ?? '😌',
      status: petCopyMap[petId].statusByAffinity[level],
      quote: quotes[petId],
      diary: diaryByPet[petId] ?? [],
    }
  })

  return <PetSelectClient petsData={petsData} userEmail={userEmail} />
}
