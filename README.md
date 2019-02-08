# react-use-form
> manage form state use React Hooks.

## Install
```bash
// use yarn
yarn add react-use-form -D
// use npm
npm install react-use-form  --save-dev
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