import React,{useState,useEffect,useRef} from "react";
import {Dropdown} from "../../components/Dropdown/Dropdown";
// import 'react-dropdown/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {Container, Row, Col, Table } from 'react-bootstrap';
// import ClipLoader from "react-spinners/ClipLoader";
import {SkeletonCard,SkeletonDropdown,SkeletonMapCard} from "../../containers/SkeletonCard";
import { useMediaQuery } from 'react-responsive'


// import Form from "../../components/Form/Form";
import { Map } from "../../components/Map/Map";
import { useData , useDataDistrict ,useDataState} from '../../containers/UseData'
import { color, json } from 'd3';

import Card from '../../components/Cards/Card/Card.js';
import Cards from '../../components/Cards/Cards.jsx';
import SplitPane, { Pane } from 'react-split-pane';
import "./Layout.css";
import ItemsCarousel from 'react-items-carousel';
import {  Tooltip,LineChart, Line, BarChart, CartesianGrid, XAxis, YAxis, Bar} from 'recharts'

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

  const [indicatorDetail,setIndicatorDetail] = useState(null);
  const [unit,setUnit] = useState(null);
  const [unitList,setUnitList] = useState(null);

  const iniSelIndicator = '12';  
  const [selIndicator,setSelIndicator] = useState(iniSelIndicator);
  

  const iniSelSubgroup = '6';  //All
  const [selSubgroup,setSelSubgroup] = useState(iniSelSubgroup);

  const iniSelTimeperiod = '21';  //CNNS 2016-2018
  const [selTimeperiod,setSelTimeperiod] = useState(iniSelTimeperiod);
 
    //district data
    // const [selDistrictData,setSelDistrictData] = useState(null);
  
    // useEffect(() => {
    //   const url = `http://localhost:8000/api/indiaMap/12/6/19/3`;
    //   json(url).then( data =>{
    //     setSelDistrictData(data);
      
    //   }
    //   )
    // },[])


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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selIndicator,selSubgroup,selTimeperiod,selArea,parentArea])




    //set Unit on indicator and subgroup change

    useEffect(()=>{
      const url = `http://localhost:8000/api/getUnit/${selIndicator}/${selSubgroup}`;
      json(url).then(unit =>{
        setUnit(unit[0].unit)
      })
      json()
    },[selIndicator,selSubgroup])
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
    // get indicatorDetails-1-immediate cause,3-underlying cause,6-basic cause,8-manifest-tab
    useEffect(()=>{
      const url = `http://127.0.0.1:8000/api/getIndicatorDetails/${tab}`;
      json(url).then(indicatorDetail =>{
        setIndicatorDetail(indicatorDetail)
           
      })
    },[tab])
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


  const chevronWidth = 40;

  const [buttonText, setButtonText] = useState("District");
  const changeText = (text) => setButtonText(text);
  const [toggleState,setToggleState] = useState(true)
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    // Cancel the timer while unmounting
    return () => clearTimeout(timer);
  }, []);

  //set area name to parent when level is 3
if(level === 3){
  
  let areaParentId = areaList.filter(f => f.area_id === parseInt(selArea))[0].area_parent_id; // loop 1
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
  	return <div><SkeletonDropdown /><Row><SkeletonCard /><SkeletonMapCard /> </Row> </div>
  }
 
  let renderMap=null;
  let nutritionData = null;
  

if(level === 1 || stateBoundary.features === undefined){
  if(toggleState===true){
  renderMap = renderedMap(boundaries);
  nutritionData = selIndiaData;
//  console.log("nutritionData",nutritionData)
  
}
  else{
    renderMap = renderedMap(Dboundaries);
    nutritionData = selStateData;
    // console.log("dboundaries",Dboundaries)
 
  }
}else{

  if(selStateData.length > 0)
  {
  renderMap = stateBoundary;
  nutritionData = selStateData;
  // console.log("stateboundaries",renderMap)
   
}else{
    renderMap = renderedMap(boundaries);
    nutritionData = selIndiaData;
    // console.log("nutritionData",nutritionData)
  }
  // console.log(stateBoundary);
}

const Bdata = [
  { 
    time: selSubgroup,
    users: 1,
  },
  {
    time: "wt",
    users: 3,
  },{
    time: "śr",
    users: 7,
  }
]
const Ldata = [{name: selTimeperiod, uv: 400, pv: 2400, amt: 2400},{name: 'Page B', uv: 600, pv: 200, amt: 2400},{name: 'Page C', uv: 40, pv: 240, amt: 2400}];

if(!nutritionData){
  return 
}
    return (
      <React.Fragment>

        <Container fluid >

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
              parentArea={parentArea}
              isLevelThree={isLevelThree}
              
              />

           {/* <Row className="d-flex justify-content-right mb-3"> */}
          <Row className="d-flex flex-row-reverse mb-3">
            {/* {level===1 ? <Switch size="large" checkedChildren="District Level" unCheckedChildren="State Level" onClick={handleClick} /> : ''} */}
          </Row>          
          <SplitPane split="vertical" defaultSize={610}>
          <Pane>

                    <div style={{ padding: `0 ${chevronWidth}px` }}>
                     <Cards
                     indicatorDetail={indicatorDetail}
                     chevronWidth={chevronWidth}
                     />
                     </div>
              </Pane> 
              <Pane>
                  <Row >       
                    {/* <ClipLoader size={150} /> */}
                    { nutritionData.length > 0?  <Map geometry={renderMap}  data = {nutritionData} onMapClick={setAreaName} setLevel={setLevel} level={level} setSelArea={setSelArea} unit={unit} unitName = {unitList.filter(d => d.unit_id === unit)[0]['unit_name']} selArea={selArea} isLevelThree={isLevelThree} setIsLevelThree={setIsLevelThree} handleClick={handleClick} searchRef={searchRef} setFilterDropdownValue={setFilterDropdownValue} areaDropdownOpt={areaDropdownOpt}/>
                    : <Col className="text-center"></Col> }
                  </Row> 
       
              </Pane>

          </SplitPane>

        </Container>
        <Container fluid> 
        {/* <BarChart width={300} height={140} data={data}>
                      <Bar dataKey="uv" fill="#8884d8" />
                    </BarChart>
             */}

          <div style={{height: '100vh'}}>     </div>      
          <div>        
          <LineChart width={600} height={300} data={Ldata} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
          <BarChart width={730} height={250} data={Bdata}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              {/* <YAxis type="number" domain={[0, 'dataMax + 10']} /> */}

              <YAxis type="number" domain={[0, 60]}/>
              {/* <YAxis/> */}
              {/* interval={2} dataMin={0} dataMax={60} */}
              <Bar label={true} dataKey="users" fill="#8884d8" />
            </BarChart>
        
          </div>
        </Container>
         </React.Fragment>
    );
}

export default Layout;