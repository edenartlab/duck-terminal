import UserAvatar from './user-avatar'
import CreatorData from '@/stories/dummyData/creator'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof UserAvatar> = {
  title: 'Atoms/User/UserAvatar',
  component: UserAvatar,
  // tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof UserAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    image: CreatorData.userImage,
    name: CreatorData.username,
  },
}

export const ImageFallback: Story = {
  args: {
    name: CreatorData.username,
  },
}
