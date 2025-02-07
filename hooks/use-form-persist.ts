// custom implementation of react-hook-form-persist for easier integration and better perf
// https://github.com/nucleuscloud/neosync/blob/main/frontend/apps/web/app/(mgmt)/useFormPersist.tsx
import { useEffect } from 'react'
import { Control, SetFieldValue, useWatch } from 'react-hook-form'

interface FormPersistConfig {
  storage?: Storage
  control: Control<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  setValue: SetFieldValue<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  exclude?: string[]
  onDataRestored?: (data: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
  validate?: boolean
  dirty?: boolean
  touch?: boolean
  onTimeout?: () => void
  timeout?: number
  defaultValues?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface UseFormPersistResult {
  clear(): void
}

// I copied this from the original react-hook-form-persist npm module so that we could take advantage of the useWatch() hook
// This also lets use nest it in the component tree instead of being a pure hook.
// This allows us to persist values without triggering a wholesale re-render of the entire component hierarchy
export default function useFormPersist(
  name: string,
  {
    storage,
    control,
    setValue,
    exclude = [],
    onDataRestored,
    validate = false,
    dirty = false,
    touch = false,
    onTimeout,
    timeout,
    defaultValues,
  }: FormPersistConfig,
): UseFormPersistResult {
  const watchedValues = useWatch({
    defaultValue: defaultValues,
    control,
  })

  const getStorage = () => storage || window.sessionStorage

  const clearStorage = () => getStorage().removeItem(name)

  useEffect(() => {
    console.log('useEffect triggered') // Checks when the useEffect runs
    const str = getStorage().getItem(name)
    console.log(
      `Values in storage for key ${name}:`,
      str ? JSON.parse(str || '') : '',
    ) // Checks what is in storage before parsing

    const parsed = str ? JSON.parse(str) : defaultValues
    console.log('Parsed values OR defaultValues:', { parsed, defaultValues })
    if (parsed) {
      const { _timestamp = null, ...values } = parsed
      const dataRestored: { [key: string]: any } = {} // eslint-disable-line @typescript-eslint/no-explicit-any
      const currTimestamp = Date.now()

      if (timeout && currTimestamp - _timestamp > timeout) {
        onTimeout && onTimeout()
        clearStorage()
        return
      }

      Object.keys(values).forEach(key => {
        const shouldSet = !exclude.includes(key)
        if (shouldSet) {
          dataRestored[key] = values[key]
          setValue(key, values[key], {
            shouldValidate: validate,
            shouldDirty: dirty,
            shouldTouch: touch,
          })
        }
      })

      if (onDataRestored) {
        console.log('onDataRestored', dataRestored)
        onDataRestored(dataRestored)
      }
    }
  }, [storage, name, onDataRestored, setValue, defaultValues])

  useEffect(() => {
    const values: Record<string, unknown> = exclude.length
      ? Object.entries(watchedValues)
          .filter(([key]) => !exclude.includes(key))
          .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
      : Object.assign({}, watchedValues)

    if (Object.entries(values).length) {
      if (timeout !== undefined) {
        values._timestamp = Date.now()
      }
      console.log('!setting values', { values, watchedValues, defaultValues })
      getStorage().setItem(name, JSON.stringify(values))
    }
  }, [watchedValues, timeout])

  return {
    clear: () => {
      console.log('!clearing')
      return getStorage().removeItem(name)
    },
  }
}
