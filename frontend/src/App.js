import React, { useState, useEffect, useRef } from "react";

import {Layout} from "./components/Layout/Layout";
import 'bootstrap/dist/css/bootstrap.min.css';       // added bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';       // added bootstrap
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';   
import { Dropdown } from "./components/Dropdown/Dropdown";
import { json } from 'd3';

import { Navbars } from "./components/Navbar/Navbars";
import { createHierarchy } from './utils';
const App = ()=> {
  const iniSelArea = '1';  //india
  const [tabId, setTabId] = useState(null);
  const [selArea, setSelArea] = useState(iniSelArea);
  const iniSelIndicator = '12';
  const [selIndicator, setSelIndicator] = useState(iniSelIndicator);
  const iniSelSubgroup = '6';  //All
  const [selSubgroup, setSelSubgroup] = useState(iniSelSubgroup);

  const iniSelTimeperiod = '22';  //NHHS5
  const [selTimeperiod, setSelTimeperiod] = useState(iniSelTimeperiod);
  const [areaName, setAreaName] = useState('IND');
  const [level, setLevel] = useState(1);
  const [areaList, setAreaList] = useState(null);
  const [isLevelThree, setIsLevelThree] = useState(false);
  const searchRef = useRef();
  const [filterDropdownValue, setFilterDropdownValue] = useState([]);
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
  const [parentArea, setParentArea] = useState(null);
  const [unit, setUnit] = useState(1);

  const [indicatorDropdownOpt, setIndicatorDropdownOpt] = useState([]);
  const [timeperiodDropdownOpt, setTimeperiodDropdownOpt] = useState([]);
  const [subgroupDropdownOpt, setSubgroupDropdownOpt] = useState([]);
  const [isSelected , setIsSelected] = useState(true);
  const [openDropdown,setOpenDropdown] = useState(false);
  const treeRef = useRef();
  const [stateID,setStateID] = useState(null);
  const[indicatorBar, setIndicatorBar]= useState();
  const [indicatorDetail, setIndicatorDetail] = useState(null);
  const [indicatorTrend, setIndicatorTrend]=useState(null);
  const [selIndiaData, setSelIndiaData] = useState(null);
  const [selNutritionData, setSelNutritionData] = useState(null);
  const [indicatorSense, setIndicatorSense] = useState('Negative');


  let tab;
    if(tabId === undefined || tabId === 'section1')
    {
      tab =8;
    }
    else if(tabId === 'section2'){
      tab=1;
    }
    else if(tabId === 'section3'){
      tab=3;
    }
    else if(tabId === 'section4'){ 
      tab=6;
    }

    useEffect(() => {
      const url = 'http://localhost:8000/api/area';
      json(url).then( options =>{
      const [country,statesID] = createHierarchy(options);
      setStateID(statesID)
      setAreaDropdownOpt(country);
      setAreaList(options);  
      }
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  useEffect(() => {
    console.log("in usereffect initial");
    const url = 'http://localhost:8000/api/indicator/'+tab;
    json(url).then( options =>{
      setIndicatorDropdownOpt(options);
    } )
    const url_1 = `http://localhost:8000/api/subgroup/${selIndicator}`;
    json(url_1).then(options => {
      setSubgroupDropdownOpt(options);
    })
   const  url_2 = `http://localhost:8000/api/timeperiod/${selIndicator}/${selSubgroup}/1`;
    json(url_2).then( options =>{
      setTimeperiodDropdownOpt(options);
    } )
    const url_3 = `http://localhost:8000/api/getUnit/${selIndicator}`;
    json(url_3).then(unit => {
      setUnit(unit[0].unit)
    })
    const url_4 = `http://localhost:8000/api/getIndicatorBar/${selIndicator}/${selTimeperiod}/${selArea}`;
    json(url_4).then( options =>{
      setIndicatorBar(options);
    })
    const url_5 = `http://localhost:8000/api/getIndicatorDetails/${tab}/${selArea}`;
    json(url_5).then(indicatorDetail => {
      setIndicatorDetail(indicatorDetail)

    })
    const url_6 = `http://localhost:8000/api/getIndicatorTrend/${selIndicator}/${selSubgroup}/${selArea}`;
    json(url_6).then(indicatorTrend => {
      setIndicatorTrend(indicatorTrend)
    })
    
    const url_7 = `http://localhost:8000/api/indiaMap/${selIndicator}/${selSubgroup}/${selTimeperiod}/2`;
    json(url_7).then(data => {
      setSelIndiaData(data);
      setSelNutritionData(data);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId])


    return(<> 

    <Navbars setTabId={setTabId}/>
    <Dropdown
      tabId={tabId}
      selArea={selArea}
      selIndicator={selIndicator}
      selSubgroup={selSubgroup}
      selTimeperiod={selTimeperiod}
      setSelArea={setSelArea}
      setAreaName={setAreaName}
      setSelIndicator={setSelIndicator}
      setSelSubgroup={setSelSubgroup}
      setSelTimeperiod={setSelTimeperiod}
      setLevel={setLevel}
      level={level}
      setAreaList={setAreaList}
      setIsLevelThree={setIsLevelThree}
      searchRef={searchRef}
      filterDropdownValue={filterDropdownValue}
      setFilterDropdownValue={setFilterDropdownValue}
      areaDropdownOpt={areaDropdownOpt}
      setAreaDropdownOpt={setAreaDropdownOpt}
      parentArea={parentArea}
      isLevelThree={isLevelThree}
      setUnit ={setUnit}
      isSelected = {isSelected}
      setIsSelected ={setIsSelected}
      indicatorDropdownOpt ={indicatorDropdownOpt}
      setIndicatorDropdownOpt = {setIndicatorDropdownOpt}
      subgroupDropdownOpt = {subgroupDropdownOpt}
      setSubgroupDropdownOpt = {setSubgroupDropdownOpt}
      timeperiodDropdownOpt = {timeperiodDropdownOpt}
      setTimeperiodDropdownOpt ={setTimeperiodDropdownOpt}
      unit = {unit}
      areaList ={areaList}
      setParentArea = {setParentArea}
      stateID = {stateID}
      treeRef = {treeRef}
      openDropdown ={openDropdown}
      setOpenDropdown = {setOpenDropdown}
      setIndicatorSense = {setIndicatorSense}
    />
    {isSelected? <Layout 
      tab={tab}
      setLevel={setLevel}
      selIndicator={selIndicator}
      selSubgroup={selSubgroup} 
      selTimeperiod={selTimeperiod}
      setSelIndicator = {setSelIndicator}
      setSelSubgroup = {setSelSubgroup}
      setSelTimeperiod = {setSelTimeperiod}
      indicatorDropdownOpt ={indicatorDropdownOpt}
      setIndicatorDropdownOpt = {setIndicatorDropdownOpt}
      subgroupDropdownOpt = {subgroupDropdownOpt}
      setSubgroupDropdownOpt = {setSubgroupDropdownOpt}
      timeperiodDropdownOpt = {timeperiodDropdownOpt}
      setTimeperiodDropdownOpt ={setTimeperiodDropdownOpt}
      unit = {unit}
      selArea= {selArea}
      areaName ={areaName}
      setIsSelected = {setIsSelected} 
      indicatorBar ={indicatorBar}
      setIndicatorBar = {setIndicatorBar}
      indicatorDetail = {indicatorDetail}
      setIndicatorDetail = {setIndicatorDetail}
      indicatorTrend = {indicatorTrend}
      setIndicatorTrend = {setIndicatorTrend}
      selIndiaData = {selIndiaData}
      setSelIndiaData = {setSelIndiaData}
      parentArea={parentArea}
      isLevelThree={isLevelThree}
      setAreaName = {setAreaName}
      level={level}
      setSelArea = {setSelArea}
      setIsLevelThree = {setIsLevelThree}
      searchRef={searchRef}
      filterDropdownValue={filterDropdownValue}
      setFilterDropdownValue={setFilterDropdownValue}
      areaDropdownOpt={areaDropdownOpt}
      setAreaDropdownOpt={setAreaDropdownOpt}
      indicatorSense = {indicatorSense}
      selNutritionData = {selNutritionData}
      setSelNutritionData = {setSelNutritionData}
        />: null}
    </>);
  }

export default App;