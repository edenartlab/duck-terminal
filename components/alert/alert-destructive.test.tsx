import AlertDestructive from '@/components/alert/alert-destructive'
import { describe, expect, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'

describe('AlertDestructive Component', () => {
  test('should render', async () => {
    render(<AlertDestructive title={'AlertTitle'} />)

    const input = screen.getByText(/AlertTitle/i)
    expect(input).toBeInTheDocument()
  })
})
