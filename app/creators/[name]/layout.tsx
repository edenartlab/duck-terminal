import DefaultLayout from '@/components/layout/default-layout'
import { PropsWithChildren } from 'react'

const PageLayout = async ({ children }: PropsWithChildren) => {
  return <DefaultLayout>{children}</DefaultLayout>
}

export default PageLayout
