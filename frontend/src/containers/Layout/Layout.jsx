import React,{useState,useEffect,useRef} from "react";
import {Dropdown} from "../../components/Dropdown/Dropdown";
// import 'react-dropdown/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Container, Row, Col, ToggleButton } from 'react-bootstrap';


// import Form from "../../components/Form/Form";
import { Map } from "../../components/Map/Map";
import { useData , useDataDistrict ,useDataState} from '../../containers/UseData'
import { json } from 'd3';


import "./Layout.css";

const renderedMap = (boundaries) => (boundaries.state);

const Layout = ({tabId}) => {

  const [level,setLevel] = useState(1);
  const searchRef = useRef();
  const [filterDropdownValue,setFilterDropdownValue] = useState([]);
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);


  useEffect(()=>{
    setLevel(1);
  },[tabId])
  const [isLevelThree , setIsLevelThree] = useState(false);


  const iniSelArea = '1';  //india
  const [selArea,setSelArea] = useState(iniSelArea);
  const [areaList,setAreaList] = useState(null);
  const [parentArea,setParentArea] = useState(null);


  const [areaName,setAreaName] = useState('IND');

  const [unit,setUnit] = useState(null);
  const [unitList,setUnitList] = useState(null);

  const iniSelIndicator = '12';  
  const [selIndicator,setSelIndicator] = useState(iniSelIndicator);
  

  const iniSelSubgroup = '6';  //All
  const [selSubgroup,setSelSubgroup] = useState(iniSelSubgroup);

  const iniSelTimeperiod = '21';  //CNNS 2016-2018
  const [selTimeperiod,setSelTimeperiod] = useState(iniSelTimeperiod);
 
    //district data
    const [selDistrictData,setSelDistrictData] = useState(null);
  
    useEffect(() => {
      const url = `http://localhost:8000/api/indiaMap/12/6/19/3`;
      json(url).then( data =>{
        setSelDistrictData(data);
      
      }
      )
    },['3'])


    //india data
    const [selIndiaData,setSelIndiaData] = useState(null);
  
    useEffect(() => {
      const url = `http://localhost:8000/api/indiaMap/${selIndicator}/${selSubgroup}/${selTimeperiod}/2`;
      json(url).then( data =>{
        setSelIndiaData(data);
      }
      )

    }, [selIndicator,selSubgroup,selTimeperiod])


    //state data

    const [selStateData,setSelStateData] = useState(null);
  
    useEffect(() => {
      let url;
      if(level === 1)
        url = `http://localhost:8000/api/indiaMap/${selIndicator}/${selSubgroup}/${selTimeperiod}/3`
      else if(level === 2){
        if(isLevelThree)
           url = `http://localhost:8000/api/areaData/${selIndicator}/${selSubgroup}/${selTimeperiod}/${parentArea}`
        else
          url = `http://localhost:8000/api/areaData/${selIndicator}/${selSubgroup}/${selTimeperiod}/${selArea}`;
      }
      json(url).then( data =>{
        setSelStateData(data);
      }
      )

    }, [selIndicator,selSubgroup,selTimeperiod,selArea,parentArea])




    //set Unit on indicator and subgroup change

    useEffect(()=>{
      const url = `http://localhost:8000/api/getUnit/${selIndicator}/${selSubgroup}`;
      json(url).then(unit =>{
        setUnit(unit[0].unit)
      })
      json()
    },[selIndicator,selSubgroup])


    //get Units Name

    useEffect(()=>{
      const url = "http://localhost:8000/api/getUnitName";
      json(url).then(unitList =>{
        setUnitList(unitList)
      })
    },[])
  const boundaries = useData();
  const Dboundaries= useDataDistrict();
  const stateBoundary=useDataState(areaName,Dboundaries);
const handleClick=()=>{
  setToggleState(!toggleState);
  let text=null;
  if(buttonText==='District')
    text='state';
  else
    text='District';
  changeText(text);
  }
  const [buttonText, setButtonText] = useState("District");
  const changeText = (text) => setButtonText(text);
  const [toggleState,setToggleState] = useState(true)


  //set area name to parent when level is 3
if(level === 3){
  let areaParentId = areaList.filter(f => f.area_name === areaName)[0].area_parent_id; // loop 1
  let parentName = areaList.filter(f=> f.area_id === areaParentId)[0].area_name;  //loop 2  later optimise this 
  setAreaName(parentName);
  setParentArea(areaParentId);
  setIsLevelThree(true);
  setLevel(2);
}
  // if(!boundaries || !areaDropdownOpt || !subgroupDropdownOpt || !indicatorDropdownOpt || !timeperiodDropdownOpt || !stateBoundary  || !areaList || !unitList){
  // 	return <pre>Loading...</pre>
  // }
  if(!boundaries  || !stateBoundary  || !unitList){
  	return <pre>Loading...</pre>
  }
 
  let renderMap=null;
  let nutritionData = null;
  

if(level === 1 || stateBoundary.features === undefined){
  if(toggleState===true){
  renderMap = renderedMap(boundaries);
  nutritionData = selIndiaData;
  }
  else{
    renderMap = renderedMap(Dboundaries);
    nutritionData = selStateData;
    console.log(selStateData,"selstateData")
  }
}else{

  if(selStateData.length > 0)
  {
  renderMap = stateBoundary;
  nutritionData = selStateData;
  }else{
    renderMap = renderedMap(boundaries);
    nutritionData = selIndiaData;
  }
  // console.log(stateBoundary);
}


// let unitName = unitList.filter(unitObj => unitObj.unit_id === unit)

    return (
      <React.Fragment>
        <Container fluid>
            <Dropdown 
              tabId={tabId}
              selArea={selArea}
              selIndicator={selIndicator}
              selSubgroup={selSubgroup}
              selTimeperiod={selTimeperiod}
              setSelArea={setSelArea}
              setAreaName={setAreaName}
              setSelIndicator = {setSelIndicator} 
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
              />
      
          {/* <Row className="d-flex justify-content-right mb-3"> */}
          <Row className="d-flex flex-row-reverse mb-3">
            {/* {level===1 ? <Switch size="large" checkedChildren="District Level" unCheckedChildren="State Level" onClick={handleClick} /> : ''} */}
          </Row>

          <Row>
           
            {
             nutritionData.length > 0?  <Map geometry={renderMap}  data = {nutritionData} onMapClick={setAreaName} setLevel={setLevel} level={level} setSelArea={setSelArea} unit={unit} unitName = {unitList.filter(d => d.unit_id === unit)[0]['unit_name']} selArea={selArea} isLevelThree={isLevelThree} setIsLevelThree={setIsLevelThree} handleClick={handleClick} searchRef={searchRef} setFilterDropdownValue={setFilterDropdownValue} areaDropdownOpt={areaDropdownOpt}/>
            : <Col className="text-center"><h3> No data: please select another survey</h3></Col> }
           
            
          </Row>

        </Container>

      </React.Fragment>
    );
}

export default Layout;