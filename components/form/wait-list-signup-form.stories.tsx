import WaitListSignupForm from './wait-list-signup-form'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Organisms/Form/WaitListSignupForm',
  component: WaitListSignupForm,
  parameters: {
    // layout: 'centered',
  },
} satisfies Meta<typeof WaitListSignupForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
