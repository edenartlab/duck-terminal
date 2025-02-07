import DiscordAuthButton from '@/components/button/discord-auth-button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import TypographyH4 from '@/components/ui/typography/TypographyH4'

const SettingsIntegrationsPage = () => {
  return (
    <>
      <TypographyH4>Integrations</TypographyH4>
      <Card>
        <CardHeader>
          <CardTitle>Discord</CardTitle>
          <CardDescription>
            Connect your Discord account to Eden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DiscordAuthButton />
        </CardContent>
      </Card>
    </>
  )
}

export default SettingsIntegrationsPage
