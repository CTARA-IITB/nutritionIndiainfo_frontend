import React,{useState,useEffect} from "react";
import "./Share.css";
import {TwitterShareButton, WhatsappShareButton} from "react-share";
import {TwitterIcon,WhatsappIcon} from "react-share";
import ShareBtn from 'react-share-button';
import * as htmlToImage from "html-to-image";

const Share =({id})=> {

    const [imageUrl,setImageUrl]= useState();

    useEffect(()=>{
        var node = document.getElementById(id);
        htmlToImage.toPng(node)
        .then(function(dataUrl) {
            var  img = new Image();
            img.src = dataUrl;
            setImageUrl(dataUrl);
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        }); 
    })
    return (
    <div className="container">
        {/* <TwitterShareButton url={imageUrl}>
            <TwitterIcon size={40} round/>
        </TwitterShareButton> */}
        {/* <img src={imageUrl}/>  */}
        {/* <ShareBtn 
            url={imageUrl}
            className='ib'
            displayText='Share'
        /> */}
    </div>
  );
}
export default Share;

