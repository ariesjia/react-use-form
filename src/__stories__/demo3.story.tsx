import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import useForm from '../index';

interface IForm {
  name: string
  password: string,
}

const Demo = () => {
  const [form, field]  = useForm<IForm>({
    name: '',
    password: ''
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    form.validate((errors) => {
      console.log(errors)
      if(!errors) {
        alert('submit')
      }
    })
  }

  return <div>
    <form onSubmit={handleSubmit}>
      <h3>
        validate trigger onblur
      </h3>
      <div>
        <label>username</label>
        <input type="text" {...field("name", {
          trigger: 'onBlur',
          rules: [
            {type: "string", required: true}
          ]
        })}
        />
        {
          form.errors.name && <div>
              {form.errors.name[0].message}
          </div>
        }
      </div>
      <div>
        <label>password</label>
        <input type="password" {...field("password", {
          trigger: 'onBlur',
          rules: [
            {type: "string", required: true}
          ]
        })}
        />
        {
          form.errors.password && <div>
            {form.errors.password[0].message}
          </div>
        }
      </div>
      <button type='submit'>submit</button>
    </form>
  </div>
}

storiesOf('Form', module)
    .add('demo3', () => (
        <Demo />
    ))
