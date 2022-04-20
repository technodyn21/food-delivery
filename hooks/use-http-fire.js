import { useState, useCallback } from "react";
// import fire from "../utils/base";
import firebase from "firebase";

const useHttpFire = () => {
  console.log('check');

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasMessage, setHasMessage] = useState(false);

  const sendRequest = useCallback((requestConfig, applyData) => {
    let okmessage;
    setIsLoading(true);
    setHasError(null);
    setHasMessage(requestConfig.loading);
    switch (requestConfig.operation) {
      case "LOGINMAIL":
        const successCallbackMailLogin = function (login) {
          console.log("blub");
          let expiresIn;
          const success = (data) => {
            console.log("success", data);
            expiresIn = data.expirationTime;
          };
          const fail = (data) => {
            console.log("fail", data);
            expiresIn = new Date(
              new Date().toUTCString().getTime() + 60 * 60 * 1000
            );
          };

          const applyDataCallback = () => {
            okmessage = applyData({
              email: login.user.email,
              expiresIn: expiresIn,
            });
            if (okmessage !== undefined) {
              setHasMessage(okmessage);
            }
          };

          firebase
            .auth()
            .currentUser.getIdTokenResult(true)
            .then(success, fail)
            .then(applyDataCallback)
            .catch(() => {
              setHasMessage(false);
              setHasError(error.message);
            });
        };

        const errorCallbackMailLogin = function (error) {
          const msg =
            "Anmeldung fehlgeschlagen: (" + error.code + ") " + error.message;
          throw new Error(msg);
        };

        firebase
          .auth()
          .signInWithEmailAndPassword(
            requestConfig.specs.email,
            requestConfig.specs.password
          )
          .then(successCallbackMailLogin, errorCallbackMailLogin)
          .catch((error) => {
            console.log("here");
            //alert(error);
            setHasMessage(false);
            setHasError(error.message);
          });

        break;

      case "REFRESHTOKEN":
        const success = (data) => {
          console.log("success", data);
          okmessage = applyData(data);
          if (okmessage !== undefined) {
            setHasMessage(okmessage);
          }
        };
        const fail = (data) => {
          console.log("fail", data);
          const msg =
            "Sitzung konnte nicht erneuert werden: (" +
            error.code +
            ") " +
            error.message;
          throw new Error(msg);
        };
        if (firebase.auth() !== undefined) {
          firebase
            .auth()
            .currentUser.getIdTokenResult(true)
            .catch((error) => {
              alert(error);
              setHasError(error.message);
            })
            .then(success, fail)
            .catch((error) => {
              alert(error);
              setHasError(error.message);
            });
        } else {
          alert("Fehler beim Aufruf der Funktion");
        }
        break;

      case "SIGNOUT":
        firebase
          .auth()
          .signOut()
          .then((data) => {
            console.log("signed out");
            setHasMessage(requestConfig.okmessage);
            setTimeout(() => {
              setHasMessage("");
            }, 2000);
            applyData(true);
          })
          .catch((err) => {
            applyData(false);
            console.log("failed");
            setHasMessage(requestConfig.rejectMessage);
            setTimeout(() => {
              setHasMessage("");
            }, 2000);
          });
        break;
      case "CHANGEPASS":
        if (firebase.auth() !== undefined && firebase.auth().currentUser !== undefined) {
          firebase
            .auth()
            .currentUser.updatePassword(requestConfig.password)
            .then(() => {
              setHasMessage(requestConfig.okmessage);
              applyData(false);
            })
            .catch((error) => {
              alert(error);
              setHasError(error.message);
              setHasMessage(requestConfig.rejectMessage + error.message);
              applyData(false);
            })
        } else {
          alert("Fehler beim Aufruf der Funktion");
        }
        break;
      default:
        break;
    }

    setIsLoading(false);
  }, []);

  return {
    isLoading,
    hasError,
    sendRequest,
    setHasError,
    setIsLoading,
    hasMessage,
    setHasMessage,
  };
};

export default useHttpFire;
