import {omit} from "./utils/omit";
import {FiledType} from "./filed-type";
import { getResetValue } from "./index";

export const actions = {
  UPDATE_FIELD: 'UPDATE_FIELD',
  SET_ERRORS: 'SET_ERRORS',
  RESET: 'REST',
}

const getErrors = function(keys, fields, errors) {
  const fieldsError = fields || {}
  return Array.isArray(keys) ? keys.reduce((prev, key) => {
    return fieldsError[key] ? {
      ...prev,
      [key]: fieldsError[key],
    } : omit(prev, [key])
  }, errors) : fieldsError
}

export const reducer = function(state, action) {
  const payload = action.payload
  switch (action.type) {
    case actions.UPDATE_FIELD:
      return {
        ...state,
        fields: {
          ...state.fields,
          [payload.name]: {
            ...state.fields[payload.name],
            ...payload.data,
          },
        }
      }
    case actions.SET_ERRORS:
      return {
        ...state,
        errors: getErrors(
          payload.keys,
          payload.fieldsError,
          state.errors
        )
      }
    case actions.RESET:
      const keys = payload.keys && payload.keys.length ?  payload.keys : Object.keys(state.fields)
      const fieldOptions = payload.fieldOptions || {}
      const fields = state.fields
      const resetFields = Object.keys(fields).reduce((prev, name) => {
        const field = fields[name]
        const option = fieldOptions[name] || {}
        const shouldReset = keys.includes(name)
        return shouldReset ? {
          ...prev,
          [name]: {
            ...field,
            value: getResetValue(option.type || FiledType.text),
          }
        } : prev
      }, {})
      return {
        ...state,
        fields: {
          ...fields,
          ...resetFields
        },
        errors: getErrors(
          keys,
          {},
          state.errors
        )
      }
    default:
      return state
  }
}