import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import useForm from '../index';

interface IForm {
  name: string
  password: string,
  apassword: string,
}

const Demo = () => {
  const [form, field]  = useForm<IForm>({
    name: 'admin',
    password: 'password',
    apassword: ''
  });

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
              <input
                className="input"
                type="password"
                {...field("password", {
                  rules: [{
                    type: "string",
                    required: true,
                    min:8,
                    max:16,
                    message:"8-16位字符"
                  }]
                })}
              />
              {
                form.errors.password && <p className="help is-danger">{form.errors.password[0].message}</p>
              }
            </div>
            <div className="field">
              <label className="label">repeat password</label>
              <input
                className="input"
                type="password"
                {...field("apassword", {
                  rules: [{
                    type: "string",
                    validator: (rule, value, callback)=>{
                      const password = form.getValue().password
                      console.log(password, value);
                      if(value != password){
                        callback("两次输入的密码不一致！");
                      }
                      callback();
                    }
                  }]
                })}
              />
              {
                form.errors.apassword && <p className="help is-danger">{form.errors.apassword[0].message}</p>
              }
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
  );
};

storiesOf('rc-use-form', module)
    .add('custom validate value', () => (
        <Demo />
    ));
