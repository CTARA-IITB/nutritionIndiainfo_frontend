import React,{useState,useEffect} from "react";
import "./Share.css";
import * as htmlToImage from "html-to-image";

const ShareImage =({id})=> {

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
        <div></div>
  );
}
export default ShareImage;
