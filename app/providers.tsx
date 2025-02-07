import { env } from '@/lib/config'
import { DailyLoginProvider } from '@/providers/daily-login-provider'
import { ReactQueryProvider } from '@/providers/react-query-provider'
import ReduxProvider from '@/providers/redux-provider'
import { TaskStatusProvider } from '@/providers/task-status-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { WebSocketProvider } from '@/providers/websocket-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { PropsWithChildren } from 'react'
import { ThirdwebProvider } from "thirdweb/react";
import { AuthProvider } from '@/contexts/auth-context'

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ThirdwebProvider>
        <AuthProvider>
          <ClerkProvider
            dynamic
          >
            <ReactQueryProvider>
              <WebSocketProvider
                endpoint={env.NEXT_PUBLIC_EDEN_COMPUTE_SOCKET_URL || ''}
              >
                <ReduxProvider>
                  <TaskStatusProvider>
                    <DailyLoginProvider>{children}</DailyLoginProvider>
                  </TaskStatusProvider>
                </ReduxProvider>
              </WebSocketProvider>
            </ReactQueryProvider>
          </ClerkProvider>
        </AuthProvider>
      </ThirdwebProvider>
    </ThemeProvider>
  )
}