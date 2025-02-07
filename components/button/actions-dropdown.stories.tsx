import ActionsDropdown from '@/components/button/actions-dropdown'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ActionsDropdown> = {
  title: 'Atoms/Button/ActionsDropdown',
  component: ActionsDropdown,
  // tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ActionsDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
