export function fileMatchesAccept(
  file: { name: string; type: string },
  acceptString: string,
) {
  // Check if the accept string is "*", which allows any file
  if (acceptString === '*') {
    return true
  }

  // Split the accept string into an array of allowed types
  const allowedTypes = acceptString
    .split(',')
    .map(type => type?.trim()?.toLowerCase())

  // Get the file's extension and MIME type
  const fileExtension = '.' + file.name?.split('.').pop()?.toLowerCase()
  const fileMimeType = file.type?.toLowerCase()

  for (const type of allowedTypes) {
    // Check for file extension match
    if (type.startsWith('.') && type === fileExtension) {
      return true
    }

    // Check for exact MIME type match
    if (type.includes('/') && type === fileMimeType) {
      return true
    }

    if (type === 'image/*' || type === 'video/*' || type === 'audio/*') {
      // Check for wildcard MIME type match
      if (type.endsWith('/*')) {
        const generalType = type.split('/')[0]!
        if (fileMimeType.startsWith(generalType + '/')) {
          return true
        }
      }
    }
  }

  return false
}
