import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GlobalContext from '../GlobalContext';
import InputText from '../components/InputText';
import SelectBox from '../components/SelectBox';

import { getEventTargetValue, fetchHelper, setLoading, sleep } from '../CommonHelper';
import { apiUrl, accountTypes, normalBalanceTypes } from '../Constant';

import * as yup from 'yup';

const validationSchema = yup.object().shape({
  code: yup.string().required(),
  name: yup.string().required(),
  accountGroup: yup.string().required(),
  type: yup.string().required(),
  normalBalance: yup.string().required(),
});

class AccountCreate extends Component {

  static contextType = GlobalContext;

  constructor(props) {
    super();

    this.state = {
      accountGroups: [],
      code: '',
      name: '',
      accountGroup: '',
      type: '',
      normalBalance: '',
      desc: '',
      validations: [],
      error: '',
      isLoading: false
    };

    this.submit = this.submit.bind(this);
  }

  codeChange = (ev) => this.setState({code: getEventTargetValue(ev)});
  nameChange = (ev) => this.setState({name: getEventTargetValue(ev)});
  typeChange = (ev) => this.setState({type: getEventTargetValue(ev)});
  normalBalanceChange = (ev) => this.setState({normalBalance: getEventTargetValue(ev)});
  accGroupChange = (ev) => this.setState({accountGroup: getEventTargetValue(ev)});
  descChange = (ev) => this.setState({desc: getEventTargetValue(ev)});

  async componentWillMount() {
    setLoading(true, this);

    let accountGroups = [];
    try {
      let response = await fetchHelper(`${apiUrl}/api/accountgroups/find?sortBy=id&sortOrder=ASC&page=1&size=1000`,{
        method: "POST",
        body: JSON.stringify({})
      });

      response = await response.json();
      accountGroups = response.map((val) => {
        return {label: val.name, value: val.id}
      })
      this.setState({accountGroups: accountGroups});
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

      try {
        await fetchHelper(`${apiUrl}/api/accounts`,{
          method: "POST",
          body: JSON.stringify({
            name: this.state.name,
            code: this.state.code,
            type: this.state.type,
            normalBalance: this.state.normalBalance,
            accountGroup: {
              id: this.state.accountGroup
            },
            desc: this.state.desc,
            isActive: true
          })
        });
        await sleep(1000);
        this.props.history.push('/accountgroup/');
      } catch(e) {
        this.setState({error: 'Error when saving'});
      } finally {
        setLoading(false, this);
      }
    }
  }

  render() {
    let submitClass = this.state.isLoading ? 'button is-link is-loading': 'button is-link';

    return (
      <div className="columns">
        <div className="column">
          <h1 className="title">Account</h1>
          <form>
            { this.state.error && 
              <div className="notification is-danger">{this.state.error}</div>
            }
            <InputText label="Code" name="code" type="text" value={this.state.code} 
                onChange={this.codeChange} validations={this.state.validations}/>            
            <InputText label="Name" name="name" type="text" value={this.state.name} 
                onChange={this.nameChange} validations={this.state.validations}/>
            <SelectBox label="Type" name="type" options={accountTypes}
                onChange={this.typeChange} validations={this.state.validations}/>  
            <SelectBox label="Normal Balance" name="normalBalance" options={normalBalanceTypes}
                onChange={this.normalBalanceChange} validations={this.state.validations}/>            
            <SelectBox label="Account Group" name="accountGroup" options={this.state.accountGroups}
                onChange={this.accGroupChange} validations={this.state.validations}/>    
            <InputText label="Description" name="desc" type="text" value={this.state.desc} 
                onChange={this.descChange} validations={this.state.validations}/>              
            
            <div className="field is-grouped">
              <div class="control">
                <button onClick={this.submit} className={submitClass}>Submit</button>
              </div>
              <div className="control">
                <Link to="/account" className="button is-text">Back</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AccountCreate;