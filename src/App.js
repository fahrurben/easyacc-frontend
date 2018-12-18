import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GlobalContext from './GlobalContext';
import { setToken, getToken } from './CommonHelper';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AccountGroupCreate from './pages/AccountGroupCreate';
import AccountGroupUpdate from './pages/AccountGroupUpdate';
import AccountGroupSearch from './pages/AccountGroupSearch';
import AccountCreate from './pages/AccountCreate';
import AccountSearch from './pages/AccountSearch';
import AccountUpdate from './pages/AccountUpdate';
import AccountBalance from './pages/AccountBalance';
import MoveCreate from './pages/MoveCreate';
import MoveSearch from './pages/MoveSearch';
import MoveUpdate from './pages/MoveUpdate';

class App extends Component {

  constructor(props) {
    super(props);
    this.setIsLoggedIn = (isLoggedIn) => {
      this.setState({isLoggedIn: isLoggedIn});
    };
    this.state = {
      isLoggedIn: false,
      setIsLoggedIn: this.setIsLoggedIn
    }

    this.logout = this.logout.bind(this);
  }

  logout() {
    setToken(null);
    document.location.href = "/login";
  }

  render() {
    const isLoggedIn = getToken() === 'null' ? false : true;
    return (
      <div className="container is-fluid">
        <GlobalContext.Provider value={this.state}>
          <Router>
            <div>
              {
                isLoggedIn && 
                <nav className="navbar is-link" role="navigation">
                  <div className="navbar-brand">
                    <Link to="/" className="navbar-item">
                      <strong>EASYACC</strong>
                    </Link>
                    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" href="/">
                      <span aria-hidden="true"></span>
                      <span aria-hidden="true"></span>
                      <span aria-hidden="true"></span>
                    </a>
                  </div>
                  <div className="navbar-menu">
                    <div className="navbar-start">
                      <a className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">
                          Manage
                        </a>
                        <div className="navbar-dropdown">
                          <Link to="/accountgroup" className="navbar-item">Account Group</Link>
                          <Link to="/account" className="navbar-item">Account</Link>
                          <Link to="/account/balance" className="navbar-item">Account Balance</Link>
                        </div>
                      </a>
                      <a className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">
                          Transaction
                        </a>
                        <div className="navbar-dropdown">
                          <Link to="/move/search" className="navbar-item">Move</Link>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="navbar-end">
                    <div className="navbar-item">
                      <div className="buttons">
                        <a onClick={this.logout} className="button is-light">
                          Log out
                        </a>
                      </div>
                    </div>
                  </div>
                </nav>
              }
              <Route path="/move/search" exact component={MoveSearch} />
              <Route path="/move/create" exact component={MoveCreate} />
              <Route path="/move/update/:id" exact component={MoveUpdate} />
              <Route path="/account/create" exact component={AccountCreate} />
              <Route path="/account/update/:id" exact component={AccountUpdate} />
              <Route path="/account/balance" exact component={AccountBalance} />
              <Route path="/account" exact component={AccountSearch} />              
              <Route path="/accountgroup/update/:id" exact component={AccountGroupUpdate} />
              <Route path="/accountgroup/create" exact component={AccountGroupCreate} />
              <Route path="/accountgroup" exact component={AccountGroupSearch} />
              <Route path="/login" exact component={LoginPage} />
              <Route path="/" exact component={HomePage} />
            </div>
          </Router>
        </GlobalContext.Provider>
      </div>
    );
  }
}

export default App;
