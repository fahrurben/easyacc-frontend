import React from 'react';

const Checkbox = (props) => {
  let {
    name,
    label,
    value,
    readonly = false
  } = props;

  const error = props.validations[props.name] !== undefined ? props.validations[props.name] : null;
  const onClick = typeof props.onChange !== 'undefined' && !readonly ? props.onChange : (e) => {};

  return (
    <div className="field">
      <label className="label"></label>
      <div className="control">
        <label class="checkbox">
          <input type="checkbox" name={name} checked={value} onClick={onClick}/>
          {label}
        </label>
      </div>
      {
        error && <p className="help is-danger">
          {error}
        </p>
      }
    </div>
  )
};

export default Checkbox;