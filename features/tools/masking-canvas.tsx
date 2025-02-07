'use client'

import SliderInput from '@/components/form/input/slider-input'
import LoadingIndicator from '@/components/loading-indicator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import MaskingCanvasCursor from '@/features/tools/masking-canvas-cursor'
import { uploadFileToS3 } from '@/lib/files'
import { cn } from '@/lib/utils'
import axios from 'axios'
import {
  BlendIcon,
  DownloadIcon,
  EraserIcon,
  FullscreenIcon,
  InfoIcon,
  MoveIcon,
  RedoIcon,
  TrashIcon,
  UndoIcon,
  UploadCloudIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from 'lucide-react'
import NextImage from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

type MaskingCanvasProps = {
  form: UseFormReturn
  onChange: (fileUrl: string) => void
  // parameter: ToolParameterV2;
  inputImageFieldName: string
  width?: number
  height?: number
  strokeColor?: string
}

type Stroke = {
  points: { x: number; y: number }[]
  lineWidth: number
  lineOpacity: number
  color: string
  isErasing?: boolean
}

// const getTouchPos = (
//   canvas: HTMLCanvasElement,
//   touchEvent: React.TouchEvent<HTMLCanvasElement>,
// ) => {
//   const rect = canvas.getBoundingClientRect()
//   const touch = touchEvent.touches[0]
//   return {
//     x: touch.clientX - rect.left,
//     y: touch.clientY - rect.top,
//   }
// }

const MaskingCanvas: React.FC<MaskingCanvasProps> = ({
  form,
  onChange,
  inputImageFieldName,
  width = 512,
  height = 512,
}) => {
  const strokeColor = '#ffffff'
  const baseImage = form.watch(inputImageFieldName)

  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [isErasing, setIsErasing] = useState<boolean>(false)
  const [isMoving, setIsMoving] = useState<boolean>(false)
  const [history, setHistory] = useState<Stroke[]>([])
  const [redoStack, setRedoStack] = useState<Stroke[]>([])
  const [lineWidth, setLineWidth] = useState<number>(64)
  const [lineOpacity, setLineOpacity] = useState<number>(1)
  const [imageOpacity, setImageOpacity] = useState<number>(0.5)
  const [canvasOpacity, setCanvasOpacity] = useState<number>(0.75)
  const [imageDimensions, setImageDimensions] = useState<{
    width: number
    height: number
  } | null>(null)
  const [isInverted, setIsInverted] = useState<boolean>(false)
  const [scale, setScale] = useState<number>(1)
  const [translate, setTranslate] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const [isPanning, setIsPanning] = useState<boolean>(false)
  const [lastPanPos, setLastPanPos] = useState<{ x: number; y: number } | null>(
    null,
  )

  useEffect(() => {
    if (baseImage) {
      const img = new Image()
      img.src = baseImage
      img.onload = () => {
        console.log('onload', { width: img.width, height: img.height })
        setImageDimensions({ width: img.width, height: img.height })
        setLineWidth(32 * (img.width / width))
      }
    }
  }, [baseImage])

  useEffect(() => {
    const handleResize = () => {
      if (overlayCanvasRef.current && imageDimensions) {
        const overlayCanvas = overlayCanvasRef.current

        // Set internal canvas resolution to match image dimensions
        overlayCanvas.width = imageDimensions.width ?? width
        overlayCanvas.height = imageDimensions.height ?? height

        // Use CSS to control the canvas display size to match image aspect ratio
        const aspectRatio = imageDimensions.width / imageDimensions.height
        const parentWidth = overlayCanvas.parentElement?.clientWidth || width
        const displayWidth = Math.min(parentWidth, imageDimensions.width)
        const displayHeight = displayWidth / aspectRatio

        // Set CSS size to control the display size
        overlayCanvas.style.width = `${displayWidth}px`
        overlayCanvas.style.height = `${displayHeight}px`

        redrawHistory()
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [imageDimensions, history, width, height])

  const redrawHistory = () => {
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(
          0,
          0,
          overlayCanvasRef.current.width,
          overlayCanvasRef.current.height,
        )

        history.forEach(
          ({ points, lineWidth, lineOpacity, color, isErasing }) => {
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.globalAlpha = lineOpacity
            ctx.strokeStyle = color
            ctx.globalCompositeOperation = isErasing
              ? 'destination-out'
              : 'source-over'
            ctx.beginPath()

            points.forEach((point, index) => {
              if (index === 0) {
                ctx.moveTo(point.x, point.y)
              } else {
                ctx.lineTo(point.x, point.y)
              }
            })

            ctx.stroke()
            ctx.closePath()
          },
        )
      }
    }
  }

  function getPointPos(
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) {
    if (!overlayCanvasRef.current) return { x: 0, y: 0 }

    const canvas = overlayCanvasRef.current
    const rect = canvas.getBoundingClientRect()

    let x, y
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0]
      x = touch.clientX - rect.left
      y = touch.clientY - rect.top
    } else {
      // Mouse event
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    // Calculate scaling factor to map displayed canvas size to actual canvas resolution
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    // Scale the position according to the resolution
    return {
      x: x * scaleX,
      y: y * scaleY,
    }
  }

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (overlayCanvasRef.current) {
      const points = getPointPos(e)
      setIsDrawing(true)
      setHistory(prevHistory => [
        ...prevHistory,
        {
          points: [points],
          lineWidth,
          lineOpacity,
          color: strokeColor,
          isErasing,
        },
      ])
    }
  }

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing || !overlayCanvasRef.current) return
    const points = getPointPos(e)
    setHistory(prevHistory => {
      const newHistory = [...prevHistory]
      const currentStroke = newHistory[newHistory.length - 1]
      currentStroke.points.push(points)
      return newHistory
    })
    redrawHistory()
  }

  const endDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    setRedoStack([])
  }

  const handleMouseDown = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (isMoving) {
      setLastPanPos(getPointPos(e))
      setIsPanning(true)
    } else {
      startDrawing(e)
    }
  }

  const handleMouseMove = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (isPanning && overlayCanvasRef.current) {
      const currentPos = getPointPos(e)
      if (lastPanPos) {
        const deltaX = currentPos.x - lastPanPos.x
        const deltaY = currentPos.y - lastPanPos.y
        setTranslate(prevTranslate => ({
          x: prevTranslate.x + deltaX,
          y: prevTranslate.y + deltaY,
        }))
        setLastPanPos(currentPos)
      }
    } else if (isDrawing) {
      draw(e)
    }
  }

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false)
      setLastPanPos(null)
    } else {
      endDrawing()
    }
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    handleMouseDown(e)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    handleMouseMove(e)
  }

  const handleTouchEnd = () => {
    handleMouseUp()
  }

  const toggleMove = () => {
    setIsMoving(prev => !prev)
  }

  const undo = () => {
    if (history.length > 0) {
      const newHistory = history.slice(0, -1)
      const currentData = history[history.length - 1]
      setHistory(newHistory)
      setRedoStack(prevRedoStack => [currentData, ...prevRedoStack])
      redrawHistory()
    }
  }

  const redo = () => {
    if (redoStack.length > 0) {
      const [redoStroke, ...remainingRedoStack] = redoStack
      setRedoStack(remainingRedoStack)
      setHistory(prevHistory => {
        const newHistory = [...prevHistory, redoStroke]
        redrawHistory()
        return newHistory
      })
    }
  }

  const clearCanvas = () => {
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(
          0,
          0,
          overlayCanvasRef.current.width,
          overlayCanvasRef.current.height,
        )
        setHistory([])
        setRedoStack([])
      }
    }
  }

  const extractMimeType = (dataUrlHeader: string): string => {
    const mimeMatch = dataUrlHeader.match(/:(.*?);/)
    return mimeMatch ? mimeMatch[1] : ''
  }

  const decodeBase64ToUint8Array = (base64String: string): Uint8Array => {
    const byteString = atob(base64String)
    const byteStringLength = byteString.length
    const u8Array = new Uint8Array(byteStringLength)
    for (let i = 0; i < byteStringLength; i++) {
      u8Array[i] = byteString.charCodeAt(i)
    }
    return u8Array
  }

  const dataUrlToFile = (dataUrl: string, fileName: string): File => {
    const [header, base64Data] = dataUrl.split(',')
    const mimeType = extractMimeType(header)
    const byteArray = decodeBase64ToUint8Array(base64Data)
    return new File([byteArray], fileName, { type: mimeType })
  }

  const exportCanvasToDataUrl = (overlayCanvas: HTMLCanvasElement) => {
    // Create an off-screen canvas with the original dimensions (width and height props)
    const offScreenCanvas = document.createElement('canvas')
    offScreenCanvas.width = imageDimensions?.width ?? width
    offScreenCanvas.height = imageDimensions?.height ?? height
    const offCtx = offScreenCanvas.getContext('2d')

    if (offCtx) {
      // Fill the off-screen canvas with a black background
      offCtx.fillStyle = '#000000'
      offCtx.fillRect(0, 0, offScreenCanvas.width, offScreenCanvas.height)

      // Draw the overlay canvas onto the off-screen canvas
      offCtx.drawImage(
        overlayCanvas,
        0,
        0,
        imageDimensions?.width ?? width,
        imageDimensions?.height ?? height,
      )

      const dataUrl = offScreenCanvas.toDataURL()
      offScreenCanvas.remove()
      // Return the data URL of the resized mask
      return dataUrl
    }
  }

  const saveMask = () => {
    if (!overlayCanvasRef.current) return

    // Save the resulting image
    const link = document.createElement('a')
    const dataUrl = exportCanvasToDataUrl(overlayCanvasRef.current)

    if (!dataUrl) return

    link.href = dataUrl
    link.download = `mask_${Date.now()}.png`
    link.click()
  }

  const useMask = async () => {
    if (!overlayCanvasRef.current) return

    const dataUrl = exportCanvasToDataUrl(overlayCanvasRef.current)

    if (!dataUrl) return

    setIsUploading(true)
    const file = dataUrlToFile(dataUrl, `mask_${Date.now()}.png`)
    const cancelSource = axios.CancelToken.source()

    try {
      const uploadedFile = await uploadFileToS3({
        file,
        onUploadProgress: progressEvent => console.log(progressEvent),
        cancelSource,
      })

      onChange(uploadedFile.fileUrl)
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const toggleInvert = () => {
    setIsInverted(prev => !prev)
  }

  const toggleEraser = () => {
    setIsErasing(prev => !prev)
  }

  return (
    <div className={cn(['w-full max-w-lg mx-auto flex flex-col items-center'])}>
      {!baseImage ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex gap-2 items-center">
            <InfoIcon className="h-5 w-5" />
            You need to set a starting image before drawing a mask
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="relative w-full rounded-md overflow-hidden border border-purple-600 mb-2 select-none">
            {overlayCanvasRef ? (
              <MaskingCanvasCursor
                size={
                  (lineWidth / ((imageDimensions?.width ?? width) / width)) *
                  scale
                }
                opacity={0.4}
                canvasRef={overlayCanvasRef}
              />
            ) : null}
            {baseImage && (
              <NextImage
                src={baseImage}
                alt="Base Image"
                width={imageDimensions?.width || width}
                height={imageDimensions?.height || height}
                className="absolute top-0 left-0 w-full h-full select-none"
                style={{
                  aspectRatio: imageDimensions
                    ? `${imageDimensions.width} / ${imageDimensions.height}`
                    : '1',
                  opacity: imageOpacity,
                  scale: scale,
                  transform: `translate(${translate.x}px, ${translate.y}px)`,
                }}
              />
            )}
            <canvas
              data-custom-cursor={true}
              ref={overlayCanvasRef}
              className={cn([
                'relative z-10 w-full h-full select-none',
                'cursor-crosshair',
                isInverted ? 'invert' : '',
                isMoving ? 'cursor-move' : '',
              ])}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              width={imageDimensions?.width ?? width}
              height={imageDimensions?.height ?? height}
              style={{
                aspectRatio: imageDimensions
                  ? `${imageDimensions.width} / ${imageDimensions.height}`
                  : '1',
                scale: scale,
                transform: `translate(${translate.x}px, ${translate.y}px)`,
                opacity: canvasOpacity,
              }}
            />

            {history.length === 0 && !isDrawing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-popover-foreground text-shadow-sm shadow-popover text-lg">
                <div className="bg-accent bg-opacity-70 rounded-md py-1 px-2">
                  Draw a mask here
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 w-full bg-secondary p-1 rounded-md">
            <div>
              <Button
                type="button"
                size={'sm'}
                variant="outline"
                onClick={undo}
                disabled={!history.length}
                title={'Undo'}
              >
                <UndoIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size={'sm'}
                variant="outline"
                onClick={redo}
                disabled={!redoStack.length}
                title={'Redo'}
              >
                <RedoIcon className="h-4 w-4" />
              </Button>
            </div>

            <Button
              type="button"
              size={'sm'}
              variant="outline"
              onClick={clearCanvas}
              disabled={!history.length}
              title="Clear canvas"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>

            <div>
              <Button
                type="button"
                className={isInverted ? 'bg-purple-900' : 'bg-secondary'}
                size={'sm'}
                variant={'outline'}
                onClick={toggleInvert}
                title="Invert mask colors (does not change output)"
              >
                <BlendIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                className={isErasing ? 'bg-purple-900' : 'bg-secondary'}
                size={'sm'}
                variant={'outline'}
                disabled={!history.length}
                onClick={toggleEraser}
                title="Toggle Eraser"
              >
                <EraserIcon className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Button
                disabled={scale >= 4}
                variant="outline"
                type="button"
                size={'sm'}
                onClick={() =>
                  setScale(prevScale =>
                    Math.min(Math.max(prevScale * 1.1, 0.5), 4),
                  )
                }
                title="Zoom In"
              >
                <ZoomInIcon className="h-4 w-4" />
              </Button>
              <Button
                disabled={scale <= 0.5}
                variant="outline"
                type="button"
                size={'sm'}
                onClick={() =>
                  setScale(prevScale =>
                    Math.min(Math.max(prevScale * 0.9, 0.5), 4),
                  )
                }
                title="Zoom Out"
              >
                <ZoomOutIcon className="h-4 w-4" />
              </Button>
              <Button
                className={isMoving ? 'bg-purple-900' : 'bg-secondary'}
                variant="outline"
                type="button"
                size={'sm'}
                onClick={toggleMove}
                title="Move viewport"
              >
                <MoveIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                type="button"
                size={'sm'}
                onClick={() => {
                  setScale(1)
                  setTranslate({ x: 0, y: 0 })
                }}
                title="Reset Viewport"
              >
                <FullscreenIcon className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="ml-auto flex items-center"
              type="button"
              size={'sm'}
              variant="outline"
              onClick={saveMask}
              disabled={!history.length}
              title={'Download drawing as png'}
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-full mt-4">
            <div className="flex gap-2 mb-4">
              <FormItem className="w-full">
                <Label>Image Opacity</Label>
                <SliderInput
                  hideNumberInput={true}
                  type={'float'}
                  min={0}
                  max={1}
                  step={0.05}
                  value={imageOpacity}
                  onChange={(newVal: number | undefined) => {
                    setImageOpacity(newVal === undefined ? 1 : newVal)
                  }}
                />
              </FormItem>
              <FormItem className="w-full">
                <Label>Canvas Opacity</Label>
                <SliderInput
                  hideNumberInput={true}
                  type={'float'}
                  min={0}
                  max={1}
                  step={0.05}
                  value={canvasOpacity}
                  onChange={(newVal: number | undefined) => {
                    setCanvasOpacity(newVal === undefined ? 1 : newVal)
                  }}
                />
              </FormItem>
            </div>

            <FormItem className="mb-4">
              <Label>Line Width</Label>
              <SliderInput
                type={'integer'}
                min={1}
                max={420}
                step={1}
                value={lineWidth}
                onChange={(newVal: number | undefined) => {
                  setLineWidth(newVal || 1)
                }}
              />
            </FormItem>
            <FormItem className="hidden">
              <Label>Line Opacity</Label>
              <SliderInput
                type={'float'}
                min={0.05}
                max={1}
                step={0.05}
                value={lineOpacity}
                onChange={(newVal: number | undefined) => {
                  setLineOpacity(newVal || 1)
                }}
              />
            </FormItem>

            <Button
              variant="secondary"
              type="button"
              disabled={isUploading || !history.length}
              onClick={useMask}
            >
              {isUploading ? (
                <LoadingIndicator className="h-4 w-4 mr-2" />
              ) : (
                <UploadCloudIcon className="h-4 w-4 mr-2 " />
              )}
              Use mask
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default MaskingCanvas
