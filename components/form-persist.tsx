import useFormPersist from '@/hooks/use-form-persist'
import { ReactElement } from 'react'
import { FieldValues, UseFormReturn } from 'react-hook-form'

interface FormPersistProps<T extends FieldValues> {
  form: UseFormReturn<T>
  formKey: string
  defaultValues: unknown
  resetKey: number
}

const isBrowser = () => typeof window !== 'undefined'

export default function FormPersist<T extends FieldValues>(
  props: FormPersistProps<T>,
): ReactElement {
  // const lastResetKey = useRef(0)
  // const { form, formKey, defaultValues, resetKey } = props;
  const { form, formKey, defaultValues } = props

  useFormPersist(formKey, {
    control: form.control,
    setValue: form.setValue,
    storage: isBrowser() ? window.sessionStorage : undefined,
    defaultValues: defaultValues,
  })

  // useEffect(() => {
  //   console.log({resetKey, lastResetKey: lastResetKey.current})
  //   if (resetKey > lastResetKey.current) {
  //     lastResetKey.current = resetKey
  //     // clear()
  //   }
  // }, [clear, resetKey])

  return <></>
}
