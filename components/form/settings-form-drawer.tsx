import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Settings2Icon } from 'lucide-react'

const SettingsFormDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2">
          <Settings2Icon className="h-4 w-4" />
          Settings
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Settings2Icon />
            Settings
          </DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          {/*<Button>Submit</Button>*/}
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default SettingsFormDrawer
