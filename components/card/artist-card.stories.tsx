import ArtistCard from './artist-card'
import CreatorData from '@/stories/dummyData/creator'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ArtistCard> = {
  title: 'Organisms/Card/ArtistCard',
  component: ArtistCard,
  render: ({ ...args }) => (
    <div className="min-w-64 max-w-sm">
      <ArtistCard {...args} />
    </div>
  ),
  // tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ArtistCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    creator: CreatorData,
  },
}
