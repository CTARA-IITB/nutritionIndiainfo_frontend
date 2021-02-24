import React from 'react'

import './Card.css'
function Card({ title, value, value_type,setSelIndicator ,deff, source, style }) {
    let changeColor=({setSelIndicator,title})=> {
console.log("i23")
setSelIndicator(title);
      }

    // let changeColor=({setSelIndicator})=> {
    //         setSelIndicator("2");    }
    return (
        <div className='card-container' className={style} >
            <div className="card-content" onClick={() => changeColor({setSelIndicator,title})}>
            
                 
                <div className='card-title'>
                    <h6>{title}</h6>
                </div>
                <div className='card-body' >
                    <p>{value_type}</p>
                    <hr width="150px" color="black" />
                    <h4>{value}</h4>
                    <p>children suffering from {deff}</p>
                    <h5>source: {source}</h5>
                </div>

            </div>

        </div >
    )
}

export default Card
