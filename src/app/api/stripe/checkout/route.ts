import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { stripe, STRIPE_PRICE_ID } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const userId = session.user.id

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()

  let customerId = sub?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email ?? undefined,
      metadata: { userId },
    })
    customerId = customer.id
    await supabase.from('subscriptions').upsert({ user_id: userId, stripe_customer_id: customerId, status: 'free' })
  }

  const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${baseUrl}/?subscribed=1`,
    cancel_url: `${baseUrl}/`,
    subscription_data: { metadata: { userId } },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
