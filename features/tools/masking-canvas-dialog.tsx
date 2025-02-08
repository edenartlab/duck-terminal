import { Button } from '@/components/ui/button'
import { DialogContentScrollable } from '@/components/ui/custom/dialog-content-scrollable'
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import MaskingCanvas from '@/features/tools/masking-canvas'
import { ToolParameterV2 } from '@edenlabs/eden-sdk'
import { PaintbrushIcon } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

type Props = {
  form: UseFormReturn
  parameter: ToolParameterV2
  onChange: (value: string) => void
}

export const MaskingCanvasDialog = ({ form, parameter, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOnChange = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button variant={'outline'} className="w-full">
          <PaintbrushIcon className="h-5 w-5 mr-2" />
          Draw a mask
        </Button>
      </DialogTrigger>
      <DialogContentScrollable className="p-4">
        <DialogTitle>Mask Painter: {parameter.name}</DialogTitle>
        <DialogDescription>Draw a masking image</DialogDescription>
        <MaskingCanvas
          form={form}
          inputImageFieldName={'image'}
          onChange={handleOnChange}
        />
      </DialogContentScrollable>
    </Dialog>
  )
}
