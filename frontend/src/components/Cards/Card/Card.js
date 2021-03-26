import React from 'react'
import SentenceOnCard from './SentenceOnCard'
import './Card.css'
function Card({id, title, value, value_type, setSelIndicator, deff, source, style }) {
    const  changeColor = ({setSelIndicator, id, setOnCardClick})=> {
setSelIndicator(id.toString());
      }

    // let changeColor=({setSelIndicator})=> { 
    //         setSelIndicator("2");    }
    const sentence =<SentenceOnCard title={title} value_type={value_type}/>
    return (
        <div className='card-container' className={style} >
            <div className="card-content" onClick={() => changeColor({setSelIndicator, id})}>
            
                 
                <div className='card-title'>
                    <h6>{title}</h6>
                </div>
                <div className='card-body' >
                    <p>{value_type}</p>
                    <hr width="150px" color="black" />
                    <h4>{value}</h4>
                    <p>{sentence}</p>
                    <h5>source: {source}</h5>
                </div>

            </div>

        </div >
    )
}

export default Card
