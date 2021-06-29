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
    
    useEffect(()=> {
        if (navigator.share === undefined) {
          if (window.location.protocol === 'http:') {
            window.location.replace(window.location.href.replace(/^http:/, 'https:'));
          } 
        }
    }, []);

    const handleOnSubmit= async()=> {
        const response = await fetch(imageUrl);
        // here image is url/location of image
        const blob = await response.blob();
        const file = new File([blob], 'share.jpg', {type: blob.type});
        console.log(file);
        if(navigator.share) {
          await navigator.share({
            title: "title",
            text: "your text",
            url: "url to share",
            files: [file]     
          })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error in sharing', error));
        }else {
          console.log(`system does not support sharing files.`);
        }
    }
    return (
        <div>
            <button onClick={handleOnSubmit} />
        </div>
    );
}
export default ShareImage;
