import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import '@radix-ui/themes/styles.css'
import { Theme } from '@radix-ui/themes'
import { Toaster } from '@/components/ui/sonner'
import { UserProfile } from '@/components/user-profile'


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Observo - 个人仪表盘',
  description: '个性化的 widgets 仪表盘，支持 Notion 集成'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProfile />
        {/* <Navigation /> */}
        <Theme>
          <main>{children}</main>
        </Theme>
        <Toaster />
      </body>
    </html>
  )
}
