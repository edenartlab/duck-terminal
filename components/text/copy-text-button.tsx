import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  title?: string
  text: string
  copyContent?: string
}

const CopyTextButton = ({ title, text, copyContent }: Props) => {
  const [copiedText, copy] = useCopyToClipboard()
  const [hasCopied, setHasCopied] = useState(false)

  const handleCopyString = (text: string, title?: string) => () => {
    copy(copyContent || text)
      .then(() => {
        setHasCopied(true)
        toast.info(`Copied ${title ? `"${title}"` : 'value'}`, {
          description:
            text && text.length > 120 ? `${text.substring(0, 120)}...` : text,
          dismissible: true,
          richColors: true,
        })
        setTimeout(() => setHasCopied(false), 2000)
        console.log('Copied!', { copiedText })
      })
      .catch(error => {
        toast.error(`Failed to copy!`, {
          description: error,
          dismissible: true,
          richColors: true,
        })
      })
  }

  return (
    <Button
      title="Copy"
      size="sm"
      variant="ghost"
      onClick={handleCopyString(text, title)}
    >
      {hasCopied ? (
        <CheckIcon className="h-3 w-3" />
      ) : (
        <CopyIcon className="h-3 w-3" />
      )}
    </Button>
  )
}

export default CopyTextButton
