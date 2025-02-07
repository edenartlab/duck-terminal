// import SearchForm from '@/components/form/search-form'
import TaskStatusIndicator from '@/components/alert/task-status-indicator'
import DiscordBanner from '@/components/discord-banner'
import ErrorBoundary from '@/components/error-boundary'
import MannaBalance from '@/components/header/manna-balance'
import LoadingIndicator from '@/components/loading-indicator'
import HeaderNav from '@/components/navigation/header-nav'
import MyAccountButton from '@/components/navigation/my-account-button'
import { Separator } from '@/components/ui/separator'
import { Suspense } from 'react'
import ActiveChainIcon from '@/components/thirdweb/chain-icon'
import DuckBalance from '@/components/duck/duck-balance'


const Header = () => {
  return (
    <>
      <DiscordBanner />
      <header className="sticky z-50 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex-grow">
          <HeaderNav />
        </div>
        <div className="ml-auto flex items-center gap-2 h-10">
          <Suspense fallback={<LoadingIndicator />}>
            <ErrorBoundary>
              <TaskStatusIndicator />
            </ErrorBoundary>
          </Suspense>
          <Suspense fallback={<LoadingIndicator />}>
            <MannaBalance />
          </Suspense>
          <Suspense fallback={<LoadingIndicator />}>
            <ActiveChainIcon />
          </Suspense>
          <Suspense fallback={<LoadingIndicator />}>
            <DuckBalance />
          </Suspense>
          <Separator orientation="vertical" className="ml-1 mr-2" />
          <MyAccountButton />
        </div>
      </header>
    </>
  )
}

export default Header
