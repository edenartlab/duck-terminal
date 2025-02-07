import { PropsWithChildren } from 'react'

const TypographyH2 = ({ ...rest }: PropsWithChildren) => {
  return (
    <h1
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
      {...rest}
    />
  )
}

export default TypographyH2
