import LikeButton from '@/components/button/like-button'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof LikeButton> = {
  title: 'Atoms/Button/LikeButton',
  component: LikeButton,
  // tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LikeButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Active: Story = {
  args: {
    isActive: true,
  },
}

export const WithCount: Story = {
  args: {
    count: 3,
  },
}
