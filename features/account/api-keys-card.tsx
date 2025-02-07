'use client'

import CopyTextButton from '@/components/text/copy-text-button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import TypographyH5 from '@/components/ui/typography/TypographyH5'
import { useApiKeysQuery } from '@/hooks/query/use-api-keys-query'
import { useAuthState } from '@/hooks/use-auth-state'
import { handleAxiosServerError } from '@/lib/fetcher'
import { SubscriptionTier } from '@edenlabs/eden-sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import dayjs from 'dayjs'
import { Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const generateApiKeySchema = z.object({
  note: z.string().optional(),
})

type GenerateApiKeyDto = z.infer<typeof generateApiKeySchema>

const ApiKeysCard = () => {
  const { hasMinimumSubscriptionTier } = useAuthState()
  const hasApiAccessPermission = React.useMemo(
    () => hasMinimumSubscriptionTier(SubscriptionTier.Pro),
    [hasMinimumSubscriptionTier],
  )

  const { apiKeys: apiKeysResponse, invalidate } = useApiKeysQuery()
  const [isGenerateApiKeyDialogOpen, setIsGenerateApiKeyDialogOpen] =
    React.useState(false)

  const generateApiKeyForm = useForm<GenerateApiKeyDto>({
    resolver: zodResolver(generateApiKeySchema),
    defaultValues: {
      note: '',
    },
  })

  if (!apiKeysResponse) {
    return null
  }

  const onSubmitGenerateApiKey = async (data: GenerateApiKeyDto) => {
    try {
      await axios.post(`/api/apikeys`, {
        note: data.note,
      })
      invalidate()
      generateApiKeyForm.reset()
      setIsGenerateApiKeyDialogOpen(false)
    } catch (error) {
      handleAxiosServerError(error)
    }
  }

  const onDeleteApiKey = async (apiKey: string) => {
    try {
      await axios.delete(`/api/apikeys`, {
        data: {
          apiKey,
        },
      })
      invalidate()
    } catch (error) {
      handleAxiosServerError(error)
    }
  }

  return (
    <Card className="max-w-[calc(100vw-32px)]">
      <CardHeader>
        <CardTitle>Create</CardTitle>
        <CardDescription>Manage API keys for your account</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasApiAccessPermission ? (
          <div className="bg-accent text-gray-500 p-2 rounded-lg">
            <div>Only pro+ subscribers can create API keys.</div>
            <div>
              Please upgrade your{' '}
              <Link
                href="/settings/subscription"
                className="font-bold hover:text-gray-300 transition-colors"
              >
                subscription
              </Link>
              .
            </div>
          </div>
        ) : apiKeysResponse.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2}>Note</TableHead>
                <TableHead>Date created</TableHead>
                <TableHead>Key</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeysResponse.map(apiKey => (
                <TableRow key={apiKey.apiKey}>
                  <TableCell className="font-medium" colSpan={2}>
                    {apiKey.note || '-'}
                  </TableCell>
                  <TableCell>
                    {dayjs(apiKey.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    {apiKey.apiKey.slice(0, 10)}...
                    <CopyTextButton
                      title={'API key'}
                      text={`${apiKey.apiKey.slice(0, 16)}...`}
                      copyContent={apiKey.apiKey}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      title="Delete"
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        onDeleteApiKey(apiKey.apiKey)
                      }}
                    >
                      <Trash2Icon size={12} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center">
            <TypographyH5>You don't have any API keys yet</TypographyH5>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Dialog
          open={isGenerateApiKeyDialogOpen}
          onOpenChange={setIsGenerateApiKeyDialogOpen}
        >
          <Button
            variant="secondary"
            disabled={!hasApiAccessPermission}
            onClick={() => setIsGenerateApiKeyDialogOpen(true)}
          >
            Generate new API key
          </Button>
          <DialogContent className="max-w-[calc(100%-32px)] sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Generate new API key</DialogTitle>
            </DialogHeader>
            <Form {...generateApiKeyForm}>
              <form
                onSubmit={generateApiKeyForm.handleSubmit(
                  onSubmitGenerateApiKey,
                )}
                className="space-y-4"
              >
                <FormField
                  control={generateApiKeyForm.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note for your API key</FormLabel>
                      <FormControl>
                        <Input placeholder="Backend API key..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button disabled={generateApiKeyForm.formState.isSubmitting}>
                    Generate
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

export default ApiKeysCard
