import * as React from "react";
import render, { act } from 'hooks-test-util'
import useForm from '../index'

describe("use-form reset test", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should get initial field value', () => {

    const text = 'test username'

    const { container } = render(() => {
      return useForm({
        name: text,
      })
    })

    expect(container.hook[1]('name').value).toEqual(text)
  })

  it('should get value after field changed', () => {
    const { container } = render(() => {
      return useForm({
        name: 'test username',
      })
    })

    const text = 'username'

    act(() => {
      container.hook[1]('name').onChange(text)
    })

    expect(container.hook[1]('name').value).toEqual(text)
  })


  it('should set value through setter', () => {
    const { container } = render(() => {
      return useForm({
        name: 'test username',
      })
    })

    const text = 'username'

    act(() => {
      container.hook[1]('name').value = text
    })

    expect(container.hook[1]('name').value).toEqual(text)
  })

})
