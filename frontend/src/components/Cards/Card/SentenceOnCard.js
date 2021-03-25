  
  import React from "react";

  function SentenceOnCard({title,value_type}){
  
      let sentence=null
     
      if({title}.title.includes('severe') && {title}.title.includes('stunting')){
          return (sentence=<div> Children were suffering from severe stunting </div>);
      }
      else if({title}.title.includes('severe') && {title}.title.includes('wasting')){
          return (sentence=<div> Children were suffering from severe wasting </div>);
      }
      else if({title}.title.includes('severe') && {title}.title.includes('underweight')){
          return (sentence=<div> Children were severely underweight </div>);
      }
      else if({title}.title.includes('stunting')){
          return (sentence=<div> Children were suffering from stunting </div>);
      }
      else if({title}.title.includes('wasting')){
          return (sentence=<div> Children were suffering from wasting </div>);
      }
      else if({title}.title.includes('underweight')){
          return (sentence=<div> Children were underweight </div>);
      }
      else if({title}.title.includes('low birth')){
          return (sentence=<div> Children had low birth weight </div>);
      }
      else if({title}.title.includes('Infant Mortality') && {value_type}.value_type=='Deaths per 1000 live births'){
          return (sentence=<div> Children out of 1000 died before rearching their 1st birthday</div>);
      }
      else if({title}.title.includes('Infant Mortality') && {value_type}.value_type=='Number'){
          return (sentence=<div> Children died before rearching their 1st birthday</div>);
      }
      else if({title}.title.includes('Under-five Mortality') && {value_type}.value_type=='Deaths per 1000 live births'){
          return (sentence=<div> Children out of 1000 died before rearching their 5th birthday</div>);
      }
      else if({title}.title.includes('Under-five Mortality') && {value_type}.value_type=='Number'){
          return (sentence=<div> Children died before rearching their 5th birthday</div>);
      }
      
      return <div> {sentence}</div>;
    
  
  }
  export default SentenceOnCard