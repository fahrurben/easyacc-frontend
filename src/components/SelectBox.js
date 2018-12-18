import React from 'react';

const SelectBox = (props) => {
  let {
    name,
    label,
    options,
    value,
    readonly = false
  } = props;

  const error = props.validations[props.name] !== undefined ? props.validations[props.name] : null;
  const onChange = typeof props.onChange !== 'undefined' && !readonly ? props.onChange : (e) => {};

  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <select onChange={onChange} name={name}>
          <option value="">{label}</option>
          {
            options && options.map((row,key) => {
              const selected = row.value === value ? true : false;
              return <option key={key} value={row.value} selected={selected}>{row.label}</option>
            })
          }
        </select>
      </div>
      {
        error && <p className="help is-danger">
          {error}
        </p>
      }
    </div>
  )
};

export default SelectBox;