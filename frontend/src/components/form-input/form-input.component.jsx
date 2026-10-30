import React from "react";
import "./form-input.styles.scss";

const FormInput = ({ handleChange, label, id, ...otherProps }) => {
  const inputId = id || otherProps.name;
  return (
    <div className="group">
      <input
        className="form-input"
        id={inputId}
        aria-label={label}
        onChange={handleChange}
        {...otherProps}
      />
      {label ? (
        <label
          htmlFor={inputId}
          className={`${
            otherProps.value && otherProps.value.length ? "shrink" : ""
          } form-input-label`}
        >
          {label}
        </label>
      ) : null}
    </div>
  );
};

export default FormInput;
