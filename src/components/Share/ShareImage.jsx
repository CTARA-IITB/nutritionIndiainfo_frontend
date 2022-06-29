import React,{useState,useEffect} from "react";
import "./Share.css";
import { WhatsappIcon,WhatsappShareButton,TwitterIcon,TwitterShareButton,FacebookIcon,FacebookShareButton} from 'react-share';

const ShareImage =({title,selLifecycle,selCategory,selIndicator})=> {
  const [url,setUrl]= useState();
  useEffect(()=>{
    setUrl(`${window.location.origin}/dashboard/${selLifecycle}/${selCategory}/${selIndicator}`);
    // eslint-disable-next-line
  },[])
  return (
    <div className="container"  >
      <TwitterShareButton title={title} url={url}> <TwitterIcon  size={35} round={true}/></TwitterShareButton> 
      <WhatsappShareButton title={title}  url={url}> <WhatsappIcon size={35} round={true}/></WhatsappShareButton>
      <FacebookShareButton title={title}  url={url}> <FacebookIcon size={35} round={true}/> </FacebookShareButton>
    </div>
  );
}
export default ShareImage;
