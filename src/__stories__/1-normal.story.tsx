import * as React from 'react'
import {Checkbox, CheckboxGroup} from 'react-checkbox-group'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'

import useForm from '../index'

interface IForm {
  name: string
  password: string,
  agree: boolean,
  multi: string[],
  radio?: number,
  textarea: string,
}

const Demo = () => {
  const [form, field]  = useForm<IForm>({
    name: '',
    password: '',
    agree: false,
    textarea: '123123',
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    form.validate((errors) => {
      if(!errors) {
        action('submit')(form.value)
      }
    })
  }

  const handleReset = () => {
    form.reset()
    action('reset')()
  }

  const raido = field("radio", {
    type: 'radio'
  })

  const agree = field("agree", {
    type: 'boolean'
  })

  return (
    <section className="section container">
      <div className="columns">
        <div className="column is-three-fifths">
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <div className="field">
              <label className="label">text</label>
              <input className="input" type="text" {...field("name")} />
            </div>
            <div className="field">
              <label className="label">password</label>
              <input className="input" type="password" {...field("password")} />
            </div>
            <div className="field">
              <label className="label">checked</label>
              <input type="checkbox"
                     onChange={() => agree.onChange(!agree.value)}
                     onBlur={agree.onBlur}
                     checked={!!agree.value}
              />
            </div>
            <div className="field">
              <label className="label">multi checkbox</label>
              <CheckboxGroup checkboxDepth={2} name="fruits" {...field("multi", { type: 'checkbox'})}>
                <label className="checkbox"><Checkbox value="apple"/> Apple</label>
                <label className="checkbox"><Checkbox value="orange"/> Orange</label>
                <label className="checkbox"><Checkbox value="watermelon"/> Watermelon</label>
              </CheckboxGroup>
            </div>
            <div className="field">
              <label className="label">radio</label>
              <div className="control">
                {
                  [1,2,3,4,5].map((item) => {
                    const isChecked = item === raido.value
                    console.log(isChecked);
                    return (<label key={item} className="radio">
                      <input name='radio' type="radio"
                             onChange={() => raido.onChange(item)}
                             onBlur={raido.onBlur}
                             checked={isChecked}
                      /> {item}
                    </label>)
                  })
                }
              </div>
            </div>
            <div className="field">
              <label className="label">textarea</label>
              <textarea className="textarea" {...field("textarea")}></textarea>
            </div>
            <div className="field">
              <button type='submit' className="button is-link">Submit</button> <button type='reset' className="button">Reset</button>
            </div>
          </form>
        </div>
        <div className="column">
          <div className="notification" style={{wordBreak: 'break-all'}}>
            { JSON.stringify(form.value) }
          </div>
        </div>
      </div>
    </section>
  )
}

storiesOf('rc-use-form', module)
    .add('normal', () => (
        <Demo />
    ))
