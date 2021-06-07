import React from "react";
import "./Share.css";
import {
    EmailShareButton,
    FacebookShareButton,
    PinterestShareButton,
    RedditShareButton,
    TelegramShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton
    
  } from "react-share";

import { 
    FacebookIcon, 
    TwitterIcon,
    EmailIcon,
    TelegramIcon,
    WhatsappIcon,
    PinterestIcon,
    RedditIcon,
    LinkedinIcon 
} from "react-share";

const Share =({id})=> {
    const currentURL = window.location.href // returns the absolute URL of a page
    console.log(id, "id")
    return (
    <div className="container">
        <FacebookShareButton
            url={currentURL}
            id="btn"
        >
            <FacebookIcon size={40} round />
        </FacebookShareButton>
       
        <TwitterShareButton
            url={currentURL}
            id="btn"
        >
            <TwitterIcon size={40} round />
        </TwitterShareButton>
     
        <EmailShareButton
            url={currentURL}
            id="btn"
        >
            <EmailIcon size={40} round />
        </EmailShareButton>
       
        <TelegramShareButton
            url={currentURL}
            id="btn"
        >
            <TelegramIcon size={40} round />
        </TelegramShareButton>
       
        <WhatsappShareButton
            url={currentURL}
            id="btn"
        >
            <WhatsappIcon size={40} round />
        </WhatsappShareButton>
       
        <PinterestShareButton
            url={currentURL}
            id="btn"
        >
            <PinterestIcon size={40} round />
        </PinterestShareButton>
        
        <RedditShareButton
            url={currentURL}
            id="btn"
        >
            <RedditIcon size={40} round />
        </RedditShareButton>
       
        <LinkedinShareButton
            url={currentURL}
            id="btn"
        >
            <LinkedinIcon size={40} round />
        </LinkedinShareButton>

    </div>
  );
}
export default Share;

