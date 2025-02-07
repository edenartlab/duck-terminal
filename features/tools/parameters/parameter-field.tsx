import FormItemHead from '@/components/form/form-item-head'
import FormItemWrap from '@/components/form/form-item-wrap'
import ModelSelector from '@/components/form/input/model-selector'
import SelectInput from '@/components/form/input/select-input'
import SliderInput from '@/components/form/input/slider-input'
import StringArrayInput from '@/components/form/input/string-array-input'
import { TextInput } from '@/components/form/input/text-input'
import LoadingIndicator from '@/components/loading-indicator'
import FileUploader from '@/components/media/file-uploader'
import { AutosizeTextarea } from '@/components/ui/custom/autoresize-textarea'
import { SwitchNoButton } from '@/components/ui/custom/switch-no-button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MaskingCanvasDialog } from '@/features/tools/masking-canvas-dialog'
import { cn } from '@/lib/utils'
import {
  ToolParameterTypeValue,
  ToolParameterUnionType,
  ToolParameterV2,
  ToolV2,
} from '@edenlabs/eden-sdk'
import { ReactNode, Suspense } from 'react'
import { UseFormReturn } from 'react-hook-form'

type Props = {
  parameter: ToolParameterV2
  tool: ToolV2
  form: UseFormReturn
  icon?: ReactNode
  className?: string
}

const maskPainterParameterNames = ['mask_image', 'control_input']

const isSchemaType = (
  parameter: ToolParameterV2,
  type: ToolParameterTypeValue,
) => parameter.schema.type === type
const getSchemaType = (parameter: ToolParameterV2) => {
  if ('type' in parameter.schema) {
    return parameter.schema.type
  }
}
const isSchemaArrayType = (parameter: ToolParameterV2) =>
  parameter.schema.type === 'array'
const getSchemaArrayItemType = (parameter: ToolParameterV2) => {
  if (parameter.schema.items && 'type' in parameter.schema.items) {
    return parameter.schema.items.type
  }
  if (parameter.schema.items && 'anyOf' in parameter.schema.items) {
    return 'anyOf'
  }
}
const isSchemaAnyOfType = (parameter: ToolParameterV2) =>
  Array.isArray(parameter.schema.anyOf)
const getSchemaAnyOfTypes = (parameter: ToolParameterV2) =>
  parameter.schema.anyOf?.map(item => item.type)

