import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import type { PetId } from '@/types'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user?.id) {
    return NextResponse.json({ data: null, error: '未登录' }, { status: 401 })
  }

  const petId = req.nextUrl.searchParams.get('petId') as PetId | null
  const supabase = createServiceClient()
  const userId = session.user.id

  const query = supabase
    .from('pet_states')
    .select('pet_id,affinity,mood,mood_emoji')
    .eq('user_id', userId)

  if (petId) query.eq('pet_id', petId)

  const { data, error } = await query
  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })

  return NextResponse.json({ data, error: null })
}
