import ParameterField from './parameter-field'
import { Form } from '@/components/ui/form'
import { ToolParameterV2, ToolV2 } from '@edenlabs/eden-sdk'
import { describe, expect, it } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'

describe('ParameterField Component', () => {
  const TestWrapper = ({
    parameter,
    tool,
    value = '',
  }: {
    parameter: ToolParameterV2
    tool: ToolV2
    value?: string
  }) => {
    const form = useForm({
      defaultValues: {
        [parameter.name]: value,
      },
    })

    return (
      <Form {...form}>
        <ParameterField parameter={parameter} tool={tool} form={form} />
      </Form>
    )
  }

  const toolMock: ToolV2 = {
    key: 'sample_tool',
    name: 'sample_tool_name',
    output_type: 'image',
    base_model: 'sdxl',
  }

  it('renders a number input for int parameter type', () => {
    const parameter: ToolParameterV2 = {
      name: 'sample_int',
      label: 'Sample Int',
      schema: { type: 'integer' },
      description: 'An integer parameter',
      required: false,
      tip: 'tip',
      default: null,
    }

    render(<TestWrapper parameter={parameter} tool={toolMock} />)

    const input = screen.getByLabelText(/Sample Int/i)
    expect(input).toBeInTheDocument()
  })

  it('renders a slider for float parameter type', () => {
    const parameter: ToolParameterV2 = {
      name: 'sample_float',
      label: 'Sample Float',
      schema: { type: 'float' },
      description: 'A float parameter',
      minimum: 0,
      maximum: 10,
      step: 0.1,
      required: false,
      tip: 'tip',
      default: null,
    }

    render(<TestWrapper parameter={parameter} tool={toolMock} />)

    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
  })

  it('renders a switch for bool parameter type', () => {
    const parameter: ToolParameterV2 = {
      name: 'sample_bool',
      label: 'Sample Bool',
      schema: { type: 'boolean' },
      description: 'A boolean parameter',
      required: false,
      tip: 'tip',
      default: null,
    }

    render(<TestWrapper parameter={parameter} tool={toolMock} />)

    // const switchInput = screen.getByRole('checkbox')
    const switchInput = screen.getByLabelText(/Sample Bool/i)
    expect(switchInput).toBeInTheDocument()
  })

  it('renders a text input for str parameter type', () => {
    const parameter: ToolParameterV2 = {
      name: 'string',
      label: 'Sample String',
      schema: { type: 'string' },
      description: 'A string parameter',
      required: false,
      tip: 'tip',
      default: null,
    }

    render(<TestWrapper parameter={parameter} tool={toolMock} />)

    const textInput = screen.getByLabelText(/Sample String/i)
    expect(textInput).toBeInTheDocument()
    expect(textInput).toBeInstanceOf(HTMLInputElement)
    expect(textInput).toHaveAttribute('type', 'text')
  })

  it('renders a textarea for prompt-related parameters', () => {
    const parameter: ToolParameterV2 = {
      name: 'prompt',
      label: 'Prompt',
      schema: { type: 'string' },
      description: 'A prompt parameter',
      required: false,
      tip: 'tip',
      default: null,
    }

    render(<TestWrapper parameter={parameter} tool={toolMock} />)

    const textarea = screen.getByPlaceholderText(/A prompt parameter/i)
    expect(textarea).toBeInTheDocument()
    expect(textarea).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('renders a file uploader for image/video/archive parameter type', () => {
    const parameter: ToolParameterV2 = {
      name: 'sample_media',
      label: 'Sample Media',
      schema: {
        anyOf: [{ type: 'image' }, { type: 'video' }, { type: 'archive' }],
      },
      description: 'A media parameter',
      required: false,
      tip: 'tip',
      default: null,
    }

    render(<TestWrapper parameter={parameter} tool={toolMock} />)

    const uploader = screen.getByLabelText(/Sample Media/i)
    expect(uploader).toBeInTheDocument()
  })

  it('renders a string array input for array of strings', () => {
    const parameter: ToolParameterV2 = {
      name: 'sample_str_array',
      label: 'Sample String Array',
      schema: {
        type: 'array',
        items: { type: 'string' },
      },
      description: 'An array of strings',
      required: false,
      tip: 'tip',
      default: null,
    }

    render(<TestWrapper parameter={parameter} tool={toolMock} />)

    const input = screen.getByLabelText(/Sample String Array/i)
    expect(input).toBeInTheDocument()
  })

  it('calls onChange when the input value changes', () => {
    const parameter: ToolParameterV2 = {
      name: 'sample_str',
      label: 'Sample String',
      schema: { type: 'string' },
      description: 'A string parameter',
      required: false,
      tip: 'tip',
      default: null,
    }

    render(
      <TestWrapper parameter={parameter} tool={toolMock} value="initial" />,
    )

    const input = screen.getByLabelText(/Sample String/i)
    fireEvent.change(input, { target: { value: 'new value' } })
    expect(input).toHaveValue('new value')
  })
})
