import React, { useContext } from "react";
import styles from "./Cart.module.css";
import Modal from "../UI/Modal";
import OverallContext from "./../../Context/overall-context";
import CartItem from "./CartItem";

const Cart = (props) => {
  console.log('check');
  const ctx = useContext(OverallContext);

  const totalAmount = `€${ctx.cart.totalAmount.toFixed(2)}`;

  const hasItems = ctx.cart.items.length > 0 ? true : false;

  const cartItems = (
    <ul className={styles["cart-items"]}>
      {ctx.cart.items.map((item) => {
        return (
          <CartItem
            key={item.id}
            name={item.name}
            amount={item.amount}
            price={item.price}
            onRemove={ctx.cart.removeItem.bind(null, item.id)}
            onAdd={ctx.cart.addItem.bind(null, { ...item, amount: 1 })}
          />
        );
      })}
    </ul>
  );

  const setCartView = () => {
    ctx.cart.setCartView(!ctx.cart.cartView);
  };
  const backdropFuncs = { onClick: setCartView };
  const backdrop = {
    backdropFuncs: backdropFuncs,
  };

  return (
    <Modal backdrop={backdrop}>
      {cartItems}
      <div className={styles.total}>
        <span>Gesamtbetrag</span>
        <span>{totalAmount}</span>
      </div>
      <div className={styles.actions}>
        {hasItems && <button className={styles.button}> Bestellen</button>}
        <button className={styles["button--alt"]} onClick={setCartView}>
          Schließen
        </button>
      </div>
    </Modal>
  );
};

export default Cart;
