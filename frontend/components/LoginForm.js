import React, { useState } from 'react'
import PT from 'prop-types'

const initialFormValues = {
  username: '',
  password: '',
}
export default function LoginForm(props) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here
  const { login } = props;


  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

 
    const onSubmit = evt => {
      evt.preventDefault();
      // Call the login function from props with the form values
      login(values);
    };
  

  const isDisabled = () => {
    const { username, password } = values;
    return username.trim().length < 3 || password.trim().length < 8;
  }
  

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={isDisabled() ? true : false} id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}
