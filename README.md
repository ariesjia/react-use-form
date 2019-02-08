# react-useform
> manage form state use React Hooks.

## Install
```bash
// use yarn
yarn add react-useform -D
// use npm
npm install react-useform  --save-dev
```

## Demo
```javascript
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
          <input type="text" {...field("name")} />
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
* `trigger`: Event which is listened to validate