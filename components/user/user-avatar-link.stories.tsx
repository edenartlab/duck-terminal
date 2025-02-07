import CreatorData from '@/stories/dummyData/creator'
import type { Meta, StoryObj } from '@storybook/react'
import UserAvatarLink from '@/components/user/user-avatar-link'

const meta: Meta<typeof UserAvatarLink> = {
  title: 'Molecules/User/UserAvatarLink',
  component: UserAvatarLink,
  // tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof UserAvatarLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    image: CreatorData.userImage,
    name: CreatorData.username,
  },
}

export const HiddenName: Story = {
  args: {
    name: CreatorData.username,
    image: CreatorData.userImage,
    hideName: true,
  },
}
