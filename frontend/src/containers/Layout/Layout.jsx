import React,{useState,useEffect} from "react";
import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';
import Select from 'react-select'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Container, Row, Col, ToggleButton } from 'react-bootstrap';


// import Form from "../../components/Form/Form";
import { Marks } from "../../components/Marks/Marks";
import { Map } from "../../components/Map/Map";
import { useData , useDataDistrict ,useDataState} from '../../containers/UseData'
import { json } from 'd3';
import { TreeSelect, Switch } from 'antd';

import { fetchAreaCode,createHierarchy } from '../../utils';

import "./Layout.css";

const renderedMap = (boundaries) => (boundaries.state);

const Layout = ({tabId}) => {

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


  const [level,setLevel] = useState(1);
  //Area
  const iniSelArea = '1';  //india
  const [selArea,setSelArea] = useState(iniSelArea);
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
  const [areaList,setAreaList] = useState(null);
  const [areaParentName,setAreaParentName] = useState('IND');
  const [unit,setUnit] = useState(null);
  const [unitList,setUnitList] = useState(null);
  useEffect(() => {
    const url = 'http://localhost:8000/api/area';
    json(url).then( options =>{
      setAreaDropdownOpt(createHierarchy(options));
      setAreaList(options);
    }
    )
  }, [])

  //Indicator
  const iniSelIndicator = '12';  
  const [selIndicator,setSelIndicator] = useState(iniSelIndicator);
  const [indicatorDropdownOpt, setIndicatorDropdownOpt] = useState(null);
 

  useEffect(() => {
    const url = 'http://localhost:8000/api/indicator/'+tab;
    json(url).then( options =>{
      setIndicatorDropdownOpt(options);
    }
    )
  }, [tabId])

  console.log("indicatorDropdownOpt", indicatorDropdownOpt);

   // change selIndicator when indicator updated
   useEffect(() => {
    if(indicatorDropdownOpt){
      setSelIndicator(indicatorDropdownOpt[0].value)
    }
   
    }, [indicatorDropdownOpt])

    //subgroup
    const iniSelSubgroup = '6';  //All
    const [selSubgroup,setSelSubgroup] = useState(iniSelSubgroup);
    const [subgroupDropdownOpt, setSubgroupDropdownOpt] = useState(null);
  
  
    useEffect(() => {
      const url = `http://localhost:8000/api/subgroup/${selIndicator}`;
      json(url).then( options =>{
        setSubgroupDropdownOpt(options);
      }
      )
    }, [selIndicator])


    //timeperiod
    const iniSelTimeperiod = '21';  //CNNS 2016-2018
    const [selTimeperiod,setSelTimeperiod] = useState(iniSelTimeperiod);
    const [timeperiodDropdownOpt, setTimeperiodDropdownOpt] = useState(null);
  
  
    useEffect(() => {
      const url = `http://localhost:8000/api/timeperiod/${selIndicator}/${selSubgroup}/${selArea}`;
      json(url).then( options =>{
        setTimeperiodDropdownOpt(options);
      }
      )

    }, [selIndicator,selSubgroup,selArea])
 
 
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
      if(selArea == 1)
        url = `http://localhost:8000/api/indiaMap/${selIndicator}/${selSubgroup}/${selTimeperiod}/3`
      else
        url = `http://localhost:8000/api/areaData/${selIndicator}/${selSubgroup}/${selTimeperiod}/${selArea}`;
      json(url).then( data =>{
        setSelStateData(data);
      }
      )

    }, [selIndicator,selSubgroup,selTimeperiod,selArea])

    // change selTimeperiod when indicator updated
    useEffect(() => {
    let flag = false;
    if(timeperiodDropdownOpt){
      timeperiodDropdownOpt.forEach(timeperiod => {
        if(timeperiod.value === selTimeperiod){
          flag = true;
        }
      });
      if(!flag) setSelTimeperiod(timeperiodDropdownOpt[0].value)
    }
   
    }, [timeperiodDropdownOpt])


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
  const stateBoundary=useDataState(areaParentName,Dboundaries);
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

  if(!boundaries || !areaDropdownOpt || !subgroupDropdownOpt || !indicatorDropdownOpt || !timeperiodDropdownOpt || !stateBoundary  || !areaList || !unitList){
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
    console.log("in else block");
    renderMap = renderedMap(Dboundaries);
    nutritionData = selStateData;
    console.log(selStateData,"selstateData")
  }
}else 
{
  console.log("in else2 block", selStateData.length);
  if(selStateData.length > 0)
  {
  nutritionData = selStateData;
  renderMap = stateBoundary;
  }
  else{
    renderMap = renderedMap(boundaries);
    nutritionData = selIndiaData;
  }
  console.log(selStateData,"selstateData")
  // console.log(stateBoundary);
}

