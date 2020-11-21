import React,{useState,useEffect} from "react";
import Dropdown from "react-dropdown";
// import 'react-dropdown/style.css';
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
    if(tabId === undefined){
      tab =8;
    }else{
      tab=tabId;
    }


  const [level,setLevel] = useState(1);
  //Area
  const iniSelArea = '1';  //india
  const [selArea,setSelArea] = useState(iniSelArea);
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
  const [areaList,setAreaList] = useState(null);
  const [areaParentName,setAreaParentName] = useState('IND');
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

console.log(selStateData);
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

  if(!boundaries || !areaDropdownOpt || !subgroupDropdownOpt || !indicatorDropdownOpt || !timeperiodDropdownOpt || !stateBoundary  || !areaList){
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
  }
}else{
  renderMap = stateBoundary;
  nutritionData = selStateData;
  // console.log(stateBoundary);
}


    return (
      <React.Fragment>
        <Container className='container'>
          <Row className='mx-3'>
            <Col>
            <span>Select Area</span>
            <TreeSelect
                className='dropdown'
                style={{ width: '100%' }}
                value={selArea}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
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
            <span>Select Indicator</span>

            <TreeSelect
                className='dropdown'
                style={{ width: '100%' }}
                value={selIndicator}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={indicatorDropdownOpt}
                onChange={ value => setSelIndicator(value) }
                />
            </Col>

              
                <Col>
            <span>Select subgroup</span>

                <TreeSelect
                className='dropdown'
                style={{ width: '100%' }}
                value={selSubgroup}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={subgroupDropdownOpt}
                onChange={ value => setSelSubgroup(value)}
                />
                </Col>
        
              <Col>
            <span>Select timeperiod</span>

                <TreeSelect
                className='dropdown'
                style={{ width: '100%' }}
                value={selTimeperiod}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={timeperiodDropdownOpt}
                onChange={value => setSelTimeperiod(value) }
                />
              </Col>
             
          </Row>
          <Row className="d-flex justify-content-center">
            {/* <ToggleButton></ToggleButton> */}
            {/* <Switch size="large" checkedChildren="District Level" unCheckedChildren="State Level" onClick={handleClick} /> */}

            {level===1 ? <Switch size="large" checkedChildren="District Level" unCheckedChildren="State Level" onClick={handleClick} /> : ''}
            {/* <Button onClick={handleClick}> {buttonText} </Button> */}
          </Row>

          <Row>
            <Col>
              <Map geometry={renderMap}  data = {nutritionData} onMapClick={setAreaParentName} setLevel={setLevel} level={level} setSelArea={setSelArea} />
            </Col>
          </Row>

        </Container>

      </React.Fragment>
    );
}

export default Layout;