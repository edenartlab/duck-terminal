import slugify from 'slugify'

export const generateFilename = (...args: (string | number | undefined)[]) => {
  return slugify(args.join('_') || '', {
    trim: true,
    locale: 'en',
    strict: true,
  })
}

export const slugifyName = (name: string) => {
  return slugify(name, {
    trim: true,
    locale: 'en',
    strict: true,
    lower: true,
  })
}
