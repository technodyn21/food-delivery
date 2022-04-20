import React, {
  useState,
  useReducer,
  useRef,
  useCallback,
  Fragment,
  useEffect,
  createContext,
} from "react";
import Modal from "../UI/Modal";
import styles from "./Login.module.css";
import InputForm from "../UI/InputForm";
import useHttp from "../../hooks/use-http";
import useHttpFire from "../../hooks/use-http-fire";

//_______________start_________________CONSTANTS______________________________________________

const cOperEmailEnter = "EMAIL_ENTER";
const cOperEmailValidate = "EMAIL_VALIDATE";
const cOperPassEnter = "PASS_ENTER";
const cOperPassValidate = "PASS_VALIDATE";
const cOperPassEnter2 = "PASS_ENTER_2";
const cOperPassValidate2 = "PASS_VALIDATE_2";
const cOperFormValidate = "FORM_VALIDATE";
const cOperCreateUserMenu = "FORM_CREATE_USER_MENU";
const cEmailLoginURL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCguUKxqFnbhE_og7pilLXIK--EJtioEUc";
const cPOST = "POST";
const cPOSTHeader = { "Content-Type": "application/json" };
const cPOSTHeaderType = "application/json";
const cCreateEmailURL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCguUKxqFnbhE_og7pilLXIK--EJtioEUc";
const cPassMissmatch = "Passwörter stimmen nicht überein";
const cSuccessCreate = "Ihr Benutzer wurde erfolgreich erstellt";
const cSuccessLogin = "Herzlich wilkommen!";
const cOKResponseCLoseCreateUserWindow = 2200;
const cOKResponseCLoseLoginWindow = 2200;
const cLoadingMsg = "Sie werden angemeldet...";
const cLoadingMsgCreate = "Ihr Benutzer wird erstellt...";
const cErrorMsgCreate = 'Erstellung fehlgeschlagen: ('
const cStandardDelay = 2000
//_______________start_________________FORM LOGIC______________________________________________

let mailTimeOutIdent = undefined;
let passTimeOutIdent = undefined;
let counter = 0;
let counterDelayed = 0;

//MailObj
const mailReduceObj = {
  emailValue: "",
  isEmailValid: undefined,
  passValue: "",
  isPassValid: undefined,
  passValue2: "",
  isPassValid2: undefined,
  isValid: undefined,
  createUsermode: false, //User wird erstellt
  error: "",
};

let validateFormDelayed = (state) => {
  console.log("FAIL");
};

const passValidRule = (value) => value.trim().length > 6;
const userValidRule = (value) => value.includes("@");

const validateForm = (state) => {
  let isValid = false;
  if (
    state.isPassValid &&
    state.isEmailValid &&
    (!state.createUsermode ? true : state.isPassValid2)
  ) {
    isValid = true;
  }
  state = { ...state, isValid: isValid };
  return state;
};

//________________end___________________FORM LOGIC______________________________________________

//________________start_________________LOGIN LOGIC______________________________________________

const convertExpTime = (data) => {
  const expIn = data.expiresIn;
  return {
    ...data,
    expiresIn: new Date(new Date().getTime() + +expIn * 1000).toString(),
  };
};

//______________________________________LOGIN COMPONENT__________________________________________

