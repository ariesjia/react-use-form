import * as React from "react";
import { render, getByTestId } from 'react-testing-library'
import userEvent from 'user-event'
import useForm from '../index'

interface IForm {
  name: string
}

function FormComponent() {
  const [form, field] = useForm<IForm>({
    name: 'test username'
  })
  return (
    <form>
      <div>
        <input data-testid="input" type="text" {...field("name")} />
        <div data-testid="value">{form.value.name}</div>
      </div>
    </form>
  )
}

describe("use-form test", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should get initial form value', () => {
    const { container } = render(<FormComponent />)
    const input = getByTestId(container, 'input')
    // @ts-ignore
    expect(input.value).toEqual('test username')
  })

  it('should get filed value from form value', () => {
    const { container } = render(<FormComponent />)
    const input = getByTestId(container, 'input')
    const value = getByTestId(container, 'value')
    const text = 'Hello, World!';
    userEvent.type(input, text)
    expect(value.textContent).toEqual(text)
  })
})
