'use client'

import React from 'react'

const TypingIndicator = () => {
  return (
    <div className="w-fit h-8 items-center rounded-md text-center px-2 flex gap-0.5 text-2xl">
      <div
        className="animate-bounce"
        style={{
          animationDelay: '0ms',
          animationDuration: '750ms',
        }}
      >
        .
      </div>
      <div
        className="animate-bounce"
        style={{
          animationDelay: '125ms',
          animationDuration: '750ms',
        }}
      >
        .
      </div>
      <div
        className="animate-bounce"
        style={{
          animationDelay: '250ms',
          animationDuration: '750ms',
        }}
      >
        .
      </div>
    </div>
  )
}

export default TypingIndicator
