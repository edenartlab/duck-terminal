'use client'

import { FeedbackAdapter } from '@assistant-ui/react'
import axios from 'axios'

const edenFeedbackAdapter: FeedbackAdapter = {
  submit: async feedback => {
    const { message, type } = feedback
    console.log('submit feedback', { message, type })

    try {
      const response = await axios.post(`/api/threads/react`, {
        message_id: message.id,
        reaction: type === 'positive' ? 'thumbs_up' : 'thumbs_down',
      })
      console.log(response)
    } catch (e) {
      console.error(e)
    }
  },
}

export default edenFeedbackAdapter
