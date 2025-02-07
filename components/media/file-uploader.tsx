'use client'

import { LightboxGallery, LightboxTrigger } from '@/components/media/lightbox'
import { Button } from '@/components/ui/button'
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '@/components/ui/custom/sortable'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  convertBytes,
  getFileTypeByMimeType,
  uploadFileToS3,
} from '@/lib/files'
import { cn } from '@/lib/utils'
import { FileType, MimeType } from '@/types/Media'
import { arrayMove } from '@dnd-kit/sortable'
import axios, { AxiosError, AxiosProgressEvent, CancelTokenSource } from 'axios'
import {
  AudioWaveform,
  BanIcon,
  FileImage,
  FolderArchive,
  GripVerticalIcon,
  Trash2Icon,
  UploadCloudIcon,
  Video,
  X,
} from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Truncate from 'react-truncate-inside/es'
import { toast } from 'sonner'

interface FileUploadProgress {
  progress: number
  File: File
  source: CancelTokenSource | null
}

const ArchiveColor = {
  bgColor: 'blue-400',
  fillColor: 'text-blue-400',
  borderColor: 'border-blue-400',
}

const ImageColor = {
  bgColor: 'purple-600',
  fillColor: 'text-purple-600',
  borderColor: 'border-purple-600',
}

const AudioColor = {
  bgColor: 'yellow-400',
  fillColor: 'text-yellow-400',
  borderColor: 'border-yellow-400',
}

const VideoColor = {
  bgColor: 'green-400',
  fillColor: 'text-green-400',
  borderColor: 'border-green-400',
}

const OtherColor = {
  bgColor: 'gray-400',
  fillColor: 'text-gray-400',
  borderColor: 'border-gray-400',
}

const getFileIconAndColor = (fileType: FileType) => {
  if (fileType === `image`) {
    return {
      icon: (
        <FileImage size={40} className={`${ImageColor.fillColor} w-[72px]`} />
      ),
      color: ImageColor.bgColor,
    }
  }

  if (fileType === `audio`) {
    return {
      icon: (
        <AudioWaveform
          size={40}
          className={`${AudioColor.fillColor} w-[72px]`}
        />
      ),
      color: AudioColor.bgColor,
    }
  }

  if (fileType === `video`) {
    return {
      icon: <Video size={40} className={`${VideoColor.fillColor} w-[72px]`} />,
      color: VideoColor.bgColor,
    }
  }

  if (fileType === 'archive') {
    return {
      icon: (
        <FolderArchive
          size={40}
          className={`${ArchiveColor.fillColor} w-[72px]`}
        />
      ),
      color: ArchiveColor.bgColor,
    }
  }

  return {
    icon: (
      <FolderArchive size={40} className={`${OtherColor.fillColor} w-[72px]`} />
    ),
    color: OtherColor.bgColor,
  }
}

type SupportedFileType = {
  type: FileType
  allowedMimeTypes: MimeType[]
}

