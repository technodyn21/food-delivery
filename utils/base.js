// import * as firebase from "firebase/app";
import firebase from "firebase/app";
import "firebase/auth";

let fire;

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyCguUKxqFnbhE_og7pilLXIK--EJtioEUc",
    authDomain: "https://identitytoolkit.googleapis.com",
    psrojectId: "react-ass-dbf96",
    appId: "react-ass-dbf96",
  });
} else {
  firebase.app(); // if already initialized, use that one
}

export default fire;
