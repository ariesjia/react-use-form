import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
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

  return (
    <div>
      { JSON.stringify(form.value) }
      <form>
        <div>
          <label>username</label>
          <input type="text" {...field("name")} />
        </div>
        <div>
          <label>password</label>
          <input type="password" {...field("password")} />
        </div>
      </form>
    </div>
  );
};

storiesOf('Form', module)
    .add('demo1', () => (
        <Demo />
    ));
