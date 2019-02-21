import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import useForm from '../index';

interface IForm {
  name: string
  password: string,
}

const Message = () => {
  return (
    <>
      <span className="message">please input username !!!!!!!!!</span>
      <style>{`
        .message {
          color: red;
          margin-bottom: 10px;
          display: inline-block;
        }
      `}</style>
    </>
  )
}

const Demo = () => {
  const [form, field]  = useForm<IForm>({
    name: '',
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

  return (
    <section className="section">
      <h3 className="title is-3">
        Custom error message
      </h3>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">username</label>
            <input className="input" type="text" {...field("name", {
              rules: [
                {type: "string", required: true, message: <Message /> }
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
                {type: "string", required: true, message: 'password required !!!'}
              ]
            })}
            />
            {
              form.errors.password && <p className="help is-danger">{form.errors.password[0].message}</p>
            }
          </div>
          <button type='submit' className='button is-link'>submit</button>
        </form>
      </div>
    </section>
  )
}

storiesOf('Form', module)
    .add('validate(custom error message)', () => (
        <Demo />
    ))
