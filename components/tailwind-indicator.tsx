export function TailwindIndicator() {
  return (
    <div className="pointer-events-none opacity-40 fixed bottom-1 left-1 z-50 flex size-6 items-center justify-center rounded-full bg-popover p-3 font-mono text-xs text-popover-foreground border border-popover-foreground/40">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
        sm
      </div>
      <div className="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</div>
      <div className="hidden lg:block xl:hidden 2xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  )
}
