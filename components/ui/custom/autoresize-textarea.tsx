// components/AutosizeTextarea.tsx
'use client'

import { useFormField } from '@/components/ui/form'
import { useAutosizeTextArea } from '@/hooks/use-auto-resize-textarea'
import { cn } from '@/lib/utils'
import * as React from 'react'
import { useImperativeHandle } from 'react'

// components/AutosizeTextarea.tsx

// components/AutosizeTextarea.tsx

// Adjust the import path as needed

export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement
  focus: () => void
  maxHeight: number
  minHeight: number
}

type AutosizeTextAreaProps = {
  maxHeight?: number
  minHeight?: number
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const AutosizeTextarea = React.forwardRef<
  AutosizeTextAreaRef,
  AutosizeTextAreaProps
>(
  (
    {
      maxHeight = Number.MAX_SAFE_INTEGER,
      minHeight = 52,
      className,
      onChange,
      value,
      ...props
    }: AutosizeTextAreaProps,
    ref: React.Ref<AutosizeTextAreaRef>,
  ) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null)
    const [triggerAutoSize, setTriggerAutoSize] = React.useState<string>('')
    const { formItemId } = useFormField()

    useAutosizeTextArea({
      textAreaRef: textAreaRef.current,
      triggerAutoSize,
      maxHeight,
      minHeight,
    })

    useImperativeHandle(ref, () => ({
      textArea: textAreaRef.current as HTMLTextAreaElement,
      focus: () => textAreaRef.current?.focus(),
      maxHeight,
      minHeight,
    }))

    React.useEffect(() => {
      // Trigger autosize when the component mounts and whenever the value changes
      if (value) {
        setTriggerAutoSize(value as string)
      } else {
        setTriggerAutoSize('')
      }
    }, [value])

    return (
      <textarea
        {...props}
        id={formItemId}
        value={value}
        ref={textAreaRef}
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        onChange={e => {
          setTriggerAutoSize(e.target.value)
          onChange?.(e)
        }}
      />
    )
  },
)
AutosizeTextarea.displayName = 'AutosizeTextarea'
