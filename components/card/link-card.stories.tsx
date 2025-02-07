import LinkCard from './link-card'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof LinkCard> = {
  title: 'Organisms/Card/LinkCard',
  component: LinkCard,
  // tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LinkCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Card Title',
    text: 'Card Text',
    href: '/link-url',
  },
}