const ParameterField = ({ parameter, tool, form, icon, className }: Props) => {
  const { name, label } = parameter

  return (
    <FormField
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value, name } = field

        // handle number input
        if (isSchemaType(parameter, 'integer')) {
          if (parameter.name === 'seed') {
            const parsedValue = +value ? +value : undefined
            return (
              <FormItemWrap
                name={name}
                label={label}
                description={parameter.description}
                errorMessage={fieldState.error?.message}
                className={className}
              >
                <Input
                  id={name}
                  type="number"
                  onChange={e =>
                    // @todo: handle as big number
                    onChange(
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  onBlur={onBlur}
                  value={parsedValue}
                />
              </FormItemWrap>
            )
          }

          return (
            <FormItemWrap
              name={name}
              label={label}
              description={parameter.description}
              errorMessage={fieldState.error?.message}
              className={className}
            >
              {parameter.choices && parameter.choices.length ? (
                <SelectInput
                  placeholder={label}
                  label={label}
                  onChange={onChange}
                  value={value}
                  options={parameter.choices}
                  optionLabels={parameter.choices_labels || undefined}
                  type="integer"
                />
              ) : (
                <SliderInput
                  type="integer"
                  min={parameter.minimum || 0}
                  max={parameter.maximum || 1}
                  step={parameter.step || 1}
                  value={value}
                  onChange={onChange}
                />
              )}
            </FormItemWrap>
          )
        }

        if (isSchemaType(parameter, 'float')) {
          return (
            <FormItemWrap
              name={name}
              label={label}
              description={parameter.description}
              errorMessage={fieldState.error?.message}
              className={className}
            >
              <SliderInput
                type="float"
                min={parameter.minimum || 0}
                max={parameter.maximum || 1}
                step={parameter.step || 0.05}
                value={value}
                onChange={onChange}
              />
            </FormItemWrap>
          )
        }

        // handle boolean input
        if (isSchemaType(parameter, 'boolean')) {
          return (
            <FormItem
              className={cn([
                'flex flex-row items-center justify-between rounded-lg p-4',
                className,
              ])}
              data-test-id={parameter.name}
            >
              <FormItemHead
                icon={icon}
                label={label}
                description={parameter.description}
              />
              <FormControl id={name} className="ml-4">
                <SwitchNoButton
                  className="!mt-0 data-[state=unchecked]:!bg-gray-400 data-[state=unchecked]:dark:!bg-gray-700"
                  checked={value}
                  onCheckedChange={onChange}
                />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )
        }

        // handle string input
        if (isSchemaType(parameter, 'string')) {
          if (
            name === 'prompt' ||
            name === 'negative_prompt' ||
            name === 'text_input'
          ) {
            return (
              <FormItem
                className={`mt-0 !p-4 ${
                  parameter.required ? '!pt-4' : '!pt-3'
                }`}
                data-test-id={parameter.name}
              >
                {parameter.required ? (
                  <FormLabel className="sr-only">{label}</FormLabel>
                ) : (
                  <FormItemHead
                    label={label}
                    description={parameter.description}
                  />
                )}
                <FormControl id={name}>
                  <AutosizeTextarea
                    spellCheck={false}
                    placeholder={parameter.description}
                    className={`!ml-0 border-0 resize-none overflow-hidden rounded-lg ${
                      parameter.required
                        ? '!outline-none !p-4 !pt-2 !mt-0'
                        : 'rounded-lg border p-2 '
                    }`}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value || ''}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )
          }

          return (
            <FormItemWrap
              name={name}
              label={label}
              description={parameter.description}
              errorMessage={fieldState.error?.message}
            >
              {parameter.choices && parameter.choices.length ? (
                <SelectInput
                  placeholder={label}
                  label={label}
                  onChange={onChange}
                  value={value}
                  options={parameter.choices}
                  optionLabels={parameter.choices_labels || undefined}
                  type="string"
                />
              ) : (
                <TextInput
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value || ''}
                />
              )}
            </FormItemWrap>
          )
        }

        // handle lora input
        if (isSchemaType(parameter, 'lora')) {
          const parsedValue = typeof value !== 'string' ? '' : value
          return (
            <FormItem className="mt-0 !p-4 !pt-2" data-test-id={parameter.name}>
              <FormItemHead label={label} description={parameter.description} />
              <FormControl id={name}>
                <Input
                  className={'hidden'}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={parsedValue}
                />
              </FormControl>
              <Suspense fallback={<LoadingIndicator />}>
                <ModelSelector
                  base_model={
                    tool.base_model === 'sdxl'
                      ? ['sdxl', 'JuggernautXL_v6']
                      : tool.base_model
                  }
                  value={parsedValue}
                  onChange={onChange}
                />
              </Suspense>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )
        }

        if (
          isSchemaAnyOfType(parameter) ||
          isSchemaType(parameter, 'video') ||
          isSchemaType(parameter, 'image') ||
          isSchemaType(parameter, 'audio') ||
          isSchemaType(parameter, 'archive')
        ) {
          const types = getSchemaAnyOfTypes(parameter) || [
            getSchemaType(parameter) || 'image',
          ]
          if (
            types?.includes('image') ||
            types?.includes('video') ||
            types?.includes('audio') ||
            types?.includes('archive')
          ) {
            return (
              <FormItem
                className="mt-0 !p-4 !pt-2"
                data-test-id={parameter.name}
              >
                <FormItemHead
                  label={label}
                  description={parameter.description}
                />
                <FormControl id={name}>
                  <TextInput
                    className={'hidden'}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value === null ? '' : value || ''}
                  />
                </FormControl>
                <div className="flex flex-col gap-2 items-center w-full">
                  {/* // supports mask painter */}
                  {maskPainterParameterNames.includes(parameter.name) ? (
                    <>
                      <MaskingCanvasDialog
                        form={form}
                        parameter={parameter}
                        onChange={onChange}
                      />
                      <div className="font-bold">or</div>
                    </>
                  ) : null}
                  <FileUploader
                    value={value === null ? '' : value || ''}
                    onChange={onChange}
                    allowedFileTypes={types}
                    maxFiles={1}
                    allowMultiple={false}
                    enableDropFromTimeline={!tool.key.includes('trainer')}
                    className={'w-full'}
                  />
                </div>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )
          }
        }

        // handle array input
        if (isSchemaArrayType(parameter)) {
          const arrayItemType = getSchemaArrayItemType(parameter)
          // handle string array input
          if (arrayItemType === 'string') {
            return (
              <FormItem
                className="mt-0 !p-4 !pt-2"
                data-test-id={parameter.name}
              >
                <FormItemHead
                  label={label}
                  description={parameter.description}
                />
                <FormControl id={name}>
                  <TextInput
                    className={'hidden'}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value === null ? '' : value || ''}
                  />
                </FormControl>
                <StringArrayInput
                  minLength={
                    parameter.required
                      ? parameter.min_length !== undefined &&
                        parameter.min_length !== null
                        ? parameter.min_length
                        : 0
                      : 1
                  }
                  maxLength={parameter.max_length || 256}
                  onChange={onChange}
                  value={value === null ? [] : value || ['']}
                />
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )
          }

          // Handle array of images or videos, or a single archive
          if (
            arrayItemType === 'image' ||
            arrayItemType === 'video' ||
            arrayItemType === 'audio' ||
            arrayItemType === 'archive' ||
            arrayItemType === 'anyOf'
          ) {
            const types =
              arrayItemType === 'anyOf'
                ? (
                    parameter.schema?.items as ToolParameterUnionType
                  )?.anyOf.map(type => type.type)
                : [arrayItemType]

            if (
              types?.includes('image') ||
              types?.includes('video') ||
              types?.includes('audio') ||
              types?.includes('archive')
            ) {
              return (
                <FormItem
                  className="mt-0 !p-4 !pt-2"
                  data-test-id={parameter.name}
                >
                  <FormItemHead
                    label={label}
                    description={parameter.description}
                  />
                  <FormControl id={name}>
                    <Input
                      className={'hidden'}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value === null ? '' : value || ''}
                    />
                  </FormControl>
                  <FileUploader
                    value={value ?? []}
                    onChange={onChange}
                    allowedFileTypes={types}
                    maxFiles={
                      parameter.max_length === null ||
                      parameter.max_length === undefined
                        ? 256
                        : parameter.max_length || 1
                    }
                    allowMultiple={true}
                    enableDropFromTimeline={!tool.key.includes('trainer')}
                  />
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )
            }
          }
        }

        return (
          <FormItemWrap
            name={name}
            label={label}
            description={parameter.description}
            errorMessage={fieldState.error?.message}
          >
            <>
              {/*{JSON.stringify(parameter.schema)}*/}
              <TextInput
                onChange={onChange}
                onBlur={onBlur}
                value={value === null ? '' : value}
              />
            </>
          </FormItemWrap>
        )
      }}
    />
  )
}

export default ParameterField
