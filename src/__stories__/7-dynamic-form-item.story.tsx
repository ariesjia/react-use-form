import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import useForm from '../index';

interface IForm {
  name: string
  password: string,
  mobile: string,
  need: boolean,
}

const Demo = () => {
  const [form, field]  = useForm<IForm>({
    name: '',
    mobile: '',
    password: ''
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    form.validate((errors) => {
      if(!errors) {
        action('submit')(form.value)
      } else {
        action('errors')(errors)
      }
    })
  }

  const handleReset = () => {
    form.reset()
    action('reset')()
  }

  const need = field("need", {
    type: 'boolean'
  })

  return (
    <div className="section container">
      <h3 className="title is-3">
        dynamic
      </h3>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className="field">
          <label className="label">username</label>
          <input className="input" type="text" {...field("name", {
            rules: [
              {type: "string", required: true}
            ]
          })}
          />
          {
            form.errors.name && <p className="help is-danger">{form.errors.name[0].message}</p>
          }
        </div>
        <div className="field">
          <label className="label">password</label>
          <input className="input" type="password" {...field("password", {
            rules: [
              {type: "string", required: true}
            ]
          })}
          />
          {
            form.errors.password && <p className="help is-danger">{form.errors.password[0].message}</p>
          }
        </div>
        {
          need.value && (
            <div className="field">
              <label className="label">mobile</label>
              <input className="input" type="text" {...field("mobile", {
                rules: [
                  {type: "string", required: true}
                ]
              })}
              />
              {
                form.errors.mobile && <p className="help is-danger">{form.errors.mobile[0].message}</p>
              }
            </div>
          )
        }
        <div className="field">
          <label className="label">checked</label>
          <input type="checkbox"
                 onChange={() => need.onChange(!need.value)}
                 onBlur={need.onBlur}
                 checked={!!need.value}
          />
        </div>
        <button type='submit' className='button is-link'>submit</button>
        <button type='reset' className="button">reset</button>
      </form>
      <div className="column">
        <div className="notification" style={{wordBreak: 'break-all'}}>
          { JSON.stringify(form) }
        </div>
      </div>
    </div>
  )
}

storiesOf('rc-use-form', module)
    .add('dynamic', () => (
        <Demo />
    ))
