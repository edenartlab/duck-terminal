import { ToolParameterV2 } from '@edenlabs/eden-sdk'

export type ParameterGroup = {
  type: 'dependencyGroup' | 'standalone'
  parameter?: ToolParameterV2
  toggle?: ToolParameterV2
  groupParameters?: ToolParameterV2[]
}

/**
 * Groups the given parameters with their toggle based on their visibility conditions.
 */
export function groupParameters(
  parameters: ToolParameterV2[],
): ParameterGroup[] {
  const orderedElements: ParameterGroup[] = []
  parameters.forEach(parameter => {
    const isToggle =
      parameter.name.startsWith('use_') &&
      parameter.schema?.type &&
      parameter.schema?.type === 'boolean'

    if (isToggle) {
      orderedElements.push({
        type: 'dependencyGroup',
        toggle: parameter,
        groupParameters: [],
      })
    } else {
      if (!parameter.visible_if) {
        orderedElements.push({
          type: 'standalone',
          parameter,
        })
      } else {
        const [toggleName, requiredValue] = parameter.visible_if.split('=')
        const toggleElementIndex = orderedElements.findIndex(
          val => val.toggle?.name === toggleName,
        )

        // hidden by default, displayed beneath toggle
        if (requiredValue === 'true') {
          orderedElements[toggleElementIndex]?.groupParameters?.push(parameter)
        } else {
          orderedElements.push({
            type: 'standalone',
            toggle:
              toggleElementIndex !== -1
                ? orderedElements[toggleElementIndex].parameter
                : undefined,
            parameter,
          })
        }
      }
    }
  })
  return orderedElements
}
