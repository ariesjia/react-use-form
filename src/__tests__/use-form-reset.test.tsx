import * as React from "react";
import render, { act } from 'hooks-test-util'
import useForm from '../index'

describe("use-form reset test", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should clear all field when excute reset function', () => {
    const { container } = render(() => {
      return useForm({
        name: 'test username',
        password: 'test password',
      })
    })
    act(() => {
      const form = container.hook[0]
      form.reset()
    })
    expect(container.hook[0].value).toEqual({
      name: '',
      password: ''
    })
  })

  it('should clear The specified field when excute reset function when arguments', () => {
    const initialData = {
      name: 'test username',
      password: 'test password',
    }

    const { container } = render(() => {
      return useForm(initialData)
    })
    act(() => {
      const form = container.hook[0]
      form.reset(['name'])
    })
    expect(container.hook[0].value).toEqual({
      ...initialData,
      name: ''
    })
  })

})
