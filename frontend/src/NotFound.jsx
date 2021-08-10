import React from 'react';
import { Link } from 'react-router-dom';
let origin = window.location.origin;
export const NotFound = () => (

<div id="content" style={{margin:'auto',height:"100vh"}}>
<div>
       <p><br></br></p>  
       <p><br></br></p>   
       
          <h1 class="error-page-title">404</h1>
          <p>Page not found.</p>
          <h4>Please use the <a        
            href={`${window.location.origin}`}>Home Page</a></h4>

         <p><br></br></p>
         <p><br></br></p>
 
</div>
 
</div>

  
);
