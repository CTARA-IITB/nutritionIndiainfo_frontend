import React from 'react';
import { Link } from 'react-router-dom';
let origin = window.location.origin;
export const NotFound = ({httpStatusCode, httpStatusMsg}) => (
<div id="content" style={{margin:'auto',height:"100vh"}}>
<div>
       <p><br></br></p>  
       <p><br></br></p>   
       
          <h4 class="error-page-title" style={{fontSize:'30px'}}>{httpStatusCode} Page not found error</h4>
          <p>{httpStatusMsg}</p>
          <h4>Please use the <a   style={{color:'blue'}}     
            href={`${window.location.origin}`}>Home Page</a></h4>

         <p><br></br></p>
         <p><br></br></p>
 
</div>
 
</div>

  
);
