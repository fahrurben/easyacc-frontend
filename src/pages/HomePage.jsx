import React, { Component } from 'react';
import { getToken } from '../CommonHelper';

class App extends Component {

  async componentDidMount() {
    if (getToken() === 'null') {
      this.props.history.push('/login');
    }
  }

  render() {
    return (
      <div>
      </div>
    )
  }

}

export default App;