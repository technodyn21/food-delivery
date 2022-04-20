import React, { useEffect, useRef, useImperativeHandle } from "react";

import classes from "./InputForm.module.css";


const InputForm = 
React.forwardRef((props, ref) => {
  const inputRef = useRef();

  const focus = () => {
    inputRef.current.focus();
  };
  useImperativeHandle(ref, () => {
    return {
      focuss: focus,
    };
  });

  return (
    <div
      className={`${classes.control} ${
        props.isValid === false ? classes.invalid : ""
      }`}
    >
      <label htmlFor={props.label}>{props.text}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
      />
    </div>
  );
});
InputForm.displayName = 'InputForm'
export default InputForm;
