# rc-use-form
> manage form state use React Hooks. [https://ariesjia.github.io/react-use-form/](https://ariesjia.github.io/react-use-form/)

[![NPM](https://img.shields.io/npm/v/rc-use-form.svg)](https://www.npmjs.com/package/rc-use-form)
[![Build Status](https://travis-ci.org/ariesjia/react-use-form.svg?branch=master)](https://travis-ci.org/ariesjia/react-use-form)

## Install
```bash
// use yarn
yarn add rc-use-form
// use npm
npm install rc-use-form
```

## Demo

### simple 

```javascript
import useForm from 'rc-use-form';

const Demo = () => {
  const [form, field]  = useForm({
    name: '',
    password: ''
  })
  
  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(form.value)
  }
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>username</label>
          <input type="text" {...field("name")}/>
        </div>
        <div>
          <label>password</label>
          <input type="password" {...field("password")} />
        </div>
        <button type='submit'>submit</button>
      </form>
    </div>
  )
}
```

### validate 

```javascript
import useForm from 'rc-use-form';

const Demo = () => {
  const [form, field]  = useForm({
    name: '',
    password: ''
  })
  
  const handleSubmit = (event) => {
    event.preventDefault()
    form.validate((errors) => {
      if(!errors) {
        console.log(form.value)
        alert('submit')
      }
    })
  }
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>username</label>
          <input type="text" {...field("name", {
            rules: [{type: "string", required: true}]
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
            rules: [{type: "string", required: true}]
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
  )
}
```

### form

* `value`: The form data
* `touched`: The field had been changed by user
* `errors`: The form validate errors
* `validate`: The form validate function

### field

```javascript
field(name, [options])
```

* `name`: The field field (required).

#### Options

* `rules`: validate rules use [async-validate](https://github.com/freeformsystems/async-validate)
