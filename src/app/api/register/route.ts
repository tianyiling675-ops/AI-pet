import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createServiceClient } from '@/lib/supabase'
import { PET_IDS } from '@/lib/pets'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ data: null, error: '邮箱和密码（至少6位）不能为空' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    return NextResponse.json({ data: null, error: '该邮箱已注册' }, { status: 409 })
  }

  const password_hash = await bcrypt.hash(password, 12)
  const { data: user, error } = await supabase
    .from('users')
    .insert({ email, password_hash })
    .select('id')
    .single()

  if (error || !user) {
    return NextResponse.json({ data: null, error: '注册失败，请稍后重试' }, { status: 500 })
  }

  // 初始化四只宠物状态
  await supabase.from('pet_states').insert(
    PET_IDS.map((pet_id) => ({
      user_id: user.id,
      pet_id,
      affinity: 50,
      mood: '平静',
      mood_emoji: '😌',
    }))
  )

  return NextResponse.json({ data: { id: user.id }, error: null })
}
