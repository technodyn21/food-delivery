import React from "react";
import styles from "./ProductItem.module.css";
import ProductItemForm from "./ProductItemForm";

const ProductItem = (props) => {
  console.log('check');

  const price = props.price !== undefined ? `€${props.price.toFixed(2)}` : "";
  return (
    <li className={styles.meal}>
      <div>
        <h3>{props.name}</h3>
        <div className={styles.description}>{props.description}</div>
        <div className={styles.price}>{price}</div>
      </div>
      <div>
        {props.isLoggedIn && (
          <ProductItemForm item={props} addItem={props.addItem} />
        )}
      </div>
    </li>
  );
};

export default ProductItem;
