import React from "react";
import { Table } from 'react-bootstrap';
import Card from '../../components/Cards/Card/Card';
import ItemsCarousel from 'react-items-carousel';
import { useState } from "react";
import "./Cards.css"
import { first } from "lodash";
const Cards = ({ indicatorDetail , setSelIndicator, setSelTimeperiod}) => {
  console.log("indicatorDetail", indicatorDetail);

  let indicatorcount = 0;
  if (indicatorDetail) {
    indicatorDetail.map(indi => {
      indicatorcount++;

    });
  }

  let firstNumberIndex=0;
  var i;
  for(i=0;i<indicatorcount;i++){
      firstNumberIndex=i;
      if(indicatorDetail[i].unit.unit_name==='Number')
          break;
  }
  i=0;
  let j=firstNumberIndex;
  let colorvar1=true;
  if(indicatorDetail){
    var element1 = [];
    while(i<firstNumberIndex && j<indicatorcount){

      if (colorvar1 === true) {
          element1.push(<div className="card"> <Card
          id = {indicatorDetail[i].indicator.indicator_id}
          id1 = {indicatorDetail[i].timeperiod.timeperiod_id}
          title={indicatorDetail[i].indicator.indicator_name}
          value={indicatorDetail[i].data_value}
          value_type={indicatorDetail[i].unit.unit_name}
          setSelIndicator={setSelIndicator}
          setSelTimeperiod = {setSelTimeperiod}
          source={indicatorDetail[i].timeperiod.timeperiod}
          style="pink-card"
        
        /></div>
        );
        colorvar1 = false;
        i++;
      }
      else {
        element1.push(<div className="card"> <Card
          id = {indicatorDetail[j].indicator.indicator_id}
          id1 = {indicatorDetail[j].timeperiod.timeperiod_id}
          title={indicatorDetail[j].indicator.indicator_name}
          value={indicatorDetail[j].data_value}
          value_type={indicatorDetail[j].unit.unit_name}
          setSelIndicator={setSelIndicator}
          setSelTimeperiod = {setSelTimeperiod}
          source={indicatorDetail[j].timeperiod.timeperiod}
          style="green-card"
        /></div>
        );
        colorvar1 = true;
        j++;
      }
     

    }
    colorvar1=true;
    while(i<firstNumberIndex){

      if (colorvar1 === true) {
          element1.push(<div className="card"> <Card
          id = {indicatorDetail[i].indicator.indicator_id}
          id1 = {indicatorDetail[i].timeperiod.timeperiod_id}
          title={indicatorDetail[i].indicator.indicator_name}
          value={indicatorDetail[i].data_value}
          value_type={indicatorDetail[i].unit.unit_name}
          setSelIndicator={setSelIndicator}
          setSelTimeperiod = {setSelTimeperiod}
          source={indicatorDetail[i].timeperiod.timeperiod}
          style="pink-card"
        
        /></div>
        );
        colorvar1 = false;
        i++;
      }
      else {
        element1.push(<div className="card"> <Card
          id = {indicatorDetail[i].indicator.indicator_id}
          id1 = {indicatorDetail[i].timeperiod.timeperiod_id}
          title={indicatorDetail[i].indicator.indicator_name}
          value={indicatorDetail[i].data_value}
          value_type={indicatorDetail[i].unit.unit_name}
          setSelIndicator={setSelIndicator}
          setSelTimeperiod = {setSelTimeperiod}
          source={indicatorDetail[i].timeperiod.timeperiod}
          style="green-card"
        /></div>
        );
        colorvar1 = true;
        i++;
      }
    }
  }
  

  let card1;
  card1 = Math.floor(indicatorcount / 2);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  return (
    <React.Fragment>
      {element1}
    </React.Fragment>
  )
}
export default Cards;