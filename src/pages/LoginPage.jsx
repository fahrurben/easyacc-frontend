import React, { Component } from 'react';
import GlobalContext from '../GlobalContext';
import InputText from '../components/InputText';

import { getEventTargetValue, setToken, sleep } from '../CommonHelper';
import { apiUrl } from '../Constant';

import * as yup from 'yup';

const validationSchema = yup.object().shape({
  username: yup.string().required().email(),
  password: yup.string().required()
});

class Login extends Component {

  static contextType = GlobalContext;

  constructor(props) {
    super();

    this.state = {
      username: '',
      password: '',
      validations: []
    };

    this.submit = this.submit.bind(this);
  }

  usernameChange = (ev) => this.setState({username: getEventTargetValue(ev)});
  passwordChange = (ev) => this.setState({password: getEventTargetValue(ev)});

  async submit(ev) {
    ev.preventDefault();
    let errors = [];
    try {
      validationSchema.validateSync(this.state, { abortEarly: false });
    } catch(e) {
      e.inner.forEach((val) => {
        errors[val.path] = val.message;
      });
      this.setState({ validations: errors });
    }

    if (errors.length === 0) {
      let response = null;
      try {
        response = await fetch(`${apiUrl}/login`,{
          method: "POST",
          body: JSON.stringify({
            email: this.state.username,
            password: this.state.password
          })
        });
        console.log(response);
        if (response.status === 200) {
          const token = response.headers.get('Authorization');
          setToken(token);
          await sleep(1000);
          document.location.href = "/";
        } else {
          alert('Wrong username or password');
        }
      } catch(e) {
        
      }
    }
  }

  render() {
    return (
      <div className="columns">
        <div className="column">
          <h1 className="title">EASY ACC</h1>
          <p>username: test@test.com, password: test</p>
          <form>
            <InputText label="Username" name="username" type="text" value={this.state.username} 
              onChange={this.usernameChange} validations={this.state.validations}/>
            <InputText label="Password" name="password" type="password" value={this.state.password} 
              onChange={this.passwordChange} validations={this.state.validations/*  */}/>  
            <button onClick={this.submit} className="button">Submit</button>
          </form>
        </div>
      </div>
    );
  }

}

export default Login;