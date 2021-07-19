import React from "react";
import "./Popup.css";

const Popup = props => {
    return (
      <div className="popup-box z-20">
        <div className="box z-20">
          <span className="close-icon" onClick={props.handleClose}>x</span>
          {props.content}
        </div>
      </div>
    );
  };
  
export default Popup;