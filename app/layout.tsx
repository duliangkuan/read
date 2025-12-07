import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI辅助阅读',
  description: '个人AI辅助精读阅读工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}




