import { ToolParameterV2 } from '@edenlabs/eden-sdk'
import { Parser } from 'expr-eval'

const regex = /\b[^\d\W]+(\.[^\d\W]+)*\b/g // match words that may contain periods: "(width/1024)/prompts.length * 2"

export const getCostConfig = ({
  parameterNames,
  parameterValues,
}: {
  parameterNames: ToolParameterV2['name'][]
  parameterValues: (string[] | number[] | string[][])[]
}) => {
  return parameterNames.reduce((acc, key, i) => {
    const value = parameterValues[i]
    if (Array.isArray(value)) {
      acc[`${key}_length`] = value.length
    } else if (value !== undefined) {
      acc[key] = value as number
    } else {
      acc[`${key}_length`] = 0
    }
    return acc
  }, {} as Record<string, number>)
}

export const calculateCost = (
  formula: string,
  formValues: Record<string, string[] | number[] | string[][]>,
) => {
  const costParameterNames = [
    ...new Set(formula.match(regex)?.map(m => m.replace('.length', '')) || []),
  ]

  const parameterValues = costParameterNames.map(name => formValues[name])

  const costConfig = getCostConfig({
    parameterNames: costParameterNames,
    parameterValues,
  })

  try {
    return Parser.evaluate(formula, costConfig)
  } catch (e) {
    // console.error('Could not parse cost_estimate', e)
    return Infinity
  }
}
