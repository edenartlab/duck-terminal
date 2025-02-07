//forms.ts
import { ToolParameterUnionType, ToolParameterV2 } from '@edenlabs/eden-sdk'
import {
  ZodArray,
  ZodBoolean,
  ZodDefault,
  ZodNumber,
  ZodOptional,
  ZodString,
  ZodTypeAny,
  z,
} from 'zod'

function defaultHelper<T extends ZodTypeAny>(
  schema: T,
  defaultValue: string | number | null | undefined | boolean,
): (T & ZodDefault<T>) | T {
  if (defaultValue !== undefined && defaultValue !== null) {
    return schema.default(defaultValue) as T & ZodDefault<T>
  }
  return schema
}

function optionalHelper<T extends ZodTypeAny>(
  schema: T,
  isOptional: boolean,
): (T & ZodOptional<T>) | T {
  if (isOptional) {
    return schema.optional() as T & ZodOptional<T>
  }
  return schema
}

function createNumberSchema(
  parameter: ToolParameterV2,
): ZodNumber | ZodOptional<ZodNumber> | ZodDefault<ZodNumber> {
  let schema: z.ZodNumber = z.number()

  if (parameter.minimum !== undefined && parameter.minimum !== null) {
    schema = schema.min(parameter.minimum)
  }

  if (parameter.maximum !== undefined && parameter.maximum !== null) {
    schema = schema.max(parameter.maximum)
  }

  if (parameter.schema.type === 'integer') {
    //@ts-expect-error: refine returns ZodEffect<ZodType> which confused things
    schema = schema.refine(Number.isInteger, 'Must be an integer')
  }

  schema = defaultHelper(schema, parameter.default)
  schema = optionalHelper(schema, !parameter.required)

  return schema
}

function createBoolSchema(
  parameter: ToolParameterV2,
): ZodBoolean | ZodOptional<ZodBoolean> | ZodDefault<ZodBoolean> {
  let schema: ZodBoolean = z.boolean()

  schema = defaultHelper(schema, parameter.default)
  schema = optionalHelper(schema, !parameter.required)

  return schema
}

function createStringSchema(
  parameter: ToolParameterV2,
): ZodString | ZodOptional<ZodString> | ZodDefault<ZodString> {
  let schema: ZodString = z.string()

  if (parameter.min_length !== undefined && parameter.min_length !== null) {
    schema = schema.min(
      parameter.min_length,
      `Must be at least ${parameter.min_length} characters long`,
    )
  }
  if (parameter.max_length !== undefined && parameter.max_length !== null) {
    schema = schema.max(
      parameter.max_length,
      `Must be less than ${parameter.max_length} characters long`,
    )
  }

  schema = defaultHelper(schema, parameter.default)
  schema = optionalHelper(schema, !parameter.required)

  return schema
}

function createFileUrlSchema(
  parameter: ToolParameterV2,
): ZodString | ZodOptional<ZodString> | ZodDefault<ZodString> {
  let schema: ZodString = z.string()

  schema = defaultHelper(schema, parameter.default)
  schema = optionalHelper(schema, !parameter.required)

  return schema
}

function createArraySchema(
  parameter: ToolParameterV2,
  itemSchema: ZodTypeAny,
):
  | ZodArray<ZodTypeAny>
  | ZodOptional<ZodArray<ZodTypeAny>>
  | ZodDefault<ZodArray<ZodTypeAny>> {
  let schema: ZodArray<ZodTypeAny> = z.array(itemSchema)

  if (parameter.min_length !== undefined && parameter.min_length !== null) {
    schema = schema.min(
      parameter.min_length,
      `Must provide at least ${parameter.min_length} items`,
    )
  }
  if (parameter.max_length !== undefined && parameter.max_length !== null) {
    schema = schema.max(
      parameter.max_length,
      `Must provide less than ${parameter.max_length} items`,
    )
  }

  schema = defaultHelper(schema, parameter.default)
  schema = optionalHelper(schema, !parameter.required)

  return schema
}

function createUnionSchema(
  parameter: ToolParameterV2,
  unionSchema: ToolParameterUnionType,
): ZodTypeAny {
  const schemas = unionSchema.anyOf.map(subSchema => {
    if ('type' in subSchema) {
      return createZodParameterSchema({ ...parameter, schema: subSchema })
    }
    throw new Error('Unsupported schema type in union')
  })

  return z.union(schemas as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]])
}

export function createZodParameterSchema(
  parameter: ToolParameterV2,
): ZodTypeAny {
  if (parameter.schema.type) {
    switch (parameter.schema.type) {
      case 'integer':
      case 'float':
        return createNumberSchema(parameter)
      case 'boolean':
        return createBoolSchema(parameter)
      case 'string':
        return createStringSchema(parameter)
      case 'image':
      case 'video':
      case 'audio':
      case 'archive':
      case 'lora':
        return createFileUrlSchema(parameter)
      case 'array':
        if (parameter.schema.items) {
          return createArraySchema(
            parameter,
            createZodParameterSchema({
              ...parameter,
              schema: parameter.schema.items,
            }),
          )
        }
        throw new Error('Array schema must have items')
      default:
        throw new Error(
          `${parameter.name}: ${parameter.schema.type} not supported.`,
        )
    }
  } else if (parameter.schema.anyOf) {
    return createUnionSchema(parameter, { anyOf: parameter.schema.anyOf })
  }

  throw new Error('Unsupported schema structure')
}

export function createZodFormSchema(
  parameters: ToolParameterV2[],
): z.ZodObject<{}, 'strip', z.ZodTypeAny> {
  // Reduce parameters into a Zod schema object
  const schemaObj = parameters.reduce<Record<string, ZodTypeAny>>(
    (prev, curr) => {
      if (curr.name === 'mask_image' || curr.name === 'masking_prompt') {
        curr.required = false
      }

      prev[curr.name] = createZodParameterSchema(curr)

      return prev
    },
    {},
  )

  let schema = z.object(schemaObj)

  // Masking Tool: Add custom validation logic for mask_image and masking_prompt
  if ('mask_image' in schemaObj && 'masking_prompt' in schemaObj) {
    //@ts-expect-error: refine returns ZodEffect<ZodType> which confused things
    schema = schema.superRefine((data, ctx) => {
      if (!data.mask_image?.trim() && !data.masking_prompt?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Either image or prompt or both must have a value',
          path: ['mask_image'],
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Either image or prompt or both must have a value',
          path: ['masking_prompt'],
        })
        return z.NEVER
      }
      if (data.mask_image && data.masking_prompt) {
        // Add any additional complex validation logic if necessary
      }
    })
  }

  return schema
}

export function getDefaultNameValueMap(parameters?: ToolParameterV2[]) {
  return (parameters || []).reduce((accum, currParameter) => {
    return {
      ...accum,
      [currParameter.name]: currParameter.default,
    }
  }, {})
}
