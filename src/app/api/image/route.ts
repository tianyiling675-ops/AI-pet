import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateImage } from '@/lib/seedream'
import type { PetId } from '@/types'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ data: null, error: '未登录' }, { status: 401 })
  }

  try {
    const { petId, scene } = (await req.json()) as { petId: PetId; scene: string }

    if (!petId || !scene) {
      return NextResponse.json({ data: null, error: '缺少 petId 或 scene' }, { status: 400 })
    }

    const url = await generateImage(petId, scene)

    if (!url) {
      return NextResponse.json({ data: null, error: '图像生成失败' }, { status: 502 })
    }

    return NextResponse.json({ data: { url }, error: null })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ data: null, error: msg }, { status: 500 })
  }
}
