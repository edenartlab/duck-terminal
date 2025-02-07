import DefaultLayout from '@/components/layout/default-layout'
import SettingsNav from '@/components/navigation/settings-nav'
import { PropsWithChildren } from 'react'

const SettingsLayout = ({ children }: PropsWithChildren) => {
  return (
    <DefaultLayout>
      <div data-testid="content" className="flex-grow">
        <div className="mx-auto grid w-full max-w-6xl gap-2 mb-4">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid gap-6 w-full max-w-6xl items-start md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsNav />
          <div className="grid gap-6">{children}</div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default SettingsLayout
