import EdenLogoBw from '@/components/logo/eden-logo-bw'

type Variant = 'small' | 'medium' | 'large'

const RotatingEdenLogo = ({ variant }: { variant?: Variant }) => {
  return (
    <div
      className={`relative flex items-center justify-center ${
        variant === 'small'
          ? 'h-[36px] w-[36px]'
          : variant === 'medium'
          ? 'h-28 w-28'
          : 'h-[175px] w-[175px]'
      } `}
    >
      <EdenLogoBw />
      {/*<RotatingImage*/}
      {/*  src="/android-chrome-512x512.png"*/}
      {/*  alt="Eden Logo"*/}
      {/*  priority*/}
      {/*  className="absolute !delay-100"*/}
      {/*/>*/}
      {/*<RotatingImage*/}
      {/*  src="/android-chrome-512x512.png"*/}
      {/*  alt="Eden Logo"*/}
      {/*  priority*/}
      {/*  className="absolute !delay-200"*/}
      {/*/>*/}
      {/*<RotatingImage*/}
      {/*  src="/android-chrome-512x512.png"*/}
      {/*  alt="Eden Logo"*/}
      {/*  priority*/}
      {/*  className="absolute !delay-300"*/}
      {/*/>*/}
    </div>
  )
}

export default RotatingEdenLogo
