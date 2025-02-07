import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { MoreHorizontal } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

export type ImageStyle = {
  _id: string
  label: string
}

const dummyStyles: ImageStyle[] = [
  {
    _id: 'style_a',
    label: 'Style A',
  },
  {
    _id: 'style_b',
    label: 'Style B',
  },
  {
    _id: 'style_c',
    label: 'Style C',
  },
  {
    _id: 'style_d',
    label: 'Style D',
  },
]

type Props = {
  onChange: (selectedStyles: ImageStyle[]) => void
}

const ImageStyleSelector = ({ onChange }: Props) => {
  const [selectedStyles, setSelectedStyles] = useState<ImageStyle[]>([])

  function toggleStyle(style: ImageStyle) {
    const isSelected = selectedStyles.some(s => s._id === style._id)
    setSelectedStyles(prevStyles => {
      const newStyles = isSelected
        ? prevStyles.filter(s => s._id !== style._id)
        : [...prevStyles, style]
      onChange(newStyles)
      return newStyles
    })
  }

  return (
    <div className="flex gap-2 px-4 py-3 items-center">
      {dummyStyles.map(style => (
        <Toggle
          key={style._id}
          variant="outline"
          aria-label={`Toggle ${style.label}`}
          value={style._id}
          className="whitespace-nowrap"
          size="sm"
          onClick={() => toggleStyle(style)}
        >
          {style.label}
        </Toggle>
      ))}
      <Button type="button" variant="outline" size="sm">
        <MoreHorizontal className="h-5 w-5" />
      </Button>
    </div>
  )
}

export default ImageStyleSelector
