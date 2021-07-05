import React,{useState,useEffect} from "react";
import "./Share.css";
import * as htmlToImage from "html-to-image";
import { WhatsappIcon,WhatsappShareButton,TwitterIcon,TwitterShareButton} from 'react-share';

const ShareImage =({id,sel})=> {

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
    
  return (
    < div className="container"  >
      <TwitterShareButton  url="http://localhost:3000/5/1/18"> <TwitterIcon  size={25}/></TwitterShareButton> 
      <WhatsappShareButton url="http://localhost:3000/5/1/18"> <WhatsappIcon size={25}/></WhatsappShareButton>
    </div>
  );
}
export default ShareImage;
