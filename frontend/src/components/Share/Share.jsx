import React,{useState,useEffect} from "react";
import "./Share.css";
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
        
        <img src={imageUrl}/> 
    </div>
  );
}
export default Share;
