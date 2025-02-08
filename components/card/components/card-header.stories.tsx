import CardHeader from '@/components/card/components/card-header'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof CardHeader> = {
  title: 'Molecules/Card/CardHeader',
  component: CardHeader,
  render: ({ ...args }) => (
    <div className="min-w-64 max-w-sm">
      <CardHeader {...args} />
    </div>
  ),
  // tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CardHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Title',
  },
}
