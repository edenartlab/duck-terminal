'use client'

import { CreationV2 } from '@edenlabs/eden-sdk'
import React, { ReactNode, createContext, useContext, useState } from 'react'

interface MultiSelectContextProps {
  selectedItems: CreationV2[]
  toggleSelection: (item: CreationV2) => void
  isSelected: (item: CreationV2) => boolean
  clearSelection: () => void
}

const MultiSelectContext = createContext<MultiSelectContextProps | undefined>(
  undefined,
)

export const useMultiSelection = (): MultiSelectContextProps => {
  const context = useContext(MultiSelectContext)
  if (!context) {
    throw new Error(
      'useMultiSelection must be used within a MultiSelectProvider',
    )
  }
  return context
}

interface MultiSelectProviderProps {
  children: ReactNode
}

export const MultiSelectProvider: React.FC<MultiSelectProviderProps> = ({
  children,
}) => {
  const [selectedItems, setSelectedItems] = useState<CreationV2[]>([])

  const toggleSelection = (item: CreationV2) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i._id === item._id)
      if (exists) {
        return prev.filter(i => i._id !== item._id)
      } else {
        return [...prev, item]
      }
    })
  }

  const isSelected = (item: CreationV2) => {
    return selectedItems.some(i => i._id === item._id)
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  return (
    <MultiSelectContext.Provider
      value={{ selectedItems, toggleSelection, isSelected, clearSelection }}
    >
      {children}
    </MultiSelectContext.Provider>
  )
}
