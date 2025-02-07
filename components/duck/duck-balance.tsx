'use client'

import {
    DropdownMenu,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import Image from 'next/image'
const DuckBalance = () => {
    const { isSignedIn } = useAuth()
    const { balance } = useAuth()
    if (!isSignedIn) {
        return null
    }
    return (
        <>
            {
                isSignedIn ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger title="View balances" asChild>
                            <div className="text-xs flex focus:!ring-0">
                                <Image className="rounded-full" src="https://res.cloudinary.com/dqnbi6ctf/image/upload/v1737522933/mechanical_duck_rqoik0.webp" alt="Duck" width={16} height={16} />
                                <div className="ml-2">
                                    {balance}
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                    </DropdownMenu >
                ) :
                    (
                        null
                    )
            }
        </>

    )
}

export default DuckBalance