const supportedFileTypes: SupportedFileType[] = [
  {
    type: 'image',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
  {
    type: 'video',
    allowedMimeTypes: [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'image/gif',
    ],
  },
  {
    type: 'audio',
    allowedMimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  },
  {
    type: 'archive',
    allowedMimeTypes: [
      'application/zip',
      'application/x-tar',
      'application/x-gzip',
    ],
  },
]

export type FileWithPreview = {
  url: string
  type: FileType
  name: string
  size?: number
  dimensions?: { width: number; height: number }
  duration?: number
}

type Props = {
  value: string | string[]
  onChange: (fileUrls: string | string[]) => void
  allowedFileTypes?: string[]
  maxFiles?: number
  allowMultiple?: boolean
  className?: string
  enableDropFromTimeline?: boolean
}

const FileUploader = ({
  value,
  allowedFileTypes = ['image', 'video'], // default types
  maxFiles = 1,
  allowMultiple = false,
  enableDropFromTimeline = true,
  onChange,
  className,
}: Props) => {
  // Separate existing file URLs into an array
  const existingUrls = useMemo(
    () => (Array.isArray(value) ? value : value ? [value] : []),
    [value],
  )

  const [existingFiles, setExistingFiles] = useState<FileWithPreview[]>([])
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([])

  // Initialize existingFiles based on value prop
  useEffect(() => {
    const initFiles: FileWithPreview[] = existingUrls.map(url => {
      const fileType = getFileTypeByMimeType(urlToMimeType(url)) || 'image'
      const name = url.split('/').pop() || 'file'
      return {
        url,
        type: fileType,
        name,
      }
    })

    // Prevent unnecessary state updates
    setExistingFiles(prevExistingFiles => {
      const prevUrls = prevExistingFiles.map(f => f.url)
      const newUrls = initFiles.map(f => f.url)
      const isSame =
        prevUrls.length === newUrls.length &&
        prevUrls.every((url, index) => url === newUrls[index])

      if (isSame) {
        return prevExistingFiles
      }

      return initFiles
    })
  }, [existingUrls])

  // Helper function to extract MIME type from URL
  const urlToMimeType = (url: string): MimeType => {
    const extension = url.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'png':
        return 'image/png'
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'webp':
        return 'image/webp'
      case 'mp4':
        return 'video/mp4'
      case 'webm':
        return 'video/webm'
      case 'mov':
        return 'video/quicktime'
      case 'gif':
        return 'image/gif'
      case 'zip':
        return 'application/zip'
      case 'tar':
        return 'application/x-tar'
      case 'gz':
      case 'tgz':
        return 'application/x-gzip'
      case 'mp3':
        return 'audio/mpeg'
      case 'wav':
        return 'audio/wav'
      case 'ogg':
        return 'audio/ogg'
      default:
        return 'image/jpeg'
    }
  }

  // Handle file upload progress and completion
  const onUploadProgressHandler = (
    progressEvent: AxiosProgressEvent,
    file: File,
    cancelSource: CancelTokenSource,
  ) => {
    const progress = Math.round(
      (progressEvent.loaded / (progressEvent.total ?? 0)) * 100,
    )

    if (progress === 100) {
      return
    }

    setFilesToUpload(prev =>
      prev.map(item =>
        item.File === file ? { ...item, progress, source: cancelSource } : item,
      ),
    )
  }

  const uploadAsset = async (
    file: File,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
    cancelSource: CancelTokenSource,
  ) => {
    try {
      return uploadFileToS3({
        file,
        onUploadProgress,
        cancelSource,
      })
    } catch (e) {
      console.error(e)
      toast.error(`Failed to upload file!`, {
        description: file.name,
        dismissible: true,
        richColors: true,
      })
    }
  }

  const removeFile = (url: string) => {
    setExistingFiles(prev => prev.filter(file => file.url !== url))
    const updatedUrls = existingFiles
      .filter(file => file.url !== url)
      .map(file => file.url)
    onChange(maxFiles === 1 ? updatedUrls[0] : updatedUrls)
  }

  const clearFiles = () => {
    setFilesToUpload([])
    setExistingFiles([])
    onChange(maxFiles === 1 ? '' : [])
  }

  const verifyFileTypes = (acceptedFiles: File[]) => {
    const acceptedFilesWithType = acceptedFiles.filter(file => {
      const mimeType = file.type ?? urlToMimeType(file.name)
      const fileType = getFileTypeByMimeType(mimeType)
      return allowedFileTypes.some(type => type === fileType)
    })

    // console.log({acceptedFilesWithType, acceptedFiles, allowedFileTypes})

    if (acceptedFilesWithType.length !== acceptedFiles.length) {
      toast.error(`Unsupported file type!`, {
        description: `Only ${allowedFileTypes
          .map(type => type)
          .join(', ')} files are supported`,
        dismissible: true,
        richColors: true,
      })
      return false
    }
    return true
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      if (
        existingFiles.length + filesToUpload.length + acceptedFiles.length >
        (maxFiles || 1)
      ) {
        toast.error(`Too many files!`, {
          description: `Maximum for this field is ${maxFiles} ${
            maxFiles > 1 ? 'files' : 'file'
          }`,
          dismissible: true,
          richColors: true,
        })
        return
      }

      const newUploads: FileUploadProgress[] = acceptedFiles.map(file => ({
        progress: 0,
        File: file,
        source: null,
      }))

      setFilesToUpload(prev => [...prev, ...newUploads])

      // Array to collect successfully uploaded file URLs
      const uploadedFileUrls: string[] = []

      // Start uploading
      const uploadPromises = acceptedFiles.map(async file => {
        const cancelSource = axios.CancelToken.source()
        const asset = await uploadAsset(
          file,
          progressEvent =>
            onUploadProgressHandler(progressEvent, file, cancelSource),
          cancelSource,
        )

        if (asset?.fileUrl) {
          setExistingFiles(prev => [
            ...prev,
            {
              ...asset,
              url: asset.fileUrl,
              type: getFileTypeByMimeType(asset.type as MimeType) || 'image',
              name: file.name,
              size: file.size,
            },
          ])

          // Collect the uploaded file URL
          uploadedFileUrls.push(asset.fileUrl)
        }

        setFilesToUpload(prev => prev.filter(item => item.File !== file))
      })

      try {
        await Promise.all(uploadPromises)

        // After all uploads, call onChange once with the updated URLs
        const allUrls = [...existingFiles.map(f => f.url), ...uploadedFileUrls]
        onChange(
          maxFiles === 1
            ? uploadedFileUrls[uploadedFileUrls.length - 1]
            : allUrls,
        )

        toast.info(`Upload finished`, {
          description: `${acceptedFiles.length} File${
            acceptedFiles.length > 1 ? 's' : ''
          }`,
          dismissible: true,
          richColors: true,
        })
      } catch (error) {
        console.error('Error uploading files: ', error)
        const errorMessage = axios.isAxiosError(error)
          ? JSON.parse((error as AxiosError).request?.responseText || '{}')
              ?.message
          : 'Unknown Error'

        toast.error('Error while uploading files', {
          description: JSON.stringify(errorMessage),
          dismissible: true,
          richColors: true,
        })
      }
    },
    [existingFiles, filesToUpload, maxFiles, onChange],
  )

  const acceptedFiles: Record<string, string[]> = useMemo(() => {
    return supportedFileTypes
      .filter(type => allowedFileTypes?.includes(type.type))
      .reduce(
        (acc, type) => ({
          ...acc,
          ...type.allowedMimeTypes.reduce((a, m) => ({ ...a, [m]: [] }), {}),
        }),
        {},
      )
  }, [allowedFileTypes])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: allowMultiple,
    maxFiles: allowMultiple ? maxFiles : 1,
    accept: acceptedFiles,
  })

  const handleMove = (activeIndex: number, overIndex: number) => {
    const newExistingFiles = arrayMove(existingFiles, activeIndex, overIndex)
    setExistingFiles(newExistingFiles)
    const newUrls = newExistingFiles.map(file => file.url)
    onChange(maxFiles === 1 ? newUrls[0] : newUrls)
  }

  const handleDropFromTimeline = (e: React.DragEvent<HTMLDivElement>) => {
    if (!enableDropFromTimeline) return

    const url = e.dataTransfer.getData('text/plain')
    if (!url) return
    if (existingFiles.find(f => f.url === url)) return

    const mimeType = urlToMimeType(url)
    if (!acceptedFiles[mimeType]) return

    setExistingFiles(prev => [
      ...prev,
      {
        url,
        type: getFileTypeByMimeType(mimeType),
        name: url.split('/').pop() || 'file',
      },
    ])
    onChange(maxFiles === 1 ? url : [...existingFiles.map(f => f.url), url])
  }

  const gradientClasses = useMemo(() => {
    if (!allowedFileTypes?.length) return ''

    const colors: string[] = []
    if (allowedFileTypes.includes('image')) {
      colors.push(ImageColor.bgColor)
    }
    if (allowedFileTypes.includes('video')) {
      colors.push(VideoColor.bgColor)
    }
    if (allowedFileTypes.includes('archive')) {
      colors.push(ArchiveColor.bgColor)
    }
    if (allowedFileTypes.includes('audio')) {
      colors.push(AudioColor.bgColor)
    }

    if (colors.length === 0) return ''

    if (colors.length === 1) {
      return `bg-${colors[0]}`
    }

    // Generate a gradient if there are multiple colors
    const gradientClasses = ['bg-gradient-to-r']
    colors.forEach((color, i) => {
      if (i === 0) gradientClasses.push(`from-${color}`)
      else if (i === colors.length - 1) gradientClasses.push(`to-${color}`)
      else gradientClasses.push(`via-${color}`)
    })

    return gradientClasses.join(' ')
  }, [allowedFileTypes])

  return (
    <div
      {...getRootProps()}
      onDrop={e => {
        e.preventDefault()
        if (e.dataTransfer.getData('text/plain')) {
          handleDropFromTimeline(e)
        } else {
          const files = Array.from(e.dataTransfer.files)
          if (!verifyFileTypes(files)) return
          onDrop(files)
        }
      }}
      className={cn(['flex-grow', className])}
    >
      <div>
        {existingFiles.length + filesToUpload.length < (maxFiles || 1) ? (
          <label className="relative flex flex-col items-center justify-center w-full cursor-pointer hover:brightness-110">
            <div
              className={cn(
                'absolute w-[calc(100%+2px)] h-[calc(100%+2px)] rounded-lg',
                gradientClasses,
              )}
            ></div>
            <div className="text-center z-10 bg-card w-full h-full p-2 rounded-lg">
              <div className="flex items-center justify-center">
                <UploadCloudIcon className="mr-2 h-4 w-4" />
                <div className="text-sm text-muted-foreground font-semibold">
                  Upload {maxFiles && maxFiles > 1 ? `up to ${maxFiles}` : ''}{' '}
                  {allowedFileTypes
                    ?.map(type =>
                      maxFiles && maxFiles > 1 ? `${type}s` : type,
                    )
                    .join(' or ')}
                </div>
              </div>
              <div className="text-xs text-muted-foreground hidden md:block">
                Click here or drop files to upload
              </div>
            </div>
          </label>
        ) : null}

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept={supportedFileTypes
            .filter(type => allowedFileTypes?.includes(type.type))
            .flatMap(type => type.allowedMimeTypes)
            .join(', ')}
          type="file"
          className="hidden"
        />
      </div>

      {filesToUpload.length || existingFiles.length ? (
        <div
          className="bg-card p-2 rounded-lg mt-4"
          onClick={e => {
            e.stopPropagation()
          }}
        >
          <div className="font-medium mb-2 text-muted-foreground text-sm flex gap-2 flex-wrap justify-between">
            <div>
              Uploaded {existingFiles.length + filesToUpload.length}{' '}
              {allowedFileTypes?.length > 1 ? ' file' : allowedFileTypes[0]}
            </div>
            <div>(max. {maxFiles})</div>
          </div>
          <div className="space-y-2">
            <Sortable
              value={existingFiles.map(file => ({
                id: file.url, // unique identifier
              }))}
              onMove={({ activeIndex, overIndex }) =>
                handleMove(activeIndex, overIndex)
              }
            >
              <LightboxGallery>
                {existingFiles.map((file, index) => (
                  <SortableItem key={index} value={file.url} asChild>
                    <div className="relative flex justify-between gap-2 rounded-lg overflow-hidden border border-border group">
                      <div className="flex items-center pl-2 h-20">
                        {allowMultiple && (
                          <SortableDragHandle
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-8 shrink-0 mr-4"
                          >
                            <GripVerticalIcon aria-hidden="true" />
                          </SortableDragHandle>
                        )}
                        <div className="relative text-white rounded-lg overflow-hidden shrink-0 mr-2">
                          {file.type === 'image' || file.type === 'video' ? (
                            <LightboxTrigger
                              className="hover:brightness-105 h-16 w-auto cursor-zoom-in"
                              slide={{
                                url: file.url,
                                thumbnail: file.url,
                              }}
                              startIndex={index}
                              imageProps={{
                                unoptimized: true,
                                className:
                                  'relative rounded-lg hover:brightness-105 h-16 w-auto',
                              }}
                              videoProps={{
                                className:
                                  'object-contain h-16 w-auto hover:brightness-105',
                                controls: false,
                                onLoad: () => URL.revokeObjectURL(file.url),
                              }}
                            />
                          ) : (
                            <div
                              className={`text-${
                                getFileIconAndColor(
                                  getFileTypeByMimeType(file.type),
                                ).color
                              } flex justify-center mr-2`}
                            >
                              {
                                getFileIconAndColor(
                                  getFileTypeByMimeType(file.type),
                                ).icon
                              }
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 max-w-[96px] md:max-w-[110px] lg:max-w-[200px] overflow-hidden">
                          <div className="text-sm text-muted-foreground">
                            <Truncate text={file.name} />
                          </div>
                          <div className="text-xs text-muted-foreground/70">
                            {file.dimensions && (
                              <div>
                                {file.dimensions.width} x{' '}
                                {file.dimensions.height}
                              </div>
                            )}
                            {file.size && (
                              <div>
                                {convertBytes(file.size, {
                                  useBinaryUnits: false,
                                  decimals: 2,
                                })}
                              </div>
                            )}
                            {file.duration && (
                              <div>{file.duration.toFixed(2)} s</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          removeFile(file.url)
                        }}
                        className="border-l text-primary/40 hover:bg-destructive hover:text-destructive-foreground items-center justify-center cursor-pointer px-2 group-hover:flex"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </SortableItem>
                ))}
              </LightboxGallery>
            </Sortable>

            {filesToUpload.map((fileUploadProgress, index) => (
              <div
                key={index}
                className="flex justify-between gap-2 rounded-lg overflow-hidden border border-border group h-20"
              >
                <div className="flex items-center w-full pr-2">
                  <div
                    className={`text-${
                      getFileIconAndColor(
                        getFileTypeByMimeType(
                          fileUploadProgress.File.type as MimeType,
                        ),
                      ).color
                    } flex justify-center mr-2`}
                  >
                    {
                      getFileIconAndColor(
                        getFileTypeByMimeType(
                          fileUploadProgress.File.type as MimeType,
                        ),
                      ).icon
                    }
                  </div>
                  <div className="w-full space-y-1">
                    <div className="text-xs flex items-center justify-between">
                      <div className="text-sm text-muted-foreground max-w-[96px] md:max-w-[110px]">
                        <Truncate text={fileUploadProgress.File.name} />
                      </div>
                      <span>{fileUploadProgress.progress}%</span>
                    </div>
                    <Progress
                      value={fileUploadProgress.progress}
                      className={`bg-${
                        getFileIconAndColor(
                          getFileTypeByMimeType(
                            fileUploadProgress.File.type as MimeType,
                          ),
                        ).color
                      }`}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (fileUploadProgress.source) {
                      fileUploadProgress.source.cancel('Upload cancelled')
                    }
                    // Remove from filesToUpload
                    setFilesToUpload(prev =>
                      prev.filter(
                        item => item.File !== fileUploadProgress.File,
                      ),
                    )
                  }}
                  className="border-l text-primary/40 hover:bg-warning hover:text-destructive-foreground items-center justify-center cursor-pointer px-2 group-hover:flex"
                >
                  <BanIcon size={20} />
                </button>
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                className="hover:bg-destructive hover:text-destructive-foreground"
                size="sm"
                variant="ghost"
                type="button"
                onClick={clearFiles}
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Clear all uploads
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default FileUploader
