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

  return <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label>username</label>
        <input type="text" {...field("name", {
          rules: [
            {type: "string", required: true, message: <Message /> }
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
          rules: [
            {type: "string", required: true, message: 'password required !!!'}
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
    .add('validate(customer message)', () => (
        <Demo />
    ))
