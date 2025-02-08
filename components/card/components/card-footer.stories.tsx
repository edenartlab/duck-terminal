import ActionsDropdown from '@/components/button/actions-dropdown'
import LikeButton from '@/components/button/like-button'
import CardFooter from '@/components/card/components/card-footer'
// import CreatorData from '@/stories/dummyData/creator'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof CardFooter> = {
  title: 'Molecules/Card/CardFooter',
  component: CardFooter,
  render: ({ ...args }) => (
    <div className="min-w-64 max-w-sm">
      <CardFooter {...args} />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CardFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithCreator: Story = {
  args: {
    // creator: CreatorData,
  },
}

export const WithActions: Story = {
  args: {
    actions: [
      <LikeButton key={0} count={4} isActive={false} onChange={() => null} />,
      <ActionsDropdown key={1} />,
    ],
  },
}

export const WithAll: Story = {
  args: {
    // creator: CreatorData,
    actions: [
      <LikeButton key={0} count={4} isActive={false} onChange={() => null} />,
      <ActionsDropdown key={1} />,
    ],
  },
}
