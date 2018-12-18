import React, { Component } from 'react';
import GlobalContext from '../GlobalContext';

import { fetchHelper } from '../CommonHelper';
import { apiUrl } from '../Constant';

class AccountBalance extends Component {

  static contextType = GlobalContext;

  constructor(props) {
    super();

    this.state = {
      data: [],
    };
  }

  async componentDidMount() {
    await this.accountBalanceService();
  }

  async accountBalanceService() {

    try {
      let response = await fetchHelper(`${apiUrl}/api/accounts/balance`,{
        method: "GET"
      });
      response = await response.json();
      this.setState({
        data: response,
      });
    } catch (e) {

    }
  }

  render() {
    let data = this.state.data;

    return (
      <div className="columns">
        <div className="column">
          <h1 className="title">Account Balance</h1>
          <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {
                data && data.map((row, i) => {
                  return (
                    <tr>
                      <td>{row.name}</td>
                      <td>{row.code}</td>
                      <td className="has-text-right">{row.balance.toFixed(2)}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default AccountBalance;