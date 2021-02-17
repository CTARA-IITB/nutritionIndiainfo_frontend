import React from 'react'

import './Card.css'
function Card({ title, value, value_type, deff, source, style,indicator_id,setSelIndicator }) {
    let changeDropdownValue=(indicator_id,title)=>{
        setSelIndicator(title)

        // console.log(indicator_id,title,"id and title")
    }
    return (
        <div className='card-container' className={style} >
            <div className="card-content" onClick={()=>changeDropdownValue(indicator_id,title)}>
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
