import React from 'react'

import './Card.css'
function Card({id, id1, title, value, value_type, setSelIndicator, setSelTimeperiod, deff, source, style }) {
    const  changeColor = ({setSelIndicator, setSelTimeperiod, id, id1})=> {
console.log("IIIIIID",id);
console.log("IIIIIID",id1);
setSelIndicator(id.toString());
setSelTimeperiod(id1.toString());
      }

    // let changeColor=({setSelIndicator})=> { 
    //         setSelIndicator("2");    }
    return (
        <div className='card-container' className={style} >
            <div className="card-content" onClick={() => changeColor({setSelIndicator, setSelTimeperiod, id, id1})}>
            
                 
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