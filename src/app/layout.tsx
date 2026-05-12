import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '宠物陪伴',
  description: '随时在线的陪伴',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
