import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MinusIcon, PlusIcon } from 'lucide-react'
import React, { ChangeEvent, useEffect, useState } from 'react'

type Props = {
  minLength: number
  maxLength: number
  onChange: (newVal: string[] | undefined) => void
  value: string[]
}

function StringArrayInput({
  onChange,
  minLength,
  maxLength,
  value = [],
}: Props): React.ReactElement {
  // Added a validator to make sure incoming prop value length is within min and max length
  const initialFields =
    value.length >= minLength && value.length <= maxLength ? value : ['']
  const [fields, setFields] = useState(initialFields)

  useEffect(() => {
    // Assign incoming prop directly to state setter inside useEffect to maintain state persistence across renders.
    setFields(value)
  }, [value])

  // console.log({ fields, value, initialFields })
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newFields = fields.map((f, i) => (i === index ? e.target.value : f))
    setFields(newFields)

    // Check if all the fields are empty. If so, set value to `[]`.
    const isEmpty = newFields.every(field => field.trim() === '')
    onChange(isEmpty ? undefined : newFields)
  }

  const handleRemoveClick = (indexToRemove: number) => {
    // Allow removal if it would not breach minLength condition or if all the fields are empty.
    if (
      fields.length > minLength ||
      fields.every(field => field.trim() === '')
    ) {
      const newFields = fields.filter((_, index) => index !== indexToRemove)
      setFields(newFields)

      // Check if all the fields are empty. If so, set value to `[]`.
      const isEmpty = newFields.every(field => field.trim() === '')
      onChange(isEmpty ? undefined : newFields)
    }
  }

  const handleAddClick = () => {
    setFields(fields => [...fields, ''])
  }

  return (
    <>
      {fields?.map((fieldValue, index) => (
        <div key={index.toString()} className="flex items-center space-x-2">
          <Input
            type="text"
            value={fieldValue}
            onChange={e => handleInputChange(e, index)}
          />
          {fields.length > minLength ? (
            <Button
              onClick={() => handleRemoveClick(index)}
              size="sm"
              variant="outline"
              type="button"
              className="flex gap-1 items-center"
            >
              <MinusIcon className="bg-popover/50 h-4 w-4" />
            </Button>
          ) : null}
        </div>
      ))}
      {fields.length <= maxLength ? (
        <Button
          onClick={handleAddClick}
          size="sm"
          variant="outline"
          type="button"
          className="flex gap-1 items-center"
        >
          <PlusIcon className="h-4 w-4" />
          Add Row
        </Button>
      ) : null}
    </>
  )
}

export default StringArrayInput
