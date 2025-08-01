'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthUIProvider } from '@daveyplate/better-auth-ui'
import { authClient } from '@/lib/auth-client'
import { Toaster } from 'sonner'
import { Messages, type Locale } from 'next-intl'
import { NextIntlClientProvider } from 'next-intl'

interface IProps {
  children: React.ReactNode
  locale: Locale
  messages: Messages
}
export function Providers({ children, locale, messages }: IProps) {
  const router = useRouter()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthUIProvider
        authClient={authClient}
        navigate={router.push}
        replace={router.replace}
        onSessionChange={() => router.refresh()}
        Link={Link}
        localization={messages.auth}
        changeEmail={false}
      >
        {children}
        <Toaster position="top-center" />
      </AuthUIProvider>
    </NextIntlClientProvider>
  )
}
