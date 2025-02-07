import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

function useLocalStorage<T>(key: string, defaultValue?: T) {
  const queryKey = useMemo(() => ['local-storage', key], [key])

  const queryClient = useQueryClient()

  const query = useQuery<T>({
    queryKey,
    queryFn: () => {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    },
    retry: false,
  })

  const setValue = useCallback(
    (value: T) => {
      localStorage.setItem(key, JSON.stringify(value))
      queryClient.setQueryData(queryKey, value)
    },
    [key, queryClient, queryKey],
  )

  return [query, setValue] as const
}

export default useLocalStorage
