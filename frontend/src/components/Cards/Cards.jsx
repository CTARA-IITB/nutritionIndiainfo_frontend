import React from "react";
import { Table } from 'react-bootstrap';
import Card from '../../components/Cards/Card/Card';
import ItemsCarousel from 'react-items-carousel';
import { useState } from "react";
const Cards = ({ indicatorDetail, chevronWidth }) => {

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
    for (var i = 0; i < card1; i++) {
      if (colorvar1 === true) {
        element1.push(<div className="left-card green-card"> <Card
          title={indicatorDetail[i].indicator.indicator_name}
          value={indicatorDetail[i].data_value}
          value_type={indicatorDetail[i].unit.unit_name}
          deff='underweight'
          source={indicatorDetail[i].timeperiod.timeperiod}

        /></div>
        );
        colorvar1 = false;
      }
      else {
        element1.push(<div className="left-card pink-card"> <Card
          title={indicatorDetail[i].indicator.indicator_name}
          value={indicatorDetail[i].data_value}
          value_type={indicatorDetail[i].unit.unit_name}
          deff='underweight'
          source={indicatorDetail[i].timeperiod.timeperiod}
        /></div>
        );
        colorvar1 = true;
      }

    }
    var element2 = [];
    let colorvar2 = true;
    for (i = card1; i < (indicatorDetail.length); i++) {
      if (colorvar2 === true) {
        element2.push(<div className="right-card pink-card"> <Card
          title={indicatorDetail[i].indicator.indicator_name}
          value={indicatorDetail[i].data_value}
          value_type={indicatorDetail[i].unit.unit_name}
          deff='underweight'
          source={indicatorDetail[i].timeperiod.timeperiod}

        /></div>
        );
        colorvar2 = false;
      }
      else {
        element2.push(<div className="right-card green-card"> <Card
          title={indicatorDetail[i].indicator.indicator_name}
          value={indicatorDetail[i].data_value}
          value_type={indicatorDetail[i].unit.unit_name}
          deff='underweight'
          source={indicatorDetail[i].timeperiod.timeperiod}
        /></div>
        );
        colorvar2 = true;
      }
    }
  }
  return (
    <React.Fragment>

      <ItemsCarousel
        requestToChangeActive={setActiveItemIndex}
        activeItemIndex={activeItemIndex}
        numberOfCards={1}
        gutter={20}
        leftChevron={<button className=' w3-button w3-black arrow left'></button>}
        rightChevron={<button className='w3-button w3-black arrow right'></button>}
        outsideChevron
        chevronWidth={chevronWidth}
      >

        <div style={{ height: 600, width: 500, background: 'white' }}>
          <Table >
            <tr >
              <td style={{ paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 }}>{element1}</td>
              <td style={{ paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 }}>{element2}</td>
            </tr>
          </Table>
        </div>
      </ItemsCarousel>

    </React.Fragment>
  )
}
export default Cards;