import React, { Fragment, useContext } from "react";
import styles from "./Modal.module.css";
import ReactDOM from "react-dom";

const Backdrop = (props) => {
  return (
    <div className={styles.backdrop} {...props.backdrop.backdropFuncs}></div>
  );
};

const ModalOverlay = (props) => {
  return (
    <div className={styles.modal}>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

const Modal = (props) => {
  // const portalEl = document.getElementById("overlays");

  return (
    <Fragment>
      <Backdrop backdrop={props.backdrop} />
      <ModalOverlay modalOverlay={props.modalOverlay}>
        {props.children}
      </ModalOverlay>
    </Fragment>
  );
};

export default Modal;
