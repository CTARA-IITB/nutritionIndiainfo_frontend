import React from "react";
import "./Popup.css";

const Popup = props => {
    return (
      <div className="popup-box">
        <span className="close-icon" onClick={props.handleClose}>x</span>
        <div className="box">
          {props.content}
        </div>
      </div>
    );
  };
  
export default Popup;