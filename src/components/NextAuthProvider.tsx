'use client'

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface NextAuthProviderProps {
  children: ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session?: any
}

export default function NextAuthProvider({ children, session }: NextAuthProviderProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}