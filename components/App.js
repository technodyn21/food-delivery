import React, { Fragment, useContext } from "react";

import Header from "./Layout/Header";
import Products from "./Products/Products";
import Cart from "./Cart/Cart";
import OverallContext from "../Context/overall-context";
import LogIn from "./LogIn/Login";
import Profile from "./LogIn/Profile";

function App() {
  let ctx = useContext(OverallContext);
  console.log('check');

  return (
    <Fragment>
      {ctx.cart.cartView && <Cart />}
      {ctx.login.loginView && <LogIn loginObj={ctx.login} />}
      { ctx.profile.profileView && (
        <Profile 
        profilectx={ctx.profile}
         authctx={ctx.login.auth}
          refresh={ctx.login.refreshToken} 
          logoutAlert={ctx.login.logoutAlert} 
          isloggedIn={ctx.login.isLoggedIn} 
          logout={ctx.login.onLogout}/>
      )}
      <Header />
      <main>
        <Products />
      </main>
    </Fragment>
  );
}

export default App;
