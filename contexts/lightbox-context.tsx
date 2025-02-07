// contexts/LightboxContext.tsx
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'

type LightboxContextType = {
  openGalleryId: string | null
  openGallery: (id: string) => void
  closeGallery: () => void
}

const LightboxContext = createContext<LightboxContextType | undefined>(
  undefined,
)

export const LightboxProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [openGalleryId, setOpenGalleryId] = useState<string | null>(null)

  const openGallery = (id: string) => setOpenGalleryId(id)
  const closeGallery = () => setOpenGalleryId(null)

  return (
    <LightboxContext.Provider
      value={{ openGalleryId, openGallery, closeGallery }}
    >
      {children}
    </LightboxContext.Provider>
  )
}

export const useLightbox = () => {
  const context = useContext(LightboxContext)
  if (!context) {
    throw new Error('useLightbox must be used within a LightboxProvider')
  }
  return context
}
