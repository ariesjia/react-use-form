import {useCallback, useState} from 'react'
import AsyncValidator from 'async-validator'
import {get} from './utils/safe-get'
import {mapValues} from './utils/map-values'
import noop from './utils/noop'
import {ValidateError, ValidationRule} from "./typing"
import {actions, reducer} from "./reducer"
import { FiledType } from "./filed-type"

export interface FieldOption {
  rules?: ValidationRule[],
  type?: 'text' | 'checkbox' | 'boolean' | 'radio'
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
    validate: (
      callback?: (errors?: ValidateError[]) => void,
      keys?: (keyof T)[],
    ) => void
    reset: (keys?: (keyof T)[]) => void
    getValue: () => Partial<T>,
  },
  <K extends keyof T>(name: K, option?: FieldOption) => {
    value: T[K]
    onChange: (event: any) => void
    onBlur: (event: any) => void
  }
]

const getFieldData = (value) => {
  return {
    value: value,
    touched: false,
  }
}

export function getResetValue(type?: string) {
  switch (type) {
    case FiledType.text:
      return ''
    case FiledType.checkbox:
    case FiledType.radio:
      return null
    case FiledType.boolean:
      return false
    default:
      return null
  }
}

const useForm: UseForm = <T>(intial: Partial<T>) => {
  const initialData = intial || {}

  const fieldOptions = {}

  const fields = {}

  const [hooksState, setState] = useState({
    fields: Object.keys(initialData).reduce((prev, key) => {
      return {
        ...prev,
        [key]: getFieldData(initialData[key])
      }
    }, {}),
    errors: {},
    options: {},
  })

  let state = hooksState

  const dispatch = function(type, payload) {
    state = reducer(state, {
      type,
      payload
    })
    setState(state)
    return state;
  }

  const setOption = function(name, option?: FieldOption) {
    if(option) {
      fieldOptions[name] = option
    }
  }

  const getValidateDescriptor = useCallback((type) => {
    const options = fieldOptions
    const isBlur = type === 'blur'
    return Object.keys(options).reduce((prev, key) => {
      let option = options[key];
      const rules = option.rules
      return rules ? Object.assign(prev, {
        [key]: rules.filter(rule => type ? (isBlur ? rule.trigger === 'blur' : rule.trigger !== 'blur') : true)
      }) : prev
    }, {})
  }, [fieldOptions])

  const getValidator = useCallback((descriptor) => {
      if (Object.keys(descriptor).length) {
        return new AsyncValidator(descriptor)
      } else {
        return null
      }
    }
  , [fieldOptions])

  const getFormValueFromState = (formState = state) => mapValues(formState.fields, field => field.value)

  const updateField = function(name, data = {}) {
    return dispatch(actions.UPDATE_FIELD, {
      name,
      data
    })
  }

  const reset = (keys?: (keyof T)[]) => {
    dispatch(actions.RESET, {
      keys,
      fieldOptions
    })
  }

  const handleErrors = (fieldsError, keys) => {
    const { errors } = dispatch(actions.SET_ERRORS, {
      keys,
      fieldsError
    })
    return errors
  }

  const innerValidate = (
    callback?: (errors?) => void,
    keys?: (keyof T)[],
    type?: 'change' | 'blur',
    formState = state,
  ) => {
    const descriptor = getValidateDescriptor(type)
    const validator = getValidator(descriptor)
    if (validator) {
      const formValue = getFormValueFromState(formState)
      validator.validate(formValue, (errors, fieldsError) => {
        const formErrors = handleErrors(fieldsError, keys)
        if(errors) {
          callback && callback(formErrors)
        } else {
          callback && callback()
        }
      })
    } else {
      callback && callback()
    }
  }

  const field = <K extends keyof T>(name: K, option?: FieldOption) => {
    setOption(name, option)
    if(!fields[name as string]) {
      fields[name as string] = {
        get value() {
          const value = get(state, `fields.${name}.value`)
          return value === undefined  ? getResetValue(option && option.type) : value
        },
        set value(value) {
          this.onChange(value)
        },
        onChange (event: Event | any) {
          const value = event.target ? event.target.value : event
          const newState = updateField(name, {
            value,
            touched: true
          })
          innerValidate(noop, [name], 'change', newState)
        },
        onBlur() {
          const newState = updateField(name, {
            touched: true
          })
          innerValidate(noop, [name], 'blur', newState)
        },
      }
    }
    return fields[name as string]
  }

  return [
    {
      get value() {
        return getFormValueFromState()
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
      getValue() {
        return getFormValueFromState()
      },
      validate(
        callback?: (error: any) => void,
        keys?: (keyof T)[]
      ) {
        return innerValidate(callback, keys)
      },
      reset(
        keys?: (keyof T)[]
      ) {
        reset(keys)
      },
    },
    field,
  ]
}

export default useForm