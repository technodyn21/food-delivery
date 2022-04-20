import React, { Fragment, useContext } from "react";
import styles from "./HeaderCartButton.module.css";
import LogInIcon from "../LogIn/LogInIcon";
import OverallContext from "../../Context/overall-context";
import LoggedInIcon from "../LogIn/LoggedInIcon";

const HeaderLogInButton = () => {
  const ctx = useContext(OverallContext);
  console.log('check');

  const loginHandler = () => {
    if (!ctx.login.isLoggedIn) {
      //Log-in
      ctx.login.setLoginView(!ctx.login.loginView);
    } else {
      //Log-out
      ctx.profile.setProfileView(!ctx.profile.profileView)
      //ctx.login.onLogout();
    }
  };
  return (
    <button className={styles.button} onClick={loginHandler}>
      <span className={styles.icon}>
        {ctx.login.isLoggedIn ? <LoggedInIcon /> : <LogInIcon />}
      </span>
      <span>
        {ctx.login.isLoggedIn ? (
          <Fragment>
            Log-out, <u> {ctx.login.shortMail}</u>
          </Fragment>
        ) : (
          "Log-in"
        )}
      </span>
      {ctx.login.isLoggedIn && (
        <span>
          <p> </p>
        </span>
      )}
    </button>
  );
};

export default HeaderLogInButton;
