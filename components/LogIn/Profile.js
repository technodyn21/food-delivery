import Modal from "../UI/Modal";
import useHttp from "../../hooks/use-http";
import fire from "../../utils/base";
import useHttpFire from "../../hooks/use-http-fire";
import { Fragment, useEffect, useState } from "react";

const cTimeToAlert = 4;
const cURLRefreshToken =
  "https://securetoken.googleapis.com/v1/token?key=AIzaSyCguUKxqFnbhE_og7pilLXIK--EJtioEUc";
const cPOST = "POST";
const cPOSTHeader = { "Content-Type": "application/x-www-form-urlencoded" };
const cGrantType = "refresh_token";
const cSuccessRefresh = "Sitzung wurde neu geladen";
const cSuccessSignOut = "Sie haben sich erfolgreich ausgeloggt";
const cFailSignOut = "Sie wurden nicht ausgeloggt";
const cSuccessChangePass = "Sie haben Ihr Passwort erfolgreich umgeändert.";
const cFailChangePass = "Ihr Passwort konnte nicht zurückgesetzt werden.";

const Profile = (props) => {
  console.log('check');

  //Http Hook
  const {
    isLoading,
    hasError,
    sendRequest,
    setHasError,
    setIsLoading,
    hasMessage,
    setHasMessage,
  } = useHttpFire();

  const [expDate, setexpDate] = useState("");
  const [timeLeft, settimeLeft] = useState("");
  const [password, setPassword] = useState("");

  const initDate = (Tokendate) => {
    let date = new Date(Tokendate);
    if (Tokendate === undefined) {
      setexpDate("");
      settimeLeft("");
      return;
    }
    const expMinutes = date.getMinutes().toString();
    setexpDate(
      date.getHours().toString() +
        ":" +
        (expMinutes.length === 1 ? "0" + expMinutes : expMinutes) +
        " Uhr"
    );
    settimeLeft(Math.floor((date - new Date()) / 60000));
    if (timeLeft < 0) {
      timeLeft = 0;
    } //falls es vorkommt
  };

  useEffect(() => {
    if (props.isloggedIn) {
      initDate(props.authctx.expiresIn);
    }
  }, []);

  const refreshToken = () => {
    sendRequest({ operation: "REFRESHTOKEN" }, (data) => {
      console.log("blub");
      initDate(data.expirationTime);
      props.profilectx.setContextLoginData({
        expiresIn: data.expirationTime,
      });
      return cSuccessRefresh;
    });
  };

  const signout = () => {
    sendRequest(
      {
        operation: "SIGNOUT",
        okmessage: cSuccessSignOut,
        rejectMessage: cFailSignOut,
      },
      (data) => {
        if (data) {
          console.log("blub");
          props.logout();
        } else {
        }
      }
    );
  };
  const changePass = () => {
console.log(password);
    
    sendRequest(
      {
        operation: "CHANGEPASS",
        okmessage: cSuccessChangePass,
        rejectMessage: cFailChangePass,
        password: password,
      },
      (data) => {
        if (data) {
          console.log("blub" , ' good');
          
        } else {
          console.log("blub" , ' fail' );
        }
      }
    );
  };

  const passOnchange = (event) => {
    setPassword(event.target.value);
  }


  const setProfileView = () => {
    props.profilectx.setProfileView(!props.profilectx.profileView);
  };
  const backdropFuncs = { onClick: setProfileView };
  const backdrop = {
    backdropFuncs: backdropFuncs,
  };
  return (
    <Modal backdrop={backdrop}>
      {!props.isloggedIn ? (
        <p>Nicht eingeloggt.</p>
      ) : (
        <Fragment>
          <p>Eingeloggt als {props.authctx.email}</p>
          {timeLeft > 0 && (
            <p>
              Ihre Sitzung läuft in {timeLeft} Minuten um {expDate} ab.
            </p>
          )}
          {timeLeft < cTimeToAlert && timeLeft > 1 && (
            <p> Ihre Sitzung läuft bald ab, bitte Sitzung erneuern.</p>
          )}
        </Fragment>
      )}
      {timeLeft < 1 && (
        <p>Ihre Sitzung ist abgelaufen, bitte melden Sie sich an.</p>
      )}

      {hasMessage && <p>{hasMessage}</p>}
      {props.isloggedIn && (
        <Fragment>
          <button onClick={refreshToken}>Sitzung neu</button>
          <button onClick={signout}>Ausloggen</button>
          <p>
            <button onClick={changePass}>Passwort ändern</button>
            <label htmlFor="password">neues Passwort</label>
            <input
            onChange={passOnchange}
              value={password}
              type="password"
              id="password"
              text="password"
            />
          </p>
        </Fragment>
      )}
    </Modal>
  );
};

export default Profile;
