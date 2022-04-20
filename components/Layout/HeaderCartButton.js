import React, { useContext, useEffect, useState, Fragment } from "react";
import styles from "./HeaderCartButton.module.css";
import CartIcon from "./../Cart/CartIcon";
import OverallContext from "../../Context/overall-context";

const HeaderCartButton = (props) => {
  const ctx = useContext(OverallContext);
  console.log('check');

  const showHideCart = () => {
    ctx.cart.setCartView(!ctx.cart.cartView);
  };

  //BumEffect
  const [sCartBump, sSetCartBump] = useState(false);
  const buttonStyles = `${styles.button}  ${sCartBump ? styles.bump : ""}`;
  useEffect(() => {
    if (ctx.cart.quant === 0) {
      return;
    }
    sSetCartBump(true);
    const timer = setTimeout(() => {
      sSetCartBump(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [ctx.cart.quant]);

  return (
    <Fragment>
      <button className={buttonStyles} onClick={showHideCart}>
        <span className={styles.icon}>
          <CartIcon />
        </span>
        <span>Warenkorb</span>
        <span className={styles.badge}>{ctx.cart.quant}</span>
      </button>
    </Fragment>
  );
};

export default HeaderCartButton;
