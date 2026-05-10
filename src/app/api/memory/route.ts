import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import type { PetId, Memory } from '@/types'
import { extractMemory } from '@/lib/deepseek'
import type { ChatMessage } from '@/types'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ data: null, error: '未登录' }, { status: 401 })
  }

  const petId = req.nextUrl.searchParams.get('petId') as PetId
  if (!petId) {
    return NextResponse.json({ data: null, error: '缺少 petId' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const userId = session.user.id

  const [{ data: kvRows }, { data: diaryRows }] = await Promise.all([
    supabase.from('memories_kv').select('key,value').eq('user_id', userId).eq('pet_id', petId),
    supabase
      .from('memories_diary')
      .select('content,created_at')
      .eq('user_id', userId)
      .eq('pet_id', petId)
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const memory: Memory = {
    kv: kvRows || [],
    diary: diaryRows || [],
  }

  return NextResponse.json({ data: memory, error: null })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ data: null, error: '未登录' }, { status: 401 })
  }

  const { petId, conversation } = (await req.json()) as {
    petId: PetId
    conversation: ChatMessage[]
  }

  const { kv, diary } = await extractMemory(petId, conversation)

  const supabase = createServiceClient()
  const userId = session.user.id

  const upsertOps = Object.entries(kv).map(([key, value]) =>
    supabase
      .from('memories_kv')
      .upsert({ user_id: userId, pet_id: petId, key, value }, { onConflict: 'user_id,pet_id,key' })
  )

  const insertDiary =
    diary.trim()
      ? supabase.from('memories_diary').insert({ user_id: userId, pet_id: petId, content: diary })
      : Promise.resolve()

  await Promise.all([...upsertOps, insertDiary])

  return NextResponse.json({ data: null, error: null })
}
