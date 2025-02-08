import ToggleButton from '@/components/button/toggle-button'
import { ToggleGroup } from '@/components/ui/toggle-group'
import { usePrivacyToggle } from '@/hooks/use-privacy-toggle'
import { cn } from '@/lib/utils'
import { CreationV2, ModelV2 } from '@edenlabs/eden-sdk'
import { QueryKey } from '@tanstack/react-query'
import { useState } from 'react'

type Props = {
  type: 'creation' | 'model'
  item: ModelV2 | CreationV2
  queryKey: QueryKey
  className?: string
}

const PrivacyToggle = ({ type, item, queryKey, className }: Props) => {
  const { handleToggle } = usePrivacyToggle({ type, item, queryKey })
  const [isLoading, setIsLoading] = useState(false)

  const onToggle = () => {
    setIsLoading(true)

    handleToggle()

    setTimeout(() => {
      setIsLoading(false)
    }, 750)
  }

  return (
    <ToggleGroup
      type="single"
      value={item.public ? 'public' : 'private'}
      className={cn([
        'border-0 rounded-lg flex items-center justify-normal gap-0',
        className,
      ])}
      disabled={isLoading}
    >
      <ToggleButton
        value={'public'}
        label={'Public'}
        onClick={onToggle}
        disabled={item.public}
      />
      <ToggleButton
        value={'private'}
        label={'Private'}
        onClick={onToggle}
        disabled={!item.public}
      />
    </ToggleGroup>
  )
}

export default PrivacyToggle
