import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: [
    'https://rememberme.icu',
    'https://www.rememberme.icu',
    'http://localhost:3000',
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: 'noreply@rememberme.icu',
        to: user.email,
        subject: '重置你的密码',
        html: `<p>你好，</p><p>点击下方链接重置密码：</p><p><a href="${url}">${url}</a></p><p>链接 1 小时内有效，如非本人操作请忽略。</p>`,
      })
      if (error) console.error('[Resend] 重置密码邮件发送失败:', error)
      else console.log('[Resend] 重置密码邮件已发送 →', user.email)
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const { data, error } = await resend.emails.send({
        from: 'noreply@rememberme.icu',
        to: user.email,
        subject: '验证你的邮箱',
        html: `<p>你好，</p><p>点击下方链接完成邮箱验证：</p><p><a href="${url}">${url}</a></p><p>链接 1 小时内有效。</p>`,
      })
      if (error) console.error('[Resend] 发送失败:', error)
      else console.log('[Resend] 发送成功, id:', data?.id, '→', user.email)
    },
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  user: { modelName: 'ba_user' },
  session: { modelName: 'ba_session' },
  account: { modelName: 'ba_account' },
  verification: { modelName: 'ba_verification' },
})