const LogIn = (props) => {
  //________________start_________________LOGIN LOGIC______________________________________________
  console.log('check');

  //Http Hook firebase
  const {
    isLoading,
    hasError,
    sendRequest: httpLogin,
    setHasError,
    setIsLoading,
    hasMessage,
    setHasMessage,
  } = useHttpFire();

//Http Hook
const {
  isLoading: isLoading2,
  hasError: hasError2,
  sendRequest: httpLogin2,
  setHasError: setHasError2,
  setIsLoading: setIsLoading2,
  hasMessage: hasMessage2,
  setHasMessage: setHasMessage2,
} = useHttp();

  const userCreate = () => {
    console.log('blub');

    httpLogin2(
      {
        url: cCreateEmailURL,
        method: cPOST,
        headers: cPOSTHeader,
        body: {
          email: formReduce.emailValue,
          password: formReduce.passValue,
          returnSecureToken: true,
        }, loading : cLoadingMsgCreate,
        error: cErrorMsgCreate,
        delayMsg : cStandardDelay
      },
      function (data) {
        props.loginObj.onLogin(
          convertExpTime(data),
          false,
          cOKResponseCLoseCreateUserWindow
        );
        return cSuccessCreate;
      }
    );
  };

  const userLogin = (event) => {
    console.log('blub');
    setIsLoading('Loading3');
    event.preventDefault();
    //Solution 2
    httpLogin(
      {
        operation: "LOGINMAIL",
        specs: {
          email: formReduce.emailValue,
          password: formReduce.passValue,
        }, loading : cLoadingMsg
      },
      function (login) {
        props.loginObj.onLogin(login, false, cOKResponseCLoseLoginWindow);
        return cSuccessLogin;
      }
      );
      // setIsLoading(false);
    
  };
  //______________end___________________LOGIN LOGIC______________________________________________

  //_______________start_________________FORM LOGIC______________________________________________

  const emailRef = useRef();
  const passRef = useRef();
  const passRef2 = useRef();

  const setLoginView = () => {
    props.loginObj.setLoginView(!props.loginObj.loginView);
  };
  const backdropFuncs = { onClick: setLoginView };
  const backdrop = {
    backdropFuncs: backdropFuncs,
  };

  const hideFormErr = () => {
    let timeIdent;
    timeIdent = setTimeout(() => {
      formReduceSetter({ operation: "" }); //clear Error
    }, 2000);
    return () => {
      clearTimeout(timeIdent);
    };
  };

  //UseReducer
  const formReducer = useCallback((state, input) => {
    let prevValidValue, passValue, isPassValid;
    let { emailValue } = state;
    let { emailValue: mail } = state;
    !!hasError && setHasError(false); // for now for all states
    !!isLoading && setIsLoading(false); // for now for all states
    state.error = "";
    switch (input.operation) {
      //____________start______EMAIL_ENTER - cOperEmailEnter_______________________
      case cOperEmailEnter:
        if (typeof mailTimeOutIdent !== "undefined") {
          clearTimeout(mailTimeOutIdent);
        }
        prevValidValue = state.isEmailValid;
        state = {
          ...state,
          emailValue: input.emailValue,
          isEmailValid: userValidRule(input.emailValue),
        };
        if (state.isEmailValid === true) {
          if (
            prevValidValue === false ||
            ("undefined" && state.isEmailValid === true)
          ) {
            state = validateForm(state);
          } else {
            mailTimeOutIdent = setTimeout(() => {
              state = validateFormDelayed(state);
            }, 500);
          }
        } else {
          state = { ...state, isValid: false };
        }
        return state;
      //____________end________EMAIL_ENTER - cOperEmailEnter_______________________

      //____________start______EMAIL_VALIDATE - cOperEmailValidate_________________
      case cOperEmailValidate:
        state = {
          ...state,
          isEmailValid: userValidRule(state.emailValue),
        };
        state = validateForm(state);
        return state;
      //____________end______EMAIL_VALIDATE - cOperEmailValidate_________________

      //____________start______PASS_ENTER  - cOperPassEnter____________________________
      case cOperPassEnter:
        prevValidValue = state.isPassValid;
        passValue = input.passValue;
        isPassValid = passValidRule(passValue);

        if (typeof passTimeOutIdent !== "undefined") {
          clearTimeout(passTimeOutIdent);
        }
        state = {
          ...state,
          passValue: passValue,
          isPassValid: isPassValid,
          isPassValid2: state.createUsermode
            ? passValue === state.passValue2
            : undefined,
        };
        if (isPassValid === true) {
          if (
            prevValidValue === false ||
            ("undefined" && isPassValid === true)
          ) {
            state = validateForm(state);
          } else {
            passTimeOutIdent = setTimeout(() => {
              state = validateFormDelayed(state);
            }, 500);
          }
        } else {
          state = { ...state, isValid: false };
        }

        return state;
      //____________end________PASS_ENTER - cOperPassEnter_________________________

      //____________start____PASS_ENTER2 - cOperPassEnter________________________
      case cOperPassEnter2:
        // prevValidValue = state.isPassValid2;
        passValue = input.passValue2;
        state = validateForm({
          ...state,
          passValue2: passValue,
          isPassValid2: input.passValue2 === state.passValue,
        });
        return state;
      //____________end________PASS_ENTER2 - cOperPassEnter______________________________

      //____________start________PASS_VALIDATE - cOperPassValidate_________________

      case cOperPassValidate:
        state = {
          ...state,
          isPassValid: passValidRule(state.passValue),
          isPassValid2: state.createUsermode
            ? state.passValue === state.passValue2
            : undefined,
        };
        state = validateForm(state);
        if (state.createUsermode && !state.isPassValid2) {
          state.error = cPassMissmatch;
          hideFormErr();
        }
        return state;
      //____________end________PASS_VALIDATE - cOperPassValidate_________________

      //____________start________PASS_VALIDATE2 - cOperPassValidate2_________________

      case cOperPassValidate2:
        state = {
          ...state,
          isPassValid2: state.passValue2 === state.passValue,
        };
        state = validateForm(state);
        if (!state.isPassValid2) {
          state.error = cPassMissmatch;
          hideFormErr();
        }
        return state;
      //____________end________PASS_VALIDATE2 - cOperPassValidate2_________________

      //____________start______FORM_VALIDATE - cOperFormValidate_________________
      case cOperFormValidate:
        return {
          ...state,
          isValid: true,
        };
      //____________end________FORM_VALIDATE - cOperFormValidate_________________

      //____________end________FORM_CREATE_USER_MENU - cOperCreateUserMenu_________________
      case cOperCreateUserMenu:
        return {
          ...state,
          createUsermode: true,
          isValid: false,
          isPassValid2: false,
        };
      //____________end________FORM_CREATE_USER_MENU - cOperCreateUserMenu_________________
      default:
        return state;
    }
  }, []);

  const [formReduce, formReduceSetter] = useReducer(formReducer, mailReduceObj);
  // REDUCER FUNCS
  validateFormDelayed = (state) => {
    validateForm(state);
    if (state.isValid) {
      formReduceSetter({ operation: cOperFormValidate });
    }
    return state;
  };

  const emailChangeHandler = (event) => {
    formReduceSetter({
      operation: cOperEmailEnter,
      emailValue: event.target.value,
    });
  };

  const passwordChangeHandler = (event) => {
    formReduceSetter({
      operation: cOperPassEnter,
      passValue: event.target.value,
    });
  };

  const passwordChangeHandler2 = (event) => {
    formReduceSetter({
      operation: cOperPassEnter2,
      passValue2: event.target.value,
    });
  };

  const onBlurEmailHandler = () => {
    formReduceSetter({ operation: cOperEmailValidate });
  };

  const onBlurPasswordHandler = () => {
    formReduceSetter({ operation: cOperPassValidate });
  };
  const onBlurPasswordHandler2 = () => {
    formReduceSetter({ operation: cOperPassValidate2 });
    //setHasError("aass");
  };

  const onFocusHandler = () => {
    setHasError(false);
    setIsLoading(false);
    setHasError2(false);
    setIsLoading2(false);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formReduce.isEmailValid && formReduce.isPassValid) {
      // props.loginObj.onLogin(formReduce.emailValue, formReduce.passValue);
    } else if (!formReduce.isEmailValid) {
      emailRef.current.focuss();
      return;
    } else if (!formReduce.isPassValid) {
      passRef.current.focuss();
      return;
    }
  };

  const mailCreateMenu = (event) => {
    if (formReduce.createUsermode) {
      userCreate();
    } else {
      event.preventDefault();
      formReduceSetter({ operation: cOperCreateUserMenu }); //Menu öffnen
    }
  };
  //________________end___________________FORM LOGIC______________________________________________

  //____________________________________RETURN LOGIC______________________________________________
  //Http Error hide
  useEffect(() => {
    let timeIdent;
    if (hasError) {
      timeIdent = setTimeout(() => {
        if (setHasError !== undefined) {
          setHasError(false);
        } else {
          hasError = false;
        }
      }, 3000);
      return () => {
        clearTimeout(timeIdent);
      };
    }
  }, [hasError]);

  const buttons = (
    <div className={styles.actions}>
      {!isLoading && !hasError && !hasMessage && (
        <button
          className={`${styles["button--alt"]} ${
            formReduce.createUsermode
              ? styles["button"]
              : styles["button--alt-left"]
          }`}
          onClick={mailCreateMenu}
          disabled={!formReduce.isValid}
        >
          Erstellen
        </button>
      )}
      {!isLoading && !hasError && !formReduce.createUsermode && !hasMessage && (
        <button
          className={styles["button"]}
          disabled={!formReduce.isValid}
          onClick={userLogin}
        >
          Login
        </button>
      )}

      <button className={styles["button--alt"]} onClick={setLoginView}>
        Schließen
      </button>

      {formReduce.error && <p>{formReduce.error}</p>}
      {hasError && <p>{hasError}</p>}
      {hasMessage && <p>{hasMessage}</p>}
      {isLoading && <p>{isLoading}</p>}
      {hasError2 && <p>{hasError2}</p>}
      {hasMessage2 && <p>{hasMessage2}</p>}
      {isLoading2 && <p>{isLoading2}</p>}

    </div>
  );
  const userInput = (
    <InputForm
      ref={emailRef}
      isValid={formReduce.isEmailValid}
      value={formReduce.emailValue}
      onChange={emailChangeHandler}
      onBlur={onBlurEmailHandler}
      onFocus={onFocusHandler}
      label="email"
      type="email"
      id="email"
      text="E-mail"
    ></InputForm>
  );

  const passInput = (
    <InputForm
      ref={passRef}
      isValid={formReduce.isPassValid}
      value={formReduce.passValue}
      onChange={passwordChangeHandler}
      onBlur={onBlurPasswordHandler}
      onFocus={onFocusHandler}
      label="password"
      type="password"
      id="password"
      text="Passwort"
    ></InputForm>
  );

  const passInput2 = (
    <InputForm
      ref={passRef2}
      isValid={formReduce.isPassValid2}
      value={formReduce.passValue2}
      onChange={passwordChangeHandler2}
      onBlur={onBlurPasswordHandler2}
      onFocus={onFocusHandler}
      label="password2"
      type="password"
      id="password2"
      text="Passwort erneut"
    ></InputForm>
  );

  return (
    <Modal backdrop={backdrop}>
      <form onSubmit={submitHandler}>
        {userInput}
        {passInput}
        {formReduce.createUsermode && passInput2}
        {buttons}
      </form>
    </Modal>
  );
};

export default LogIn;
