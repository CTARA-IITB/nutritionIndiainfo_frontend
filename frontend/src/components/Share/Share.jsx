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

const Share =()=> {
    const currentURL = window.location.href // returns the absolute URL of a page
    return (
    <div className="share">
        <FacebookShareButton
            url={currentURL}
        >
            <FacebookIcon size={40} round />
        </FacebookShareButton>
       
        <TwitterShareButton
            url={currentURL}
        >
            <TwitterIcon size={40} round />
        </TwitterShareButton>
     
        <EmailShareButton
            url={currentURL}
        >
            <EmailIcon size={40} round />
        </EmailShareButton>
       
        <TelegramShareButton
            url={currentURL}
        >
            <TelegramIcon size={40} round />
        </TelegramShareButton>
       
        <WhatsappShareButton
            url={currentURL}
        >
            <WhatsappIcon size={40} round />
        </WhatsappShareButton>
       
        <PinterestShareButton
            url={currentURL}
        >
            <PinterestIcon size={40} round />
        </PinterestShareButton>
        
        <RedditShareButton
            url={currentURL}
        >
            <RedditIcon size={40} round />
        </RedditShareButton>
       
        <LinkedinShareButton
            url={currentURL}
        >
            <LinkedinIcon size={40} round />
        </LinkedinShareButton>

    </div>
  );
}
export default Share;

