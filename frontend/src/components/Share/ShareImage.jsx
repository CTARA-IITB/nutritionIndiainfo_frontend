import React,{useState,useEffect} from "react";
import "./Share.css";
import * as htmlToImage from "html-to-image";
import { WhatsappIcon,WhatsappShareButton,TwitterIcon,TwitterShareButton} from 'react-share';

const ShareImage =({id,title,selLifecycle,selCategory,selIndicator})=> {

  const [imageUrl,setImageUrl]= useState();
  useEffect(()=>{
      var node = document.getElementById(id);
      htmlToImage.toPng(node)
      .then(function(dataUrl) {
          var  img = new Image();
          img.src = dataUrl;
          setImageUrl(img);
      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error);
      }); 
  })
  const url =  `${window.location.href}/${selLifecycle}/${selCategory}/${selIndicator}`;
  // const LinkPreview = <LinkPreview url={url}/>

  return (
    < div className="container"  >
      <TwitterShareButton title={title} url={url}> <TwitterIcon  size={35} round={true}/></TwitterShareButton> 
      <WhatsappShareButton title={title} url={url}> <WhatsappIcon size={35} round={true}/></WhatsappShareButton>
    </div>
  );
}
export default ShareImage;
