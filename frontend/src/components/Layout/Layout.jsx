
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import  {shouldComponentUpdate} from "react";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { BarChart } from "../../components/BarChart/BarChart";
// import 'react-dropdown/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Table } from 'react-bootstrap';
// import ClipLoader from "react-spinners/ClipLoader";
import { SkeletonCard, SkeletonDropdown, SkeletonMapCard } from "../SkeletonCard";
import {Bar,Line} from 'react-chartjs-2';

// import Form from "../../components/Form/Form";
import { Map } from "../../components/Map/Map";
import { useData, useDataDistrict, useDataState, useNewBoundaries ,useNewDistrictBoundaries} from '../UseData'
import { json } from 'd3';

import Cards from '../../components/Cards/Cards.jsx';
import SplitPane, { Pane } from 'react-split-pane';
import "./Layout.css";
import { TextCenter } from "react-bootstrap-icons";

// const renderedMap = (boundaries) => (boundaries.state);

export const Layout = ({ 
  tab,
  setLevel,
  selIndicator,
  selSubgroup,
  selTimeperiod, setSelIndicator, setSelSubgroup, setSelTimeperiod, indicatorDropdownOpt, setIndicatorDropdownOpt,subgroupDropdownOpt, setSubgroupDropdownOpt,
  timeperiodDropdownOpt, setTimeperiodDropdownOpt, unit, selArea, areaName, setIsSelected, indicatorBar, setIndicatorBar,
  indicatorDetail, setIndicatorDetail, indicatorTrend, setIndicatorTrend, selIndiaData, setSelIndiaData, parentArea, isLevelThree, setAreaName,
  level, setSelArea, setIsLevelThree, searchRef, filterDropdownValue, setFilterDropdownValue, areaDropdownOpt, setAreaDropdownOpt, indicatorSense, selNutritionData, setSelNutritionData}) => { 


  console.log("tab", tab); 
  console.log("level", level);
  console.log("areaName", areaName);
  const [selStateData, setSelStateData] = useState(null);
  const [switchDisplay,setSwitchDisplay] = useState(true);
  const [toggleState, setToggleState] = useState(true)
  const [buttonText, setButtonText] = useState("District");
  const changeText = (text) => setButtonText(text);


  
  
  let barLabel=[];
  let barData=[];
  let graphTitle;
  let graphUnit;
  let graphArea;
  let graphTimeperiod;
  let datab =[];
  let trendLabel=[];
  let trendData=[];
  let graphSubgroup;
  
  useEffect(() => {
    const url = `http://localhost:8000/api/getIndicatorBar/${selIndicator}/${selTimeperiod}/${selArea}`;
    json(url).then( options =>{
      setIndicatorBar(options);
    })
    const url_1 = `http://localhost:8000/api/getIndicatorTrend/${selIndicator}/${selSubgroup}/${selArea}`;
    json(url_1).then(indicatorTrend => {
      setIndicatorTrend(indicatorTrend)
    })
  }, [selIndicator, selSubgroup, selTimeperiod, selArea])

  useEffect(() => {
    const url = `http://127.0.0.1:8000/api/getIndicatorDetails/${tab}/${selArea}`;
    json(url).then(indicatorDetail => {
      setIndicatorDetail(indicatorDetail)

    })
  }, [tab, selArea])

  useEffect(() => {
    let url;
    if (level === 1)
    {
      url = `http://localhost:8000/api/indiaMap/${selIndicator}/${selSubgroup}/${selTimeperiod}/2`
      json(url).then(data => {
        setSelIndiaData(data);
      })
    }
    else if (level === 2) {
      if (isLevelThree)
        url = `http://localhost:8000/api/areaData/${selIndicator}/${selSubgroup}/${selTimeperiod}/${parentArea}`
      else
        url = `http://localhost:8000/api/areaData/${selIndicator}/${selSubgroup}/${selTimeperiod}/${selArea}`;
        json(url).then(data => {
          setSelStateData(data);
        })
    }
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selIndicator, selSubgroup, selTimeperiod, selArea, parentArea])

  useEffect(() => {
    //switch Display
    const switchurl=`http://localhost:8000/api/getDistrictDetails/${selIndicator}/${selSubgroup}/${selTimeperiod}`;
    json(switchurl).then(data =>{
      if(data.length)
        setSwitchDisplay(true);
      else
        setSwitchDisplay(false);
    })
  }, [selIndicator, selSubgroup, selTimeperiod])

  if (indicatorDetail) {
    indicatorDetail.map(indi => {
       if(indi.indicator.indicator_id === parseInt(selIndicator))
         { 
           graphTitle=indi.indicator.indicator_name;
           graphUnit = indi.unit.unit_name;
           graphArea = indi.area.area_name;
           graphTimeperiod = indi.timeperiod.timeperiod;  
           //setSelTimeperiod((indi.timeperiod.timeperiod_id).toString());
           //setSelSubgroup('6');
         }
       });
     
   }
 
  if(indicatorBar)
  {
    indicatorBar.map(i=>{
      barLabel.push(i.subgroup.subgroup_name+";"+i.subgroup.sub_category)
      barData.push(+i.data_value)
    })
    var colors = []
    for(var i = 0; i < barLabel.length; i++){
      if(barLabel[i].split(";")[1] === 'null')
      {
        colors[i] = 'rgb(0,153,255)';
      }
      else  if(barLabel[i].split(";")[1] === 'Sex')
      {
        colors[i] = 'rgb(254,225,211)';
      }
      else  if(barLabel[i].split(";")[1] === 'Location')
      {
        colors[i] = 'rgb(251,161,167)';
      }
      else  if(barLabel[i].split(";")[1] === 'Caste')
      {
        colors[i] = 'rgb(247,104,161)';
      }
      else  if(barLabel[i].split(";")[1] === 'Wealth Index')
      {
        colors[i] = 'rgb(230,23,173)';
      }
      
    }
     datab= {
          labels:barLabel,
          datasets: [{
          label: [graphTitle, graphUnit],
          data:barData,
          xAxisID:'xAxis1',
          //backgroundColor: "rgb(255, 99, 132)"
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 1
          }]
    }
  }

  if(indicatorTrend)
  {
  graphSubgroup = indicatorTrend[0].subgroup.subgroup_name;
  indicatorTrend.map(i=>{
    trendLabel.push(i.timeperiod.timeperiod)
    trendData.push(+i.data_value)
  })
  }
 
  let  datal= {
    labels:trendLabel,
    datasets: [{
    label: [graphTitle, graphUnit, graphSubgroup],
    fill: false,
    lineTension:0,
    borderWidth:3,
    borderColor:'rgb(106, 166, 41)',
    data:trendData
    }]
   
  }

  const boundaries = useData();
  const newBoundaries = useNewBoundaries();
  const Dboundaries = useDataDistrict();
  const NewDboundaries = useNewDistrictBoundaries();
  // console.log("NEWDBOUND",NewDboundaries)
  const stateBoundary = useDataState(areaName, Dboundaries);
  console.log("stateboundary", stateBoundary);
  const newDistrictBoundaries = useDataState(areaName, NewDboundaries)
  const handleClick = () => {
    setToggleState(!toggleState);
    let text = null;
    if (buttonText === 'District')
      text = 'state';
    else
      text = 'District';
    changeText(text);
  }


  if (!boundaries || !stateBoundary  || !newBoundaries) {
    return <div><SkeletonDropdown /><Row><SkeletonCard /><SkeletonMapCard /> </Row> </div>
  }

  let renderMap = null;
  let nutritionData = selIndiaData;
  console.log("selStateData", selStateData);
 
  console.log("stateboundary", stateBoundary.features);
  if (level === 1 || stateBoundary.features === undefined || newDistrictBoundaries.features === undefined)
   {
      if (selTimeperiod === '22')    // change state boundaries when timeperiod is NFHS5
        renderMap = newBoundaries.new_state;
      else
        renderMap = boundaries.state;
   }
   else{
    if (selStateData.length > 0) {
      if(selTimeperiod === '22')
      renderMap = newDistrictBoundaries;
      else
      renderMap = stateBoundary;
    nutritionData =selStateData;
    } else {
      renderMap = boundaries.state;
    }
   }
   console.log("selIndiaData", selIndiaData);
  return (
 <React.Fragment>
  <div className="layout">
  <div className="layout__body">
    <div className="layout__body__left">
            <div className="layout__body__left__cards">
              <Cards key ={selIndicator} indicatorDetail={indicatorDetail} 
              setSelIndicator={setSelIndicator} setSelTimeperiod={setSelTimeperiod}
              />
            </div>
            <div className="layout__body__left__trend">
              <Line data={datal} options = {{
                legend:
                {
                  display: false,
                },
                 title: {
                  display: true,
                  text: [graphTitle+','+graphUnit+','+graphSubgroup, 'TrendData'+ ', '+ graphArea],
                  fontColor: "black",
              },
                scales: {
                    xAxes: [{
                      offset: true,
                      gridLines: {
                        drawOnChartArea:false
                    },
                    ticks: {
                      minRotation: 0,
                  }
                    }],
                    yAxes: [{
                      gridLines: {
                        drawOnChartArea:false
                    },
                    ticks: {
                      padding: 10,
                  }
                  }]

                }

               }}
              />
            </div>
      </div>
      <div className="layout__body__right">
      <div className="layout__body__right__map">
              {
              nutritionData !== null && nutritionData.length > 0 ? 
              <Map geometry={renderMap} 
              data={nutritionData} 
              onMapClick={setAreaName} 
              setLevel={setLevel} 
              level={level} 
              setSelArea={setSelArea} 
              unit={unit} 
              unitName={graphUnit} 
              selArea={selArea} 
              isLevelThree={isLevelThree} 
              setIsLevelThree={setIsLevelThree} 
              handleClick={handleClick} 
              searchRef={searchRef} 
              setFilterDropdownValue={setFilterDropdownValue} 
              areaDropdownOpt={areaDropdownOpt} 
              selIndicator={selIndicator}
              indicatorSense={indicatorSense} 
              switchDisplay={switchDisplay}
              toggleState={toggleState}

              />
                : <div className="text-center"></div>
              }
            </div>
            <div className="layout__body__right__bar">
            <Bar data={datab}  options={{
          legend:
          {
            display: false,
          },
          title: {
            display: true,
            text: [graphTitle +','+ graphUnit, graphArea +', '+ graphTimeperiod],
            fontColor: "black",
        },
          scales: {
            xAxes:[{
              id:'xAxis1',
              type:"category",
              ticks:{
                callback:function(label){
                  var subgroup = label.split(";")[0];
                  return subgroup;
                }
              },
              gridLines: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },

            },
            {
              id:'xAxis2',
              type:"category",
              gridLines: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
              ticks:{
                minRotation: 0,
                callback:function(label){
                  var subgroup = label.split(";")[0];
                  var type = label.split(";")[1];
                  if(subgroup === "Rural" || subgroup === "Female"  || subgroup ==="ST" || subgroup === "Middle"){
                    return type
                  }
                  else
                  return ""
                }  
              },
              gridLines: {
                drawOnChartArea:false
            }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                drawOnChartArea:false
            }
            }]
          }
        }}
      />    
             
            </div>
            </div>  
        </div>
     </div>
    </React.Fragment> 
  )
}

