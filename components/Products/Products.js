import React, { Fragment } from "react";
import ProductSummary from "./ProductSummary";
import AvailableProducts from "./AvailableProducts";

const Products = () => {
  console.log('check');

  return (
    <Fragment>
      <ProductSummary />
      <AvailableProducts />
    </Fragment>
  );
};

export default Products;
