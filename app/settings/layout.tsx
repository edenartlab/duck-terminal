import { PropsWithChildren } from 'react'
import SettingsLayout from '@/components/layout/settings-layout'

const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <SettingsLayout>
      {children}
    </SettingsLayout>
  )
}

export default PageLayout