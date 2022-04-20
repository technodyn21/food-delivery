import React, {
  Context,
  useState,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";

//_______________________CONSTANTS____________________________
const lStorageToken = "21ASS_AUTH_TOKEN_ID";
const lStorageTokenExpTime = "21ASS_AUTH_TOKEN_EXP";
const lStorageEmail = "21ASS_AUTH_MAIL";
const lStorageLocalId = "21ASS_AUTH_LOCAL_ID";
const lStorageRefreshToken = "21ASS_AUTH_REFRESH_TOKEN";
const lStorageRegistered = "21ASS_AUTH_REGISTERED";
const cMinutesEndSessionAlert = 3;
//__________start______________________LOGIN & AUTH LOGIC___________________________________
const authFirebaseObj = {
  email: "",
  expiresIn: "",
  idToken: "",
  localId: "",
  refreshToken: "",
  registered: false,
};

const cartObj = {
  cartView: false,
  setCartView: () => {},
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  quant: 0,
};

const loginObj = {
  isLoggedIn: false,
  setLoggedIn: () => {},
  loginView: false,
  setLoginView: () => {},
  onLogin: () => {},
  onLogout: () => {},
  auth: authFirebaseObj,
  logoutAlert: false,
  refreshToken: () => {},
};

const profileObj = {
  profileView: () => {},
  setProfileView: () => {},
};

const contextObj = {
  cartView: false,
  setCartView: () => {},
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  quant: 0,
  cart: cartObj,
  login: loginObj,
  profile: profileObj,
};

const truncateMail = (mail) =>
  mail !== undefined && mail.split("@")[0].substring(0, 11); //maximal 11 Zeichen vor dem @

let logoutTimer;

const retrieveToken = () => {
  const storedMail = localStorage.getItem(lStorageEmail);
  const storedExpirationDate = localStorage.getItem(lStorageTokenExpTime);

  if (!storedMail || !storedExpirationDate) return null;

  const remainingTime =
    new Date(storedExpirationDate).getTime() - new Date().getTime();

  if (remainingTime <= 3600) {
    //3 Sek. übrig
    unSetLocalStorage();
    //Token refresh
    return null;
  }
  return {
    email: storedMail,
    expiresIn: storedExpirationDate,
  };
};

const getLocalStorageToken = () => {
  return {
    email: localStorage.getItem(lStorageEmail),
    expiresIn: localStorage.getItem(lStorageTokenExpTime),
  };
};

const setLocalStorage = (data) => {
  unSetLocalStorage(); // falls vorhanden
  localStorage.setItem(lStorageTokenExpTime, data.expiresIn);
  localStorage.setItem(lStorageEmail, data.email);
};

const unSetLocalStorage = () => {
  localStorage.removeItem(lStorageToken);
  localStorage.removeItem(lStorageTokenExpTime);
  localStorage.removeItem(lStorageEmail);
  localStorage.removeItem(lStorageTokenExpTime);
  localStorage.removeItem(lStorageLocalId);
  localStorage.removeItem(lStorageRefreshToken);
  localStorage.removeItem(lStorageRegistered);
};
//___________end______________________LOGIN & AUTH LOGIC___________________________________

//___________start____________________CART LOGIC___________________________________________
const defReducerObj = {
  totalAmount: 0,
  items: [],
  quant: 0,
};

const cartReducer = (state, action) => {
  if (action.action !== undefined) {
    //vars & constants
    let existingIndex = -1;
    let updatedtotalAmount = 0;
    let updatedItems = [];
    let updatedItem = {};
    switch (action.action) {
      case "ADD":
        updatedtotalAmount =
          state.totalAmount + action.item.price * action.item.amount;
        updatedItems = [...state.items];
        existingIndex = state.items.findIndex(
          (item) => item.id === action.item.id
        );

        if (existingIndex < 0) {
          updatedItems = updatedItems.concat(action.item);
        } else {
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            amount: updatedItems[existingIndex].amount + action.item.amount,
          };
        }

        const updatedQuant = state.quant + action.item.amount;
        return {
          totalAmount: updatedtotalAmount,
          items: updatedItems,
          quant: updatedQuant,
        };
        break;

      case "REM":
        existingIndex = state.items.findIndex((item) => item.id === action.id);
        //no action required
        if (existingIndex < 0 || state.items[existingIndex].amount === 0) {
          return state;
        }
        //References
        updatedItems = [...state.items];
        updatedItem = updatedItems[existingIndex];
        //-1 item
        //TTL Amount
        updatedtotalAmount = state.totalAmount - updatedItem.price;
        //items
        updatedItem = {
          ...updatedItem,
          amount: updatedItem.amount - 1,
        };

        //References
        if (updatedItem.amount === 0) {
          //delete item
          updatedItems.splice(existingIndex, 1);
        } else {
          updatedItems[existingIndex] = updatedItem; //or filter
        }
        return {
          totalAmount: updatedtotalAmount,
          items: updatedItems,
          quant: state.quant - 1,
        };
        break;
      default:
        break;
    }
  }
  return defReducerObj;
};

