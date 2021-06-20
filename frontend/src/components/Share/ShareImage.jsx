import React,{useState,useEffect} from "react";
import "./Share.css";
import Share from 'react-native-share';
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
    const customShare = async()=>{
        const shareOptions={
            message:"India map",
            url: {imageUrl}
        }
        try{
                const shareResponse = await Share.open(shareOptions);
        }catch{
            console.log('Error =>',error);
        }
    }

    return (
    <div className="container">
        <button onClick={customShare}>Share</button> 
    </div>
  );
}
export default ShareImage;
