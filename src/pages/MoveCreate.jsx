import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GlobalContext from '../GlobalContext';
import InputText from '../components/InputText';
import SelectBox from '../components/SelectBox';

import { getEventTargetValue, fetchHelper, setLoading, sleep } from '../CommonHelper';
import { apiUrl, datePickerFormat } from '../Constant';

import * as yup from 'yup';
import moment from 'moment';

const validationSchema = yup.object().shape({
  ref: yup.string().required(),
  date: yup.string().required()
});

class MoveCreate extends Component {

  static contextType = GlobalContext;

  constructor(props) {
    super();

    this.state = {
      ref: '',
      date: '',
      desc: '',
      lines: [],
      accounts: [],
      lineIdx: 0,
      lineAccount: null,
      lineDebit: 0.0,
      lineCredit: 0.0,
      validations: [],
      error: '',
      isLoading: false,
      isShow: false
    };

    this.submit = this.submit.bind(this);
  }

  refChange = (ev) => this.setState({ref: getEventTargetValue(ev)});
  dateChange = (ev) => this.setState({date: getEventTargetValue(ev)});
  descChange = (ev) => this.setState({desc: getEventTargetValue(ev)});
  accountChange = (ev) => this.setState({lineAccount: getEventTargetValue(ev)});
  debitChange = (ev) => this.setState({lineDebit: getEventTargetValue(ev)});
  creditChange = (ev) => this.setState({lineCredit: getEventTargetValue(ev)});

  closeModal = (ev) => {
    this.setState({
      lineIdx: null,
      isShow: false
    });
  };

  openModal = (ev) => {
    this.setState({
      lineIdx: null,
      lineDebit: 0.0,
      lineCredit: 0.0,
      isShow: true
    });
  };

  updateModal = (i) => {
    const line = this.state.lines[i];

    this.setState({
      lineIdx: i,
      lineAccount: line.account,
      lineDebit: line.debit,
      lineCredit: line.credit,
      isShow: true
    });
  };
  
  saveLine = (ev) => {
    ev.preventDefault();
    if (!isNaN(parseInt(this.state.lineAccount))) {
      let line = {
        account: parseInt(this.state.lineAccount, 10),
        debit: parseFloat(this.state.lineDebit),
        credit: parseFloat(this.state.lineCredit)
      };
      let lineIdx = this.state.lineIdx;
      let data = this.state.lines;
      if (lineIdx !== null) {
        data[lineIdx] = line;
      } else {
        data.push(line);
      }
      this.setState({
        lines: data,
        isShow: false
      });
    } else {
      alert('Please select account');
    }
  };

  deleteRow = (i) => {
    const data = this.state.lines;
    data.splice(i,1);

    this.setState({
      lines: data
    });
  };

  async componentWillMount() {
    setLoading(true, this);
    let accounts = [];
    try {
      let response = await fetchHelper(`${apiUrl}/api/accounts/find?sortBy=id&sortOrder=ASC&page=1&size=1000`,{
        method: "POST",
        body: JSON.stringify({})
      });

      response = await response.json();
      accounts = response.map((val) => {
        return {label: val.name, value: val.id}
      })
      this.setState({accounts: accounts});
    } catch (e) {

    } finally {
      setLoading(false, this);
    }
  }

  async submit(ev) {
    ev.preventDefault();
    let errors = [];
    this.setState({error: ''});
    try {
      validationSchema.validateSync(this.state, { abortEarly: false });
    } catch(e) {
      e.inner.forEach((val) => {
        errors[val.path] = val.message;
      });
      this.setState({ validations: errors });
    }

    if (Object.keys(errors).length === 0) {
      setLoading(true, this);

      let datePosted = moment(this.state.date, datePickerFormat).valueOf();
      let body = {
        ref: this.state.ref,
        datePosted: datePosted,
        desc: this.state.desc
      };
      let lines = this.state.lines.map((val) => {
        return {
          account: { id: val.account },
          debit: val.debit,
          credit: val.credit,
          datePosted: datePosted
        }
      });
      body.lines = lines;
      try {
        await fetchHelper(`${apiUrl}/api/moves`,{
          method: "POST",
          body: JSON.stringify(body)
        });
        await sleep(1000);
        this.props.history.push('/');
      } catch(e) {
        this.setState({error: 'Error when saving'});
      } finally {
        setLoading(false, this);
      }
    }
  }

  render() {
    let submitClass = this.state.isLoading ? 'button is-link is-loading': 'button is-link';
    let lines = this.state.lines;

    return (
      <div className="columns">
        <div className="column">
          <h1 className="title">Move</h1>
          <form>
            { this.state.error && 
              <div className="notification is-danger">{this.state.error}</div>
            }
            <InputText label="Ref" name="ref" type="text" value={this.state.ref} 
                onChange={this.refChange} validations={this.state.validations}/>            
            <InputText label="Date" name="date" type="date" value={this.state.date} 
                onChange={this.dateChange} validations={this.state.validations}/>
            <InputText label="Description" name="desc" type="text" value={this.state.desc} 
                onChange={this.descChange} validations={this.state.validations}/>              
            
            <h3 class="title is-3">Lines <button onClick={this.openModal} className="button is-primary">Add</button></h3>
            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {
                  lines && lines.map((row, i) => {
                    let account = this.state.accounts.find(
                      (el) => el.value===parseInt(row.account, 10)
                    );
                    return (
                      <tr>
                        <td>{account.label}</td>
                        <td>{row.debit}</td>
                        <td>{row.credit}</td>
                        <td className="td-operation">
                          <button className="button is-small" onClick={() => this.updateModal(i)}>Update</button>
                          <button className="button is-small" onClick={() => this.deleteRow(i)}>Delete</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>

            <div className="field is-grouped">
              <div class="control">
                <button onClick={this.submit} className={submitClass}>Submit</button>
              </div>
              <div className="control">
                <Link to="/move/search" className="button is-text">Back</Link>
              </div>
            </div>
          </form>
        </div>

        <div class={this.state.isShow ? 'modal is-active': 'modal'}>
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Move Line</p>
              <button class="delete" aria-label="close" onClick={this.closeModal}></button>
            </header>
            <section class="modal-card-body">
              <form>
                <SelectBox label="Account" name="account" 
                  options={this.state.accounts} value={this.state.lineAccount} 
                  onChange={this.accountChange} validations={this.state.validations}/>            
                <InputText label="Debit" name="lineDebit" type="number" value={this.state.lineDebit} 
                  onChange={this.debitChange} validations={this.state.validations}/>
                <InputText label="Credit" name="lineCredit" type="number" value={this.state.lineCredit} 
                  onChange={this.creditChange} validations={this.state.validations}/>    
              </form>                      
            </section>
            <footer class="modal-card-foot">
              <button class="button is-success" onClick={this.saveLine}>Save changes</button>
              <button class="button" onClick={this.closeModal}>Cancel</button>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default MoveCreate;