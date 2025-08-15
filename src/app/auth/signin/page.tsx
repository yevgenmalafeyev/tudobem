'use client'

import { getProviders, signIn, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Logo from "@/components/Logo"

interface Provider {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // Try NextAuth providers first
        const nextAuthProviders = await getProviders()
        
        // Also check our custom provider status endpoint as fallback
        const customResponse = await fetch('/api/auth/provider-status')
        const customProviders = await customResponse.json()
        
        console.log('NextAuth providers:', nextAuthProviders)
        console.log('Custom providers check:', customProviders)
        
        // If NextAuth has providers, use them
        if (nextAuthProviders && Object.keys(nextAuthProviders).length > 0) {
          setProviders(nextAuthProviders)
        } else if (customProviders.google) {
          // Fallback: create Google provider manually if custom check says it's available
          const googleProvider = {
            id: 'google',
            name: 'Google',
            type: 'oauth',
            signinUrl: '/api/auth/signin/google',
            callbackUrl: '/api/auth/callback/google'
          }
          setProviders({ google: googleProvider })
          console.log('Using fallback Google provider configuration')
        } else {
          setProviders(null)
        }
      } catch (error) {
        console.error('Error fetching providers:', error)
        setProviders(null)
      } finally {
        setLoading(false)
      }
    }

    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push('/')
      }
    }

    checkSession()
    fetchProviders()
  }, [router])

  const handleSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl: '/' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--neo-bg)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p style={{ color: 'var(--neo-text)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--neo-bg)' }}>
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8" style={{ background: 'var(--neo-card-bg)', border: '1px solid var(--neo-border)' }}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo className="w-16 h-16" />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--neo-text)' }}>
              Sign in to Tudobem
            </h1>
            <p className="text-gray-600" style={{ color: 'var(--neo-text-secondary)' }}>
              Continue your Portuguese learning journey
            </p>
          </div>

          <div className="space-y-4">
            {providers && Object.keys(providers).length > 0 ? (
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => handleSignIn(provider.id)}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  style={{
                    borderColor: 'var(--neo-border)',
                    backgroundColor: 'var(--neo-bg)',
                    color: 'var(--neo-text)'
                  }}
                >
                  {provider.id === 'google' && (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Continue with {provider.name}
                </button>
              ))
            ) : (
              <div className="text-center p-6 border-2 border-dashed rounded-lg" style={{ borderColor: 'var(--neo-border)', color: 'var(--neo-text-secondary)' }}>
                <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                  Social Login Temporarily Unavailable
                </h3>
                <p className="text-sm">
                  OAuth providers are not currently configured. Please contact support or use alternative login methods.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-green-600 hover:text-green-500 underline"
              style={{ color: 'var(--neo-accent)' }}
            >
              Continue without signing in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}