'use client'

import { MasonrySkeleton } from '@/components/masonry/masonry-virtualizer-vertical'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Filter } from '@/features/feed/filter'
import { FeedCursorRouteQueryParams } from '@edenlabs/eden-sdk'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
  useState,
} from 'react'

export type FilterOption = {
  label: string
  value: string
  icon?: ReactNode
  query: FeedCursorRouteQueryParams['filter']
}

export type RouterTab = {
  key: string
  title: string
  content: ReactElement
  filterOptions?: FilterOption[]
}

type Props = {
  tabs: RouterTab[]
  globalFilterOptions?: FilterOption[]
  baseQuery?: FeedCursorRouteQueryParams['filter']
}

const RouterTabs = ({ tabs, globalFilterOptions, baseQuery }: Props) => {
  const defaultTabName = tabs[0].key

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = searchParams.get('tab') || defaultTabName
  const [activeTab, setActiveTab] = useState(initialTab)

  // Cache for storing content and prevent unnecessary re-fetching
  const [cachedTabContents, setCachedTabContents] = useState<{
    [key: string]: ReactElement
  }>({})

  // Filters management
  const [globalFilterQuery, setGlobalFilterQuery] = useState<
    FeedCursorRouteQueryParams['filter'] | undefined
  >(globalFilterOptions ? globalFilterOptions[0].query : baseQuery)
  const [tabFilterQuery, setTabFilterQuery] = useState<
    FeedCursorRouteQueryParams['filter'] | undefined
  >(
    tabs.find(tab => tab.key === initialTab)?.filterOptions?.[0].query ||
      baseQuery,
  )

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Update router URL for tab change without triggering content rerender yet
    router.push(`${pathname}${value === defaultTabName ? '' : `?tab=${value}`}`)

    // Set tab-specific filter query only if new tab has filterOptions
    const activeTabObj = tabs.find(tab => tab.key === value)
    if (activeTabObj?.filterOptions) {
      setTabFilterQuery(activeTabObj.filterOptions[0].query)
    } else {
      setTabFilterQuery(undefined) // Set to undefined for tabs without specific filters
    }
  }

  const handleGlobalFilterChange = (
    filter: FeedCursorRouteQueryParams['filter'],
  ) => {
    setGlobalFilterQuery(filter)

    // Invalidate cache for all tabs since the global filter changed
    setCachedTabContents({})
  }

  const handleTabFilterChange = (
    filter: FeedCursorRouteQueryParams['filter'],
  ) => {
    setTabFilterQuery(filter)

    // Invalidate cache for active tab since the tab-specific filter changed
    setCachedTabContents(prevCache => {
      const updatedCache = { ...prevCache }
      delete updatedCache[activeTab]
      return updatedCache
    })
  }

  useEffect(() => {
    // Ensure that caching occurs only when filters are fully ready and content is rendered
    const tab = tabs.find(t => t.key === activeTab)
    if (tab) {
      const updatedQuery = { ...globalFilterQuery, ...tabFilterQuery }

      if (!cachedTabContents[activeTab]) {
        setCachedTabContents(prevCache => ({
          ...prevCache,
          [activeTab]: cloneElement(tab.content, { query: updatedQuery }),
        }))
      }
    }
  }, [activeTab, globalFilterQuery, tabFilterQuery, tabs])

  useEffect(() => {
    // Update activeTab when search params change (e.g., external navigation)
    setActiveTab(initialTab)
  }, [initialTab])

  return (
    <Tabs
      value={activeTab}
      defaultValue={defaultTabName}
      onValueChange={handleTabChange}
      className="w-full max-w-full"
    >
      <div className="flex flex-col xs:flex-row gap-4 w-full mb-4">
        <TabsList className="flex justify-stretch min-w-[328px] w-full md:w-auto md:min-w-[420px]">
          {tabs.map(tab => (
            <TabsTrigger key={tab.key} value={tab.key} className="w-full">
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {globalFilterOptions ? (
          <div className="flex gap-4 ml-auto xs:ml-0">
            <Separator orientation="vertical" className="hidden xs:block" />
            <Filter
              options={globalFilterOptions.map(({ label, icon, query }) => ({
                label,
                icon,
                value: query, // Directly use the query object for global filter
              }))}
              onChange={handleGlobalFilterChange}
            />
          </div>
        ) : null}

        {tabs.find(tab => tab.key === activeTab)?.filterOptions ? (
          <div className="flex gap-4 ml-auto xs:ml-0">
            <Separator orientation="vertical" className="hidden xs:block" />
            <Filter
              options={tabs
                .find(tab => tab.key === activeTab)!
                .filterOptions!.map(({ label, icon, query }) => ({
                  label,
                  icon,
                  value: query, // Directly use the query object for tab-specific filter
                }))}
              onChange={handleTabFilterChange}
            />
          </div>
        ) : null}
      </div>

      {tabs.map(tab => (
        <TabsContent key={tab.key} value={tab.key}>
          {cachedTabContents[tab.key] ? (
            // Render cached content if available
            cachedTabContents[tab.key]
          ) : (
            // Show loading indicator until the content is properly cached
            <MasonrySkeleton />
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default RouterTabs
