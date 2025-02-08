import CardImage from '@/components/card/components/card-image'
import squareImageFile from '@/stories/assets/placeholder/dummy_1024x1024_ffffff_333.webp'
import { MediaType } from '@edenlabs/eden-sdk'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof CardImage> = {
  title: 'Molecules/Card/CardImage',
  component: CardImage,
  render: ({ ...args }) => (
    <div className="min-w-64 max-w-sm">
      <CardImage {...args} />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CardImage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    media: {
      url: squareImageFile.src,
      thumbnail: squareImageFile.src,
      width: squareImageFile.width,
      height: squareImageFile.height,
      type: MediaType.Image,
      mimeType: 'image/jpeg',
    },
  },
}

export const Loading: Story = {
  args: {
    media: {
      url: '/image/does/not/exist',
      thumbnail: '/image/does/not/exist',
      width: squareImageFile.width,
      height: squareImageFile.height,
      type: MediaType.Image,
      mimeType: 'image/jpeg',
    },
  },
}

export const Error: Story = {
  args: {
    media: {
      url: '',
      thumbnail: '',
      width: squareImageFile.width,
      height: squareImageFile.height,
      type: MediaType.Image,
      mimeType: 'image/jpeg',
    },
  },
}
