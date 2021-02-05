import React from 'react'

import './Card.css'
function Card({title,value,value_type,deff,source}) {
    return (
        <div className='card-container'>
            <div className="card-content">
                <div className='card-title'>
                    <h6>{title}</h6>
                </div>    
                <div className='card-body' >
                    <p>{value_type}</p>
                    <hr width="150px" color="black" /> 
                    <h4>{value}</h4>
                    <p>children is suffering from {deff}</p>
                    <h5>source: {source}</h5>
                </div>    

            </div>    
                
         </div>
    )
}

export default Card
