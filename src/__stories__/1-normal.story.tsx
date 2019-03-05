import * as React from 'react'
import 'bulma/css/bulma.css'
import {Checkbox, CheckboxGroup} from 'react-checkbox-group'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'

import useForm from '../index'

interface IForm {
  name: string
  password: string,
  agree: boolean,
  multi: string[],
  radio: number,
  textarea: string,
}

const Demo = () => {
  const [form, field]  = useForm<IForm>({
    name: '',
    password: '',
    agree: true,
    radio: 4,
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

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-three-fifths">
            <form onSubmit={handleSubmit}>
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
                       onChange={() => field("agree").onChange(!field("agree").value)}
                       onBlur={field("agree").onBlur}
                       checked={!!field("agree").value}
                />
              </div>
              <div className="field">
                <label className="label">multi checkbox</label>
                <CheckboxGroup checkboxDepth={2} name="fruits" {...field("multi")}>
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
                      return (<label key={item} className="radio">
                        <input name='radio' type="radio" {...field("radio")}
                               value={item}
                               onChange={() => field("radio").onChange(item)}
                               onBlur={field("radio").onBlur}
                               checked={item === field("radio").value}
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
                <button type="submit" className="button is-link">Submit</button>
              </div>
            </form>
          </div>
          <div className="column">
            <div className="notification" style={{wordBreak: 'break-all'}}>
              { JSON.stringify(form.value) }
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

storiesOf('Form', module)
    .add('normal', () => (
        <Demo />
    ))
