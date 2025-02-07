import CreationCard from './creation-card'
import CreationData from '@/stories/dummyData/creation'
// import CreatorData from '@/stories/dummyData/creator'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof CreationCard> = {
  title: 'Organisms/Card/CreationCard',
  component: CreationCard,
  render: ({ ...args }) => (
    <div className="min-w-64 max-w-sm">
      <CreationCard {...args} />
    </div>
  ),
  // tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    creation: CreationData,
  },
} satisfies Meta<typeof CreationCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithFooter: Story = {
  args: {
    showFooter: true,
    // creator: CreatorData,
  },
}
