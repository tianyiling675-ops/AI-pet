import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { PETS } from '@/lib/pets'
import PetGrid from '@/components/pet/PetGrid'
import type { PetState } from '@/types'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const supabase = createServiceClient()
  const { data: states } = await supabase
    .from('pet_states')
    .select('pet_id,affinity,mood,mood_emoji')
    .eq('user_id', session.user.id)

  const petStates: PetState[] = states || []

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      <header className="px-6 pt-12 pb-6">
        <p className="text-xs text-gray-400">随时在线</p>
        <h1 className="text-2xl font-medium text-gray-800 mt-1">你的陪伴</h1>
      </header>
      <main className="flex-1 px-6">
        <PetGrid pets={PETS} states={petStates} />
      </main>
    </div>
  )
}
