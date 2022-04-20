import React, { useEffect, useState, useContext } from "react";
import styles from "./AvailableProducts.module.css";
import Card from "../UI/Card";
import ProductItem from "./ProductItem/ProductItem";
import useHttp from "../../hooks/use-http";
import OverallContext from "../../Context/overall-context";


const cFetchProductsURL =
  "https://react-ass-dbf96-default-rtdb.europe-west1.firebasedatabase.app/Products.json";


const AvailableProducts = () => {
  console.log('check');

  const [sAvailableProducts, sSetAvailableProducts] = useState([]);
  //Http Hook
  const {
    isLoading2,
    hasError2,
    sendRequest: loadProducts,
    setHasError2,
    setIsLoading2,
    hasMessage2,
    setHasMessage2,
  } = useHttp();

  const ctx = useContext(OverallContext);

  useEffect(() => {
    loadProducts(
      {
        url: cFetchProductsURL,
      }, (data) => {
        sSetAvailableProducts(applyHttpData(data));
      }
    );
  }, [ctx.login.isLoggedIn]);

  const applyHttpData = (data) => {
    let availableProducts = [];
    for (const key in data) {
      const price = ctx.login.isLoggedIn ? data[key].price:undefined;
      availableProducts.push(
      <ProductItem
        key= {key}
        id={key}
        name={data[key].name}
        description={data[key].description}
        price={price}
        addItem={ctx.cart.addItem}
        isLoggedIn={ctx.login.isLoggedIn}
      />
      );
    }
      return availableProducts;
  };
  
  return (
    <section className={styles.products}>
      <Card>
        <ul>{sAvailableProducts}</ul>
      </Card>
    </section>
  );
};

export default AvailableProducts;
