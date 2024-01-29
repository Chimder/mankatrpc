import '@/styles/globals.css'

import { ReactElement, ReactNode, useState } from 'react'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { store } from '@/shared/Store/store'
import { trpc } from '@/shared/utils/trpc'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'

import Layout from '@/components/layout'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  const getLayout = Component.getLayout ?? (page => <Layout>{page}</Layout>)

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          {getLayout(<Component {...pageProps} />)}
          <ReactQueryDevtools initialIsOpen={false} />;
        </SessionProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default trpc.withTRPC(App)
