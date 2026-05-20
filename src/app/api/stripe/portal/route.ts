import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', session.user.id)
    .single()

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: '无订阅记录' }, { status: 400 })
  }

  const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${baseUrl}/`,
  })

  return NextResponse.json({ url: portalSession.url })
}
