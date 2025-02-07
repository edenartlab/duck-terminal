import TypographyH4 from '@/components/ui/typography/TypographyH4'
import ManageAccountCard from '@/features/account/manage-account-card'
import React from 'react'

const SettingsAccountPage = async () => {
  return (
    <>
      <TypographyH4>Account</TypographyH4>
      <ManageAccountCard />
    </>
  )
}

export default SettingsAccountPage
