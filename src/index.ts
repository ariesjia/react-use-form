import {useState} from 'react'
import * as AsyncValidator from 'async-validator'
import * as memoize from 'fast-memoize'
import {get} from './utils/safe-get'
import {mapValues} from './utils/map-values'
import {omit} from './utils/omit'
import {ValidateError, ValidationRule} from "./typing"

export interface FieldOption {
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

// @ts-ignore
const getValidator = memoize((descriptor) => {
  console.log(descriptor);
  if (Object.keys(descriptor).length) {
    return new AsyncValidator(descriptor)
  } else {
    return null
  }
})

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
    type?: 'change' | 'blur',
    newState = state,
  ) => {
    const isBlur = type === 'blur'
    const descriptor = fieldOptions.reduce((prev, item)=> {
      const rules = get(item, 'option.rules')
      return rules ? Object.assign(prev, {
        [item.name]: rules.filter(rule => type ? (isBlur ? rule.trigger === 'blur' : rule.trigger !== 'blur') : true)
      }) : prev
    }, {})
    const validator = getValidator(descriptor)
    if (validator) {
      const formValue = getFormValue(newState)
      validator.validate(formValue, (errors, fields) => {
        const error = handleErrors(fields, keys, newState)
        if(errors) {
          callback && callback(error.errors)
        } else {
          callback && callback()
        }
      })
    } else {
      callback && callback()
    }
  }

  const getFormValue = (newState = state) => mapValues(newState.fields, field => field.value)

  const field = <K extends keyof T>(name: K, option: FieldOption = {}) => {
    fieldOptions.push({
      name,
      option
    })
    return {
      get value() {
        return get(state, `fields.${name}.value`)
      },
      onChange(event: Event | any) {
        const value = event.target ? event.target.value : event
        const newState = updateField(name, {
          value,
          touched: true
        })
        innerValidate(() =>{} ,[name], 'change', newState, )
      },
      onBlur() {
        const newState = updateField(name, {
          touched: true
        })
        innerValidate(() =>{}, [name], 'blur', newState)
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