import React from "react";
import "./Share.css";
import {TwitterShareButton, WhatsappShareButton} from "react-share";
import {TwitterIcon,WhatsappIcon} from "react-share";
import * as htmlToImage from "html-to-image";

const Share =({id})=> {

    var node = document.getElementById(id);
    htmlToImage.toPng(node)
    .then(function(dataUrl) {
        var  img = new Image();
        img.src = dataUrl;
        
        // document.body.appendChild(img);
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });

    return (
    <div className="container">
        
        {/* <TwitterShareButton url={img1}>
            <TwitterIcon size={40} round />
        </TwitterShareButton> */}
        
        <WhatsappShareButton >
            <WhatsappIcon size={40} round />
        </WhatsappShareButton> 
    </div>
  );
}
export default Share;

