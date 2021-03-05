import React, { useState, useEffect, useRef } from "react";

import Layout from "./components/Layout/Layout";
import 'bootstrap/dist/css/bootstrap.min.css';       // added bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';       // added bootstrap
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';   
import { Dropdown } from "./components/Dropdown/Dropdown";

import { Navbars } from "./components/Navbar/Navbars";
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
    />
    <Layout 
      tabId={tabId}
      setLevel={setLevel}
      selIndicator={selIndicator}
      selSubgroup={selSubgroup}
      selTimeperiod={selTimeperiod}
      level={level}
      parentArea={parentArea}
      selArea={selArea}
      areaName={areaName}
      areaList={areaList}
      setAreaName={setAreaName}
      setParentArea={setParentArea}
      setSelIndicator={setSelIndicator}
      setSelArea={setSelArea}
      setFilterDropdownValue={setFilterDropdownValue}
      areaDropdownOpt={areaDropdownOpt}
      searchRef={searchRef}
      />
    </>);
  }

export default App;