// let unitName = unitList.filter(unitObj => unitObj.unit_id === unit)


    return (
      <React.Fragment>
        <Container fluid>
          <Row className='mb-2 mt-3 '>
            <Col>
            <span className="dropdown-title">Select Area</span>
            <TreeSelect
                className='dropdown'
                style={{ width: '100%' }}
                value={selArea}
                dropdownStyle={{ maxHeight: 400, overflow: 'scroll' }}
                treeData={areaDropdownOpt}
                // treeDefaultExpandAll
                onChange={ (value,title) =>  {
                    setSelArea(value);
                    (value === "1")?setLevel(1):setLevel(2);
                    // setAreaCode(fetchAreaCode(areaList, value));
                    setAreaParentName(title[0]);
                  } 
                }
              />
            </Col>

            <Col>
            <span className="dropdown-title">Select Indicator</span>

            <Select
                className='dropdown'
                style={{ width: '100%' }}
                value={indicatorDropdownOpt.find(x => x.value === selIndicator)}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                options={indicatorDropdownOpt}
                onChange={ value => setSelIndicator(value.value) }
                getOptionLabel={option => option.title}
                />
            </Col>
              
                <Col>
            <span className="dropdown-title">Select subgroup</span>

                <Select
                className='dropdown'
                style={{ width: '100%' }}
                value={subgroupDropdownOpt.find(x => x.value === selSubgroup)}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                options={subgroupDropdownOpt}
                onChange={ value => setSelSubgroup(value.value)}
                getOptionLabel={option => option.title}
                />
                </Col>
        
              <Col>
            <span className="dropdown-title"> Select timeperiod</span>

                <Select
                className='dropdown'
                style={{ width: '100%' }}
                value={timeperiodDropdownOpt.find(x => x.value === selTimeperiod)}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                options={timeperiodDropdownOpt}
                onChange={value => setSelTimeperiod(value.value) }
                getOptionLabel={option => option.title}
                />
              </Col>
             
          </Row>
          {/* <Row className="d-flex justify-content-right mb-3"> */}
          <Row className="d-flex flex-row-reverse mb-3" style={{ marginRight:"500px"}}>
            {level===1 ? <Switch size="large" checkedChildren="District Level" unCheckedChildren="State Level" onClick={handleClick} /> : ''}
          </Row>

          <Row>
              <Map geometry={renderMap}  data = {nutritionData} onMapClick={setAreaParentName} setLevel={setLevel} level={level} setSelArea={setSelArea} unit={unit} unitName = {unitList.filter(d => d.unit_id === unit)[0]['unit_name']}/>
{/*            
            {
             nutritionData.length > 0?  <Map geometry={renderMap}  data = {nutritionData} onMapClick={setAreaParentName} setLevel={setLevel} level={level} setSelArea={setSelArea} unit={unit} unitName = {unitList.filter(d => d.unit_id === unit)[0]['unit_name']} />
            : <Col className="text-center"><span id="noMsg"><h3> No data: please select another survey</h3></span></Col> } */}
           
            
          </Row>

        </Container>

      </React.Fragment>
    );
}

export default Layout;