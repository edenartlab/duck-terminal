import {
  createZodFormSchema,
  createZodParameterSchema,
  getDefaultNameValueMap,
} from './forms'
import { ToolParameterV2 } from '@edenlabs/eden-sdk'
import { describe, expect, it } from '@jest/globals'
import { SafeParseSuccess } from 'zod'

describe('forms', () => {
  describe('createZodParameterSchema', () => {
    it('creates a number schema with a minimum and maximum', () => {
      const parameter: ToolParameterV2 = {
        name: 'numberParam',
        label: 'Number Parameter',
        description: 'A number parameter',
        tip: null,
        schema: {
          type: 'integer',
        },
        required: true,
        default: null,
        minimum: 1,
        maximum: 10,
        min_length: null,
        max_length: null,
        step: null,
        choices: null,
        choices_labels: null,
      }

      const schema = createZodParameterSchema(parameter)
      expect(schema.safeParse(5).success).toBe(true)
      expect(schema.safeParse(0).success).toBe(false)
      expect(schema.safeParse(11).success).toBe(false)
    })

    it('creates a boolean schema with default value', () => {
      const parameter: ToolParameterV2 = {
        name: 'boolParam',
        label: 'Boolean Parameter',
        description: 'A boolean parameter',
        tip: null,
        schema: {
          type: 'boolean',
        },
        required: false,
        default: true,
        minimum: null,
        maximum: null,
        min_length: null,
        max_length: null,
        step: null,
        choices: null,
        choices_labels: null,
      }

      const schema = createZodParameterSchema(parameter)
      expect(schema.safeParse(true).success).toBe(true)
      expect(schema.safeParse(true).data).toBe(true)
      expect(schema.safeParse(false).success).toBe(true)
      expect(schema.safeParse(false).data).toBe(false)
    })

    it('creates a string schema with min and max length', () => {
      const parameter: ToolParameterV2 = {
        name: 'stringParam',
        label: 'String Parameter',
        description: 'A string parameter',
        tip: null,
        schema: {
          type: 'string',
        },
        required: true,
        default: null,
        minimum: null,
        maximum: null,
        min_length: 3,
        max_length: 5,
        step: null,
        choices: null,
        choices_labels: null,
      }

      const schema = createZodParameterSchema(parameter)
      expect(schema.safeParse('abc').success).toBe(true)
      expect(schema.safeParse('ab').success).toBe(false)
      expect(schema.safeParse('abcdef').success).toBe(false)
    })

    it('creates a string array schema with min and max length', () => {
      const parameter: ToolParameterV2 = {
        name: 'stringParam',
        label: 'String Parameter',
        description: 'A string parameter',
        tip: null,
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        required: true,
        default: null,
        minimum: null,
        maximum: null,
        min_length: 3,
        max_length: 5,
        step: null,
        choices: null,
        choices_labels: null,
      }

      const schema = createZodParameterSchema(parameter)
      expect(schema.safeParse(['abc', '456', 'bcdsa']).success).toBe(true)
      expect(schema.safeParse(['abc']).success).toBe(false)
      expect(
        schema.safeParse(['abc', '456', 'bcdsa', '1fqfw', '2412', 'twetewet'])
          .success,
      ).toBe(false)
      expect(schema.safeParse('abcdef').success).toBe(false)
    })

    it('creates a file schema for type image', () => {
      const parameter: ToolParameterV2 = {
        name: 'fileParam',
        label: 'File Parameter',
        description: 'A file parameter',
        tip: null,
        schema: {
          type: 'image',
        },
        required: true,
        default: null,
        minimum: null,
        maximum: null,
        min_length: null,
        max_length: null,
        step: null,
        choices: null,
        choices_labels: null,
      }

      const schema = createZodParameterSchema(parameter)
      expect(schema.safeParse('file1').success).toBe(true)
      expect(schema.safeParse('file1').data).toBe('file1')
      expect(schema.safeParse(['file1', 'file2']).success).toBe(false)
    })

    it('creates a file schema for union type image + video', () => {
      const parameter: ToolParameterV2 = {
        name: 'fileParam',
        label: 'File Parameter',
        description: 'A file parameter',
        tip: null,
        schema: {
          anyOf: [{ type: 'image' }, { type: 'video' }],
        },
        required: true,
        default: null,
        minimum: null,
        maximum: null,
        min_length: null,
        max_length: null,
        step: null,
        choices: null,
        choices_labels: null,
      }

      const schema = createZodParameterSchema(parameter)
      expect(schema.safeParse('file1').success).toBe(true)
      expect(schema.safeParse('file1').data).toBe('file1')
      expect(schema.safeParse(['file1', 'file2']).success).toBe(false)
    })

    it('creates a file array schema for type image', () => {
      const parameter: ToolParameterV2 = {
        name: 'fileArrayParam',
        label: 'File Array Parameter',
        description: 'A file array parameter',
        tip: null,
        schema: {
          type: 'array',
          items: {
            type: 'image',
          },
        },
        required: true,
        default: null,
        minimum: null,
        maximum: null,
        min_length: 1,
        max_length: 5,
        step: null,
        choices: null,
        choices_labels: null,
      }

      const schema = createZodParameterSchema(parameter)
      expect(schema.safeParse(['image1', 'image2']).success).toBe(true)
      expect(schema.safeParse([]).success).toBe(false)
      expect(schema.safeParse('image1').success).toBe(false)
      expect(
        schema.safeParse([
          'image1',
          'image2',
          'image3',
          'image4',
          'image5',
          'image6',
        ]).success,
      ).toBe(false)
    })

    it('creates a file array schema for type image or video', () => {
      const parameter: ToolParameterV2 = {
        name: 'fileArrayParamMixed',
        label: 'File Array Parameter Mixed',
        description: 'A file array parameter mixed',
        tip: null,
        schema: {
          type: 'array',
          items: {
            anyOf: [{ type: 'image' }, { type: 'video' }],
          },
        },
        required: true,
        default: null,
        minimum: null,
        maximum: null,
        min_length: 1,
        max_length: 5,
        step: null,
        choices: null,
        choices_labels: null,
      }

      const schema = createZodParameterSchema(parameter)
      expect(schema.safeParse(['image1', 'video1']).success).toBe(true)
      expect(schema.safeParse([]).success).toBe(false)
      expect(
        schema.safeParse([
          'image1',
          'video1',
          'image2',
          'video2',
          'video3',
          'video4',
        ]).success,
      ).toBe(false)
    })

    it('throws an error for unsupported parameter types', () => {
      const parameter: ToolParameterV2 = {
        name: 'unsupportedParam',
        label: 'Unsupported Parameter',
        description: 'An unsupported parameter',
        tip: null,
        schema: {
          //@ts-expect-error TS2322: Type 'unsupported' is not assignable to type GeneratorParameterType
          type: 'unsupported',
        },
        required: true,
        default: null,
        minimum: null,
        maximum: null,
        min_length: null,
        max_length: null,
        step: null,
        choices: null,
        choices_labels: null,
      }

      expect(() => createZodParameterSchema(parameter)).toThrow(
        'unsupported not supported.',
      )
    })

    it('throws an error for unsupported items in array parameter types', () => {
      const parameter: ToolParameterV2 = {
        name: 'unsupportedArrayParam',
        label: 'Unsupported Parameter',
        description: 'An unsupported parameter',
        tip: null,
        schema: {
          type: 'array',
          items: {
            //@ts-expect-error TS2322: Type 'unsupported' is not assignable to type GeneratorParameterType
            type: 'unsupported',
          },
        },
        required: true,
        default: null,
        minimum: null,
        maximum: null,
        min_length: null,
        max_length: null,
        step: null,
        choices: null,
        choices_labels: null,
      }

      expect(() => createZodParameterSchema(parameter)).toThrow(
        'unsupported not supported.',
      )
    })
  })

  describe('createZodFormSchema', () => {
    it('creates a form schema with multiple parameters', () => {
      const parameters: ToolParameterV2[] = [
        {
          name: 'param1',
          label: 'Parameter 1',
          description: 'First parameter',
          tip: null,
          schema: {
            type: 'integer',
          },
          required: true,
          default: 5,
          minimum: 1,
          maximum: 10,
          min_length: null,
          max_length: null,
          step: null,
          choices: null,
          choices_labels: null,
        },
        {
          name: 'param2',
          label: 'Parameter 2',
          description: 'Second parameter',
          tip: null,
          schema: {
            type: 'string',
          },
          required: false,
          default: 'default',
          minimum: null,
          maximum: null,
          min_length: 3,
          max_length: 10,
          step: null,
          choices: null,
          choices_labels: null,
        },
        {
          name: 'fileParam',
          label: 'File Parameter Mixed',
          description: 'A mixed file parameter',
          tip: null,
          schema: {
            anyOf: [{ type: 'image' }, { type: 'video' }],
          },
          required: true,
          default: null,
          minimum: null,
          maximum: null,
          min_length: null,
          max_length: null,
          step: null,
          choices: null,
          choices_labels: null,
        },
        {
          name: 'fileArrayParam',
          label: 'File Array Parameter',
          description: 'A file array parameter',
          tip: null,
          schema: {
            type: 'array',
            items: { type: 'image' },
          },
          required: true,
          default: null,
          minimum: null,
          maximum: null,
          min_length: 1,
          max_length: 5,
          step: null,
          choices: null,
          choices_labels: null,
        },
        {
          name: 'fileArrayParamMixed',
          label: 'File Array Parameter Mixed',
          description: 'A file array parameter mixed',
          tip: null,
          schema: {
            type: 'array',
            items: {
              anyOf: [{ type: 'image' }, { type: 'video' }],
            },
          },
          required: true,
          default: null,
          minimum: null,
          maximum: null,
          min_length: 1,
          max_length: 5,
          step: null,
          choices: null,
          choices_labels: null,
        },
      ]

      const schema = createZodFormSchema(parameters)
      type Params = {
        param1: number
        param2: string
        fileParam: string
        fileArrayParam: string[]
        fileArrayParamMixed: string[]
      }
      const parsed = schema.safeParse({
        param1: 5,
        param2: 'hello',
        fileParam: 'image',
        fileArrayParam: ['image1', 'image2'],
        fileArrayParamMixed: ['image1', 'video1'],
      })

      const parsedSuccess = parsed as SafeParseSuccess<Params>

      expect(parsedSuccess.success).toBe(true)
      expect(parsedSuccess.data.param1).toBe(5)
      expect(parsedSuccess.data.param2).toBe('hello')
      expect(parsedSuccess.data.fileParam).toBe('image')
      expect(parsedSuccess.data.fileArrayParam).toEqual(['image1', 'image2'])
      expect(parsedSuccess.data.fileArrayParamMixed).toEqual([
        'image1',
        'video1',
      ])
    })
  })

  describe('getDefaultNameValueMap', () => {
    it('returns a default name-value map for given parameters', () => {
      const parameters: ToolParameterV2[] = [
        {
          name: 'param1',
          label: 'Parameter 1',
          description: 'First parameter',
          tip: null,
          schema: {
            type: 'integer',
          },
          required: true,
          default: 5,
          minimum: 1,
          maximum: 10,
          min_length: null,
          max_length: null,
          step: null,
          choices: null,
          choices_labels: null,
        },
        {
          name: 'param2',
          label: 'Parameter 2',
          description: 'Second parameter',
          tip: null,
          schema: {
            type: 'string',
          },
          required: false,
          default: 'default',
          minimum: null,
          maximum: null,
          min_length: 3,
          max_length: 10,
          step: null,
          choices: null,
          choices_labels: null,
        },
      ]

      const defaultMap = getDefaultNameValueMap(parameters)
      expect(defaultMap).toEqual({ param1: 5, param2: 'default' })
    })
  })
})
