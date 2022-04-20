import React, { useContext, useRef, useState } from "react";
import styles from "./ProductItemForm.module.css";
import Input from "../../UI/Input";

const ProductItemForm = (props) => {
  console.log("check");

  const inputRef = useRef();
  const [errMsg, setErrMsg] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const enteredAmount = inputRef.current.value.trim();
    const enteredAmountNum = +enteredAmount;

    //user could enter
    if (enteredAmountNum < 1 || enteredAmountNum > 5) {
      setErrMsg(true);
      return;
    }
    setErrMsg(false);
    props.addItem({ ...props.item, amount: enteredAmountNum });
  };

  return (
    <form className={styles.form} onSubmit={onSubmitHandler}>
      <Input
        label="Menge"
        input={{
          id: "amount " + props.item.id,
          type: "number",
          min: "1",
          // max: "5",
          step: "1",
          defaultValue: "1",
          // onChange: setAmount
          ref: inputRef,
        }}
      />
      <button>+ nehmen</button>
      {errMsg && <p>Bitte korrekte Quantität eingeben.</p>}
    </form>
  );
};

export default ProductItemForm;