//___________end_______________________CART LOGIC__________________________________________
const OverallContext = React.createContext(contextObj);

//______________________________________COMPONENT___________________________________________

export const OverallContextProvider = (props) => {
  //___________start____________________CART LOGIC__________________________________________

  const [cartState, dispatchCartState] = useReducer(cartReducer, defReducerObj);
  const a = 5;
  //CartView show/hide
  const [sCartview, sSetCartView] = useState(contextObj.cartView);

  const addItemHandler = (item, quant) => {
    dispatchCartState({ action: "ADD", item: item, quant: quant });
  };
  const removeItemHandler = (id) => {
    dispatchCartState({ action: "REM", id: id });
  };
  //___________end_______________________CART LOGIC__________________________________________

  //___________start_____________________LOGIN LOGIC________________________________________
  //Login Controller
  const [sIsLoggedIn, sSetLoggedIn] = useState(contextObj.login.isLoggedIn);
  const [sLoginview, sSetLoginView] = useState(contextObj.login.loginView);
  //Auth Objects
  const [sAuthObj, sSetAuthObject] = useState(authFirebaseObj);
  const [sShortMail, sSetShortMail] = useState(""); //truncated mail before @
  const [logoutAlert, setLogoutAlert] = useState(false);

  useEffect(() => {
    const token = retrieveToken();
    if (token) {
      userLogin(token, true); //falls Token vorhanden
    }
  }, []);

  const initLogoutAlert = (date) => {
    let estTime = new Date(date) - new Date(new Date().toUTCString());
    console.log(estTime);
    const timeIdent = setTimeout(() => {
      setLogoutAlert(true);
    }, estTime);
    return () => {
      clearTimeout(timeIdent);
    };
  };
  const setContextLoginData = (data)=> {
    initLogoutAlert(data.expirationTime);
    sSetLoggedIn(true);
    sSetAuthObject(data);
  }
  const userLogin = useCallback((data, reload, loginViewDelay) => {
    console.log('check');

    setContextLoginData(data);
    sSetShortMail(truncateMail(data.email));

    !reload && setLocalStorage(data); // falls Cookies vorhanden nicht neu speichern
    if (loginViewDelay) {
      let timeIdent;
      timeIdent = setTimeout(() => {
        sSetLoginView(false);
      }, loginViewDelay);
      return () => {
        clearTimeout(timeIdent);
      };
    } else {
      sSetLoginView(false);
    }
    return "OK";
  }, []);

  const userLogout = useCallback(() => {
    sSetLoggedIn(false);
    sSetAuthObject(null);
    sSetShortMail("");
    sSetShortMail("");
    unSetLocalStorage();
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const refreshToken = (data) => {
    console.log("refresh", data);
  };
  //___________end______________________LOGIN LOGIC______________________________________________

  //___________start____________________PROFILE LOGIC________________________________________

  const [profileView, setProfileView] = useState();
  //___________end______________________PROFILE LOGIC______________________________________________

  //___________start____________________CONTEXT LOGIC______________________________________________
  const contextObj2 = {
    ...contextObj,
    cart: {
      cartView: sCartview,
      setCartView: sSetCartView,
      addItem: addItemHandler,
      removeItem: removeItemHandler,
      totalAmount: cartState.totalAmount,
      items: cartState.items,
      quant: cartState.quant,
    },
    login: {
      ...loginObj,
      isLoggedIn: sIsLoggedIn,
      // setLoggedIn: sSetLoggedIn,
      loginView: sLoginview,
      setLoginView: sSetLoginView,
      onLogin: userLogin,
      onLogout: userLogout,
      auth: sAuthObj,
      setAuth: sSetAuthObject,
      //setShortMail: sSetShortMail,
      shortMail: sShortMail,
      logoutAlert,
      refreshToken,
    },
    profile: {
      profileView: profileView,
      setProfileView: setProfileView,
      setContextLoginData
    },
  };

  //____________________________________RETURN LOGIC______________________________________________
  return (
    <OverallContext.Provider value={contextObj2}>
      {props.children}
    </OverallContext.Provider>
  );
};
export default OverallContext;
