import React from "react";
import styles from "./ProductSummary.module.css";

const ProductSummary = () => {
  console.log('check');

  return (
    <section className={styles.summary}>
      <h2>PREISE ZUM SPAREN - LEISTUNG ZUM VERTRAUEN!</h2>
      <p>
        {" "}
        Jeden Tag erreichen unsere eigenhändig ausgesuchten Frischeprodukte aus
        aller Welt, Kunden im Bereiche der Hotellerie, Catering, Großküchen,
        Gastronomie sowie alle Betriebe die unser Sortiment benötigen.
      </p>
    </section>
  );
};

export default ProductSummary;
