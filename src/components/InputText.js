import React from 'react';

const InputText = (props) => {

  let {
    name,
    label,
    value,
    type = "text",
    readonly = false
  } = props;

  const error = props.validations[props.name] !== null ? props.validations[props.name] : null;
  const onChange = typeof props.onChange !== 'undefined' && !readonly ? props.onChange : (e) => {};

  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <input className="input" type={type} placeholder="Text input" value={value} name={name}
          onChange={onChange} />
      </div>
      {
        error && <p className="help is-danger">
          {error}
        </p>
      }
    </div>
  )
};

export default InputText;