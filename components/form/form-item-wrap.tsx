import FormItemHead from '@/components/form/form-item-head'
import { FormControl, FormItem, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { PropsWithChildren } from 'react'

type Props = {
  name: string
  label: string
  description: string
  errorMessage?: string
  className?: string
} & PropsWithChildren

const FormItemWrap = ({
  name,
  label,
  description,
  errorMessage,
  className,
  children,
}: Props) => {
  return (
    <FormItem
      data-test-id={name}
      className={cn(['mt-0 !p-4 !pt-2', className])}
    >
      <FormItemHead label={label} description={description} />
      <FormControl id={name}>{children}</FormControl>
      <FormMessage>{errorMessage}</FormMessage>
    </FormItem>
  )
}

export default FormItemWrap
