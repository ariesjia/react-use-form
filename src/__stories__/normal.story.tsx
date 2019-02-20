import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import useForm from '../index';

interface IForm {
  name: string
  password: string,
}

const Demo = () => {
  const [form, field]  = useForm<IForm>({
    name: '',
    password: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault()
    form.validate((errors) => {
      if(!errors) {
        action('submit')(form.value)
      }
    })
  }

  return (
    <div>
      { JSON.stringify(form.value) }
      <form onSubmit={handleSubmit}>
        <div>
          <label>username</label>
          <input type="text" {...field("name")} />
        </div>
        <div>
          <label>password</label>
          <input type="password" {...field("password")} />
        </div>
        <button type='submit'>submit</button>
      </form>
    </div>
  );
};

storiesOf('Form', module)
    .add('normal', () => (
        <Demo />
    ));
