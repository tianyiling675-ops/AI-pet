import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import { NextRequest } from 'next/server'

const handler = toNextJsHandler(auth)

export async function GET(req: NextRequest) {
  try {
    return await handler.GET(req)
  } catch (err) {
    console.error('[better-auth] GET error:', err)
    throw err
  }
}

export async function POST(req: NextRequest) {
  try {
    return await handler.POST(req)
  } catch (err) {
    console.error('[better-auth] POST error:', err)
    throw err
  }
}
