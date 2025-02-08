import { useFormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import * as React from 'react'

type Props = {} & React.TextareaHTMLAttributes<HTMLInputElement>

export const TextInput = (props: Props) => {
  const { formItemId } = useFormField()

  return <Input {...props} type="text" id={formItemId} />
}
