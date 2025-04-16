import React,{useState,useEffect} from "react";
import "./Share.css";
import { FaXTwitter } from 'react-icons/fa6'
import { WhatsappIcon,WhatsappShareButton,TwitterIcon,TwitterShareButton,FacebookIcon,FacebookShareButton,LinkedinIcon,LinkedinShareButton,XIcon} from 'react-share';

const ShareImage =({title,selLifecycle,selCategory,selIndicator})=> {
  const [url,setUrl]= useState();
  useEffect(()=>{
    setUrl(`${window.location.origin}/dashboard/${selLifecycle}/${selCategory}/${selIndicator}`);
    // eslint-disable-next-line
  },[])
  return (
    <div className="container"  >
      <TwitterShareButton title={title} url={url}>  <FaXTwitter size={35} style={{ borderRadius: '50%' }} /></TwitterShareButton> 
      <LinkedinShareButton title={title} url={url}> <LinkedinIcon  size={35} round={true}/></LinkedinShareButton> 
      <WhatsappShareButton title={title}  url={url}> <WhatsappIcon size={35} round={true}/></WhatsappShareButton>
      <FacebookShareButton title={title}  url={url}> <FacebookIcon size={35} round={true}/> </FacebookShareButton>
    </div>
  );
}
export default ShareImage;
