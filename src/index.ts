import { useState } from 'react'
import * as AsyncValidator from 'async-validator'
import { get } from './utils/safe-get'
import { mapValues } from './utils/map-values'
import { omit } from './utils/omit'
import { ValidationRule } from "./typing"

export interface ValidateError {
  message?: string,
}

export interface FieldOption {
  trigger?: string
  rules?: ValidationRule[]
}

export type UseForm = <T>(initialData: Partial<T>) => [
  {
    value: Partial<T>,
    errors: {
      [P in keyof T]: ValidateError[]
    },
    touched: {
      [P in keyof T]: boolean
    }
    validate: <K extends keyof T>(
      callback?: (errors?: ValidateError[]) => void,
      keys?: K[],
    ) => void
  },
  <K extends keyof T>(name: K, option?: FieldOption) => {
    value: T[K]
    onChange: (event: any) => void
    onBlur: (event: any) => void
  }
]

const setField = (state, name, value) => {
  return Object.assign(state, {
    [name]: {
      value: get(state, `${name}.value`) || value,
      touched: false,
      error: []
    }
  })
}

const useForm: UseForm = <T>(intial: Partial<T>) => {
  const initialData = intial || {}
  const [state, setState] = useState(
    {
      fields: Object.keys(initialData).reduce((prev, key) => {
        return setField(prev, key, initialData[key])
      }, {}),
      errors: {},
    }
  )

  const updateField = (name, data = {}) => {
    const newState = {
      ...state,
      fields: {
        ...state.fields,
        [name]: {
          ...state.fields[name],
          ...data,
        },
      }
    }
    setState(newState)
    return newState
  }

  const fieldOptions: any[] = []

  const handleErrors = (fields, keys, newState) => {
    const errors = Array.isArray(keys) ? keys.reduce((prev, key) => {
      const fieldsError = fields || {}
      return fieldsError[key] ? {
        ...prev,
        [key]: fieldsError[key],
      } : omit(prev, [key])
    }, newState.errors) : fields || {}
    const errorState = {
      ...newState,
      errors
    }
    setState(errorState)
    return errorState
  }

  const innerValidate = <K extends keyof T>(
    callback?: (errors?: ValidateError[]) => void,
    keys?: K[],
    newState = state
  ) => {
    const descriptor = fieldOptions.reduce((prev, item)=> {
      const rules = get(item, 'option.rules')
      return rules ? Object.assign(prev, {
        [item.name]: rules
      }) : prev
    }, {})
    if (Object.keys(descriptor).length) {
      const validator = new AsyncValidator(descriptor)
      const formValue = getFormValue(newState)
      validator.validate(formValue, (errors, fields) => {
        const error = handleErrors(fields, keys, newState)
        if(errors) {
          callback && callback(error.errors)
        } else {
          callback && callback()
        }
      })
    }
  }

  const getFormValue = (newState = state) => mapValues(newState.fields, field => field.value)

  const field = <K extends keyof T>(name: K, option: FieldOption = {}) => {
    const trigger = option.trigger
    const isBlurTrigger = (trigger || '').toLowerCase() === 'onblur'
    fieldOptions.push({
      name,
      option
    })
    return {
      get value() {
        return get(state, `${name}.value`)
      },
      onChange(event: Event | any) {
        const value = event.target ? event.target.value : event
        const newState = updateField(name, {
          value,
          touched: true
        })
        if(!isBlurTrigger) {
          innerValidate(() =>{} ,[name], newState)
        }
      },
      onBlur() {
        const newState = updateField(name, {
          touched: true
        })
        if(isBlurTrigger) {
          innerValidate(() =>{}, [name], newState)
        }
      },
    }
  }

  return [
    {
      get value() {
        return getFormValue()
      },
      get errors() {
        return state.errors as {
          [P in keyof T]: ValidateError[]
        }
      },
      get touched() {
        return mapValues(state.fields, field => field.touched) as {
          [P in keyof T]: boolean
        }
      },
      validate<K extends keyof T>(
        callback?: (error: any) => void,
        keys?: K[]
      ) {
        return innerValidate(callback, keys)
      },
    },
    field,
  ]
}

export default useForm