'use client'

import ReactDOM from 'react-dom'

export function PreloadResources() {
  if (process.env.NODE_ENV === 'production') {
    ReactDOM.preconnect('https://www.googletagmanager.com', { crossOrigin: 'anonymous' })
  } 
  return null
}