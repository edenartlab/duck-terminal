'use client'

import { uploadFileToS3 } from '@/lib/files'
import { getCloudfrontOriginalUrl } from '@/lib/media'
import { AttachmentAdapter } from '@assistant-ui/react'
import axios, { AxiosProgressEvent, CancelTokenSource } from 'axios'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

const getFileDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)

    reader.readAsDataURL(file)
  })

const uploadAsset = async (
  file: File,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
  cancelSource: CancelTokenSource,
) => {
  try {
    return uploadFileToS3({
      file,
      onUploadProgress,
      cancelSource,
    })
  } catch (e) {
    console.error(e)
    toast.error(`Failed to upload file!`, {
      description: file.name,
      dismissible: true,
      richColors: true,
    })
  }
}

const edenImageAttachmentAdapter: AttachmentAdapter = {
  accept: 'image/*',
  async add({ file }) {
    const cancelSource = axios.CancelToken.source()
    const asset = await uploadAsset(
      file,
      evt => {
        console.log(evt)
      },
      cancelSource,
    )

    console.log({ asset })
    // @todo: when progress is possible, return cloudfront url as name after upload

    return {
      id: uuidv4(),
      file,
      type: 'image',
      name: file.name,
      contentType: file.type,
      // status: { type: 'requires-action', reason: 'composer-send' },
      status: { type: 'running', reason: 'uploading', progress: 1 },
    }
  },
  async send(attachment) {
    console.log(attachment)
    return {
      ...{
        ...attachment,
        name: getCloudfrontOriginalUrl(
          (attachment.file as File & { fileUrl: string }).fileUrl,
        ),
      },
      content: [
        {
          type: 'image',
          image: await getFileDataURL(attachment.file),
        },
      ],
      status: { type: 'complete' },
    }
  },
  async remove() {
    // noop
  },
}

export default edenImageAttachmentAdapter
