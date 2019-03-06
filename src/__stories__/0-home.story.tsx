import * as React from 'react'
import {Checkbox, CheckboxGroup} from 'react-checkbox-group'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import useForm from '../index'

storiesOf('home', module)
    .add('home', () => (
        <div className="container">
          <h1 className="title">rc-use-form</h1>
          <h2 className="subtitle">manage form state use React Hooks. </h2>
          <div className="content">
            <a href="https://www.npmjs.com/package/rc-use-form" rel="nofollow"><img src="https://camo.githubusercontent.com/5f0c4e29af78c8b828b21f05f48124a4ac4e713c/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f72632d7573652d666f726d2e737667" alt="NPM" /></a>
            <a href="https://travis-ci.org/ariesjia/react-use-form" rel="nofollow"><img src="https://camo.githubusercontent.com/458a1d86ca583f1da05a0c334306b1dba6640121/68747470733a2f2f7472617669732d63692e6f72672f61726965736a69612f72656163742d7573652d666f726d2e7376673f6272616e63683d6d6173746572" alt="Build Status" /></a>
          </div>
          <div className="content">
            <h3 className="strong">Install</h3>
            <blockquote>
              npm install rc-use-form
            </blockquote>
          </div>
          <div className="content">
            <h3 className="strong">Use</h3>
            <blockquote>
              <p>import useForm from 'rc-use-form'</p>
              <p>const [form, field]  = useForm()</p>
              <p>{'<input type="text" {...field("name")}/>'}</p>
            </blockquote>
          </div>
          <div className="content">
            <h3 className="strong">Demos</h3>
            <ol type="1">
              <li>
                base use
                <button onClick={linkTo('rc-use-form', 'normal')}>Demo</button>
              </li>
              <li>
                initial-value
                <button onClick={linkTo('rc-use-form', 'initial value')}>Demo</button>
              </li>
              <li>
                field validation
                <button onClick={linkTo('rc-use-form', 'validate')}>Demo</button>
              </li>
              <li>
                field validation (trigger onBlur)
                <button onClick={linkTo('rc-use-form', 'validate(trigger onBlur)')}>Demo</button>
              </li>
              <li>
                field validation(custom error message)
                <button onClick={linkTo('rc-use-form', 'validate(custom error message)')}>Demo</button>
              </li>
            </ol>
          </div>

        </div>
    ))
