import React, { Fragment } from "react";
import HeaderLogInButton from "./HeaderLogInButton";
import styles from "./Header.module.css";
import HeaderCartButton from "./HeaderCartButton";
import Image from "next/image";

const Header = (props) => {
  // const win = Dimensions.get('window');
  // const ratio = win.width/541;
  // const styleImg = {
  //   width: win.width,
  //   height: 362 * ratio, //362 is actual height of image
  // }
  console.log('check');

  return (
    <Fragment>
      <header className={styles.header}>
        <span className={styles["logo-text"]}>
          <h2>ASS Fresh Food Service</h2>
        </span>
        <HeaderCartButton />
        <HeaderLogInButton />
      </header>
      <div className={styles["main-image"]}>
        <Image
          src="/assets/meals.jpg"
          alt="MMM Essen!"
          layout="fill"
          style={{
            alignSelf: "left",
            height: '100',
            width: '100',
            borderWidth: 15,
            borderRadius: 375,
          }}
          resizeMode="stretch"
        />
      </div>
    </Fragment>
  );
};
export default Header;
