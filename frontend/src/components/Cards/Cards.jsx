import React from "react";
import { Table } from 'react-bootstrap';
import Card from '../../components/Cards/Card/Card';
import ItemsCarousel from 'react-items-carousel';
import { useState, useEffect } from "react";
import "./Cards.css"
import { json } from 'd3';
// const Cards = ({ indicatorDetail,  setIndicatorDetail,selArea, tab, setSelIndicator, boundaries, newBoundaries, Dboundaries, NewDboundaries,
//   stateBoundary, newDistrictBoundaries}) => {
    const Cards = ({ indicatorDetail,  setIndicatorDetail,selArea, tab, setSelIndicator, boundaries}) => {

     console.log("boundaries", boundaries);
    // console.log("newBoundaries", newBoundaries);
    // console.log("Dboundaries", Dboundaries);
    // console.log("NewDboundaries", NewDboundaries);

  useEffect(() => {
    const url = `http://127.0.0.1:8000/api/getIndicatorDetails/${tab}/${selArea}`;
    json(url).then(indicatorDetail => {
      setIndicatorDetail(indicatorDetail)

    })
  }, [tab, selArea])

  console.log("indicatordetail", indicatorDetail);
  let indicatorcount = 0;
  if (indicatorDetail) {
    indicatorDetail.map(indi => {
      indicatorcount++;

    });
  }
  let card1;
  card1 = Math.floor(indicatorcount / 2);

  const [activeItemIndex, setActiveItemIndex] = useState(0);

  let colorvar1 = true;
  if (indicatorDetail) {
    var element1 = [];
    for (var i = 0; i < indicatorcount; i++) {
      if (colorvar1 === true) {
        element1.push(<div className="card"> <Card
          id = {indicatorDetail[i].indicator.indicator_id}
          title={indicatorDetail[i].indicator.indicator_name}
          value={indicatorDetail[i].data_value}
          value_type={indicatorDetail[i].unit.unit_name}
          setSelIndicator={setSelIndicator}
          deff='underweight'
          source={indicatorDetail[i].timeperiod.timeperiod}
          style="pink-card"

        /></div>
        );
        colorvar1 = false;
      }
      else {
        element1.push(<div className="card"> <Card
          id = {indicatorDetail[i].indicator.indicator_id}
          title={indicatorDetail[i].indicator.indicator_name}
          value={indicatorDetail[i].data_value}
          value_type={indicatorDetail[i].unit.unit_name}
          setSelIndicator={setSelIndicator}
          deff='underweight'
          source={indicatorDetail[i].timeperiod.timeperiod}
          style="green-card"
        /></div>
        );
        colorvar1 = true;
      }

    }
  }
  return (
    <React.Fragment>
      {element1}
    </React.Fragment>
  )
}
export default Cards;