import Header from './header'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Organisms/Header',
  component: Header,
  // parameters: {
  // layout: 'fullscreen',
  // },
  argTypes: {},
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const LoggedOut: Story = {}
