'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Moon, MoonIcon, Sun, SunIcon, SunMoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

type Props = {
  label?: string
}

export function ThemeToggle({ label }: Props) {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex justify-start p-0 m-0 py-1.5 px-2 w-full h-8 font-normal"
        >
          <div className="relative">
            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-0 mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </div>
          {label ? <div>{label}</div> : null}
          <span className="sr-only">Toggle theme</span>
          {/*<DropdownMenuShortcut>⇧T</DropdownMenuShortcut>*/}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-muted">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={`cursor-pointer ${theme === 'light' ? 'font-bold' : ''}`}
        >
          <SunIcon className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={`cursor-pointer ${theme === 'dark' ? 'font-bold' : ''}`}
        >
          <MoonIcon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={`cursor-pointer ${theme === 'system' ? 'font-bold' : ''}`}
        >
          <SunMoonIcon className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
