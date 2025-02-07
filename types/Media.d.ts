export type FileType = 'image' | 'pdf' | 'audio' | 'video' | 'archive' | 'other'
export type MimeTypesVideo =
  | 'video/mp4'
  | 'video/webm'
  | 'video/quicktime'
  | 'image/gif'
export type MimeTypesImage =
  | 'image/png'
  | 'image/webp'
  | 'image/jpg'
  | 'image/jpeg'
export type MimeTypesArchive =
  | 'application/zip'
  | 'application/x-tar'
  | 'application/x-gzip'
export type MimeTypesAudio = 'audio/mpeg' | 'audio/wav' | 'audio/ogg'

export type MimeType =
  | MimeTypesVideo
  | MimeTypesImage
  | MimeTypesArchive
  | MimeTypesAudio

interface Media {
  url?: string
  thumbnail?: string
  width?: number
  height?: number
  type: FileType
  mimeType?: MimeType
  blurhash?: string
}

interface MediaVideo extends Media {
  type: 'video'
  mimeType: MimeTypesVideo
}

interface MediaImage extends Media {
  type: 'image'
  mimeType: MimeTypesImage
}

interface MediaAudio extends Media {
  type: 'audio'
  mimeType: MimeTypesAudio
}
