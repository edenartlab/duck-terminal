import AttachToFeedbackButton from '@/components/attach-to-feedback-button'
import EdenLogoBw from '@/components/logo/eden-logo-bw'
import DesktopHeaderNav from '@/components/navigation/desktop-header-nav'
import HeaderNavLinks from '@/components/navigation/header-nav-links'
import MobileHeaderNav from '@/components/navigation/mobile-header-nav'
import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { MenuIcon } from 'lucide-react'

const HeaderNav = () => {
  return (
    <div className="w-full">
      <DesktopHeaderNav>
        <HeaderNavLinks />
        <AttachToFeedbackButton className="ml-auto" />
      </DesktopHeaderNav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="shrink-0 md:hidden justify-around w-16"
            size="icon"
            variant="outline"
          >
            <EdenLogoBw className="w-[24px]" />
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>Main Navigation</DialogTitle>
              <DialogDescription>List of main nav items</DialogDescription>
            </DialogHeader>
          </VisuallyHidden>
          <MobileHeaderNav>
            <HeaderNavLinks inSheet={true} />
            <AttachToFeedbackButton />
          </MobileHeaderNav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default HeaderNav
