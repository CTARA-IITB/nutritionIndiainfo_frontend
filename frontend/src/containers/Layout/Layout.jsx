
import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from "../../components/Dropdown/Dropdown";
// import 'react-dropdown/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Table } from 'react-bootstrap';
// import ClipLoader from "react-spinners/ClipLoader";
import { SkeletonCard, SkeletonDropdown, SkeletonMapCard } from "../../containers/SkeletonCard";


// import Form from "../../components/Form/Form";
import { Map } from "../../components/Map/Map";
import { useData, useDataDistrict, useDataState, useNewBoundaries ,useNewDistrictBoundaries} from '../../containers/UseData'
import { json } from 'd3';

import Cards from '../../components/Cards/Cards.jsx';
import SplitPane, { Pane } from 'react-split-pane';
import "./Layout.css";

// const renderedMap = (boundaries) => (boundaries.state);

const Layout = ({ tabId }) => {

  const [level, setLevel] = useState(1);
  const searchRef = useRef();
  const [filterDropdownValue, setFilterDropdownValue] = useState([]);
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
  const [switchDisplay,setSwitchDisplay] = useState(true);


  useEffect(() => {
    setLevel(1);
  }, [tabId])
  const [isLevelThree, setIsLevelThree] = useState(false);


  const iniSelArea = '1';  //india
  const [selArea, setSelArea] = useState(iniSelArea);
  const [areaList, setAreaList] = useState(null);
  const [parentArea, setParentArea] = useState(null);


  const [areaName, setAreaName] = useState('IND');

  const [indicatorDetail, setIndicatorDetail] = useState(null);
  const [unit, setUnit] = useState(null);
  const [unitList, setUnitList] = useState(null);
  const [indicatorSense, setIndicatorSense] = useState(null);

  const iniSelIndicator = '12';
  const [selIndicator, setSelIndicator] = useState(iniSelIndicator);


  const iniSelSubgroup = '6';  //All
  const [selSubgroup, setSelSubgroup] = useState(iniSelSubgroup);

  const iniSelTimeperiod = '22';  //NHHS5
  const [selTimeperiod, setSelTimeperiod] = useState(iniSelTimeperiod);

  //district data
  // const [selDistrictData,setSelDistrictData] = useState(null);

  // useEffect(() => {
  //   const url = `http://localhost:8000/api/indiaMap/12/6/19/3`;
  //   json(url).then( data =>{
  //     setSelDistrictData(data);

  //   }
  //   )
  // },[])

   //get Units Name

   useEffect(() => {
    json(`http://localhost:8000/api/getUnitName`)
    .then(units => {setUnitList(units)})
  },[])





  //india data
  const [selIndiaData, setSelIndiaData] = useState(null);

  useEffect(() => {
    const url = `http://localhost:8000/api/indiaMap/${selIndicator}/${selSubgroup}/${selTimeperiod}/2`;
    json(url).then(data => {
      setSelIndiaData(data);
    }
    )

    //switch Display
    const switchurl=`http://localhost:8000/api/getDistrictDetails/${selIndicator}/${selSubgroup}/${selTimeperiod}`;
    json(switchurl).then(data =>{
      if(data.length)
        setSwitchDisplay(true);
      else
        setSwitchDisplay(false);
    })

  }, [selIndicator, selSubgroup, selTimeperiod])


  //state data

  const [selStateData, setSelStateData] = useState(null);

  useEffect(() => {
    let url;
    if (level === 1)
      url = `http://localhost:8000/api/indiaMap/${selIndicator}/${selSubgroup}/${selTimeperiod}/3`
    else if (level === 2) {
      if (isLevelThree)
        url = `http://localhost:8000/api/areaData/${selIndicator}/${selSubgroup}/${selTimeperiod}/${parentArea}`
      else
        url = `http://localhost:8000/api/areaData/${selIndicator}/${selSubgroup}/${selTimeperiod}/${selArea}`;
    }
    json(url).then(data => {
      setSelStateData(data);
    }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selIndicator, selSubgroup, selTimeperiod, selArea, parentArea])




  //set Unit on indicator and subgroup change

  useEffect(() => {
    const url = `http://localhost:8000/api/getUnit/${selIndicator}/${selSubgroup}`;
    json(url).then(unit => {
      setUnit(unit[0].unit)
    })
    json()
  }, [selIndicator, selSubgroup])
  let tab;
  if (tabId === undefined || tabId === 'section1') {
    tab = 8;
  }
  else if (tabId === 'section2') {
    tab = 1;
  }
  else if (tabId === 'section3') {
    tab = 3;
  }
  else if (tabId === 'section4') {
    tab = 6;
  }
  // get indicatorDetails-1-immediate cause,3-underlying cause,6-basic cause,8-manifest-tab
  useEffect(() => {
    const url = `http://127.0.0.1:8000/api/getIndicatorDetails/${tab}`;
    json(url).then(indicatorDetail => {
      setIndicatorDetail(indicatorDetail)

    })
  }, [tab])
 


  //getting indicator sense
  useEffect(() => {
    const url = `http://localhost:8000/api/getIndicatorType/${selIndicator}`;
    json(url).then(indicatorSense => {
      setIndicatorSense(indicatorSense)
    })
  }, [selIndicator])


  const boundaries = useData();
  const newBoundaries = useNewBoundaries();
  const Dboundaries = useDataDistrict();
  const NewDboundaries = useNewDistrictBoundaries();
  // console.log("NEWDBOUND",NewDboundaries)
  const stateBoundary = useDataState(areaName, Dboundaries);
  const newDistrictBoundaries = useDataState(areaName,NewDboundaries)
  console.log("NEWDISTBOUND",newDistrictBoundaries)
  const handleClick = () => {
    setToggleState(!toggleState);
    let text = null;
    if (buttonText === 'District')
      text = 'state';
    else
      text = 'District';
    changeText(text);
  }


  const chevronWidth = 40;

  const [buttonText, setButtonText] = useState("District");
  const changeText = (text) => setButtonText(text);
  const [toggleState, setToggleState] = useState(true)
  // const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   setLoading(true);
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 5000);
  //   // Cancel the timer while unmounting
  //   return () => clearTimeout(timer);
  // }, []);

  //set area name to parent when level is 3
  if (level === 3) {

    let areaParentId = areaList.filter(f => f.area_id === parseInt(selArea))[0].area_parent_id; // loop 1
    let parentName = areaList.filter(f => f.area_id === areaParentId)[0].area_name;  //loop 2  later optimise this

    setAreaName(parentName);
    setParentArea(areaParentId);
    setIsLevelThree(true);
    setLevel(2);
  }
  // if(!boundaries || !areaDropdownOpt || !subgroupDropdownOpt || !indicatorDropdownOpt || !timeperiodDropdownOpt || !stateBoundary  || !areaList || !unitList){
  // 	return <pre>Loading...</pre>
  // }
  if (!boundaries || !stateBoundary || !unitList || !newBoundaries) {
    return <div><SkeletonDropdown /><Row><SkeletonCard /><SkeletonMapCard /> </Row> </div>
  }

  let renderMap = null;
  let nutritionData = null;
  console.log(newBoundaries, selTimeperiod)

  if (level === 1 || stateBoundary.features === undefined) {
    if (toggleState === true) {
      if (selTimeperiod === '22')    // change state boundaries when timeperiod is NFHS5
        renderMap = newBoundaries.new_state;
      else
        renderMap = boundaries.state;
      nutritionData = selIndiaData;
    }
    else {
      if(selTimeperiod === '22')
      renderMap = newBoundaries.new_dist;
      else
      renderMap = Dboundaries.dist;

      console.table(newBoundaries.new_dist.features[0].properties, 'newBoundaries')
      console.table(Dboundaries.dist.features[0].properties, 'oldBoundaries')
      nutritionData = selStateData;

    }
  } else {

    if (selStateData.length > 0) {
      if(selTimeperiod === '22')
      renderMap = newDistrictBoundaries;
      else
      renderMap = stateBoundary;
      nutritionData = selStateData;
      // console.log("stateboundaries",renderMap)

    } else {
      renderMap = boundaries.state;

      nutritionData = selIndiaData;
    }
    // console.log(stateBoundary);
  }


  if (!nutritionData) {
    return
  }
  return (
    <React.Fragment>

      <div className="layout">
        <div className="layout__header">
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
        </div>
        <div className="layout__body">
          <div className="layout__body__left">
            <Cards indicatorDetail={indicatorDetail} />
          </div>
          <div className="layout__body__right">

            {nutritionData.length > 0 ? <Map geometry={renderMap} data={nutritionData} onMapClick={setAreaName} setLevel={setLevel} level={level} setSelArea={setSelArea} unit={unit} unitName={unitList.filter(d => d.unit_id === unit)[0]['unit_name']} selArea={selArea} isLevelThree={isLevelThree} setIsLevelThree={setIsLevelThree} handleClick={handleClick} searchRef={searchRef} setFilterDropdownValue={setFilterDropdownValue} areaDropdownOpt={areaDropdownOpt} selIndicator={selIndicator} indicatorSense={indicatorSense} switchDisplay={switchDisplay}/>
              : <div className="text-center"></div>
            }
          </div>
        </div>

      </div>
    </React.Fragment>
  );
}

export default Layout;