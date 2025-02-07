import axios, { AxiosRequestConfig } from 'axios'

export const downloadZip = async (config: AxiosRequestConfig) => {
  const response = await axios({
    ...config,
    responseType: 'blob',
  })

  const contentType = response.headers['content-type']
  const contentDisposition = response.headers['content-disposition']

  if (contentType !== 'application/zip') {
    console.error('Unexpected content type:', contentType)
    return
  }

  let fileName = 'eden_downloads.zip' // Default filename
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
    if (fileNameMatch && fileNameMatch[1]) {
      fileName = fileNameMatch[1]
    }
  }

  const blob = new Blob([response.data], { type: 'application/zip' })

  const url = URL.createObjectURL(blob)
  Object.assign(document.createElement('a'), {
    href: url,
    download: fileName,
  }).click()
  URL.revokeObjectURL(url)
}
