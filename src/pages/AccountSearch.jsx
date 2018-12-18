import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash'; 
import GlobalContext from '../GlobalContext';

import { fetchHelper } from '../CommonHelper';
import { apiUrl } from '../Constant';

class AccountSearch extends Component {

  static contextType = GlobalContext;

  constructor(props) {
    super();

    this.state = {
      data: [],
      page: 1,
      totalPage: 1
    };
  }

  async componentDidMount() {
    await this.goToPageService(this.state.page);
  }

  async update(id) {
    console.log(id);
    this.props.history.push('/account/update/'+id);
  }

  async goToPage(page) {
    if (page > 0 && page <= this.state.totalPage) {
      this.setState({page: page});
      this.goToPageService(page);
    }
  }

  async goToPageService(page) {

    try {
      let response = await fetchHelper(`${apiUrl}/api/accounts/find?sortBy=id&sortOrder=ASC&page=${page}&size=10`,{
        method: "POST",
        body: JSON.stringify({})
      });
      const totalPage = parseInt(response.headers.get('total-page'), 10);
      response = await response.json();
      this.setState({
        data: response,
        totalPage: totalPage
      });
    } catch (e) {

    }
  }

  render() {
    let data = this.state.data;
    let page = this.state.page;
    let totalPage = this.state.totalPage;

    return (
      <div className="columns">
        <div className="column">
          <h1 className="title">Account <Link to="/account/create" class="button is-medium is-primary">Create</Link></h1>
          <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {
                data && data.map((row, i) => {
                  return (
                    <tr>
                      <td>{row.name}</td>
                      <td>{row.code}</td>
                      <td><a className="button is-small" onClick={() => this.update(row.id)}>Update</a></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          { totalPage > 1 &&
            <nav className="pagination" role="navigation" aria-label="pagination">
              <a className="pagination-previous" disabled={page === 1} onClick={() => this.goToPage(page-1)}>Previous</a>
              <a className="pagination-next" disabled={page === totalPage} onClick={() => this.goToPage(page+1)}>Next page</a>
              <ul className="pagination-list">
                {
                  _.times(totalPage, (i) => {
                    const currentClass = i+1 === page ? 'is-current' : '';
                    const pagingClass = `pagination-link ${currentClass}`;
                    return <li><a className={pagingClass} onClick={() => this.goToPage(i+1)}>{i+1}</a></li>
                  })
                }
              </ul>
            </nav>
          }
        </div>
      </div>
    )
  }
}

export default AccountSearch;