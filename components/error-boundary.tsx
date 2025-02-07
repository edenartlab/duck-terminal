'use client'

import AlertDestructive from './alert/alert-destructive'
import { AlertDescription } from './ui/alert'
import React, { Component } from 'react'

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <AlertDestructive title="Error">
          <AlertDescription>
            {this.state.error?.message || 'Something went wrong.'}
          </AlertDescription>
        </AlertDestructive>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
