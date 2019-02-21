import * as React from 'react';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import useForm from '../index';

interface IForm {
  name: string
  password: string,
  agree: boolean,
  multi: string[],
  radio: number,
}

const Demo = () => {
  const [form, field]  = useForm<IForm>({
    name: '',
    password: '',
    agree: true,
    radio: 4,
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
          <label>text</label>
          <input type="text" {...field("name")} />
        </div>
        <div>
          <label>password</label>
          <input type="password" {...field("password")} />
        </div>
        <div>
          <label>checked</label>
          <input type="checkbox"
                 onChange={() => field("agree").onChange(!field("agree").value)}
                 onBlur={field("agree").onBlur}
                 checked={!!field("agree").value}
          />
        </div>
        <div>
          <label>multi checkbox</label>
          <CheckboxGroup checkboxDepth={2} name="fruits" {...field("multi")}>
            <label><Checkbox value="apple"/> Apple</label>
            <label><Checkbox value="orange"/> Orange</label>
            <label><Checkbox value="watermelon"/> Watermelon</label>
          </CheckboxGroup>
        </div>
        <div>
          <label>radio</label>
          <div>
          {
            [1,2,3,4,5].map((item) => {
              return (<label key={item}>
                <input name='radio' type="radio" {...field("radio")}
                       value={item}
                       onChange={() => field("radio").onChange(item)}
                       onBlur={field("radio").onBlur}
                       checked={item === field("radio").value}
                />
                {item}
              </label>)
            })
          }
          </div>
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
