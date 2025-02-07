import React, { MutableRefObject, useEffect, useState } from 'react'

interface CustomCursorProps {
  canvasRef?: MutableRefObject<HTMLCanvasElement | null>
  color?: string // Default cursor color
  opacity?: number // Opacity of the custom cursor
  size?: number // Size of the cursor in pixels (e.g., '10px')
}

const MaskingCanvasCursor: React.FC<CustomCursorProps> = ({
  canvasRef,
  color = '#fff',
  opacity = 1,
  size = 16,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef?.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        const parentRect =
          canvasRef.current.parentElement?.getBoundingClientRect()

        setPosition({
          x: e.clientX - (parentRect?.left || rect.left),
          y: e.clientY - (parentRect?.top || rect.top),
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [canvasRef])

  // Handle mouse enter/leave events
  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true)
    const handleMouseLeave = () => setIsActive(false)

    const elements = document.querySelectorAll('[data-custom-cursor]')

    elements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    // <div
    //   // style={{
    //   //   position: 'fixed',
    //   //   top: `${(position.y - translate.y) / scale}px`,
    //   //   left: `${(position.x - translate.x) / scale}px`,
    //   //   transform: `translate(-50%, -50%) scale(${scale})`,
    //   //   width: `${size}px`,
    //   //   height: `${size}px`,
    //   //   backgroundColor: color,
    //   //   borderRadius: '50%',
    //   //   opacity: isActive ? opacity : 0,
    //   //   pointerEvents: 'none',
    //   //   transition: 'opacity 0.2s ease, transform 0.1s ease',
    //   //   zIndex: 50,
    //   //   // backgroundBlendMode: 'difference',
    //   //   // mixBlendMode: 'hard-light',
    //   // }}
    //   className='custom-cursor'
    // />
    <div
      style={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: `translate(-50%, -50%)`,
        width: `${size}px`,
        height: `${size}px`,
        border: '2px solid #333',
        backgroundColor: color,
        borderRadius: '50%',
        opacity: isActive ? opacity : 0,
        pointerEvents: 'none',
        transition: 'opacity 0.2s ease, transform 0.1s ease',
        zIndex: 50,
      }}
      className="custom-cursor select-none"
    />
  )
}

export default MaskingCanvasCursor
