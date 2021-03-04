import React,{useState,useEffect,useRef} from "react";

import {Row, Col } from 'react-bootstrap';
import { TreeSelect,Input } from 'antd';
import { json } from 'd3';
import {SkeletonDropdown} from "../SkeletonCard";
// import { fetchAreaCode,createHierarchy } from '../../utils';
import { createHierarchy } from '../../utils';

const {Search} = Input;
export const Dropdown = ({
    tabId,
    selArea,
    selIndicator,
    selTimeperiod,
    selSubgroup,
    setSelArea,
    setSelIndicator,
    setSelTimeperiod,
    setSelSubgroup,
    setAreaName,
    setLevel,
    setAreaList,
    setIsLevelThree,
    searchRef,
    filterDropdownValue,
    setFilterDropdownValue,
    areaDropdownOpt,
    setAreaDropdownOpt,
    parentArea,
    isLevelThree}) =>{
    

    // const [expandedKeys,setExpandedKeys] = useState([]);
    // const [searchValue,setSearchValue] = useState("");
    // const [autoExpandParent,setAutoExpandParent] = useState(true);
    const [openDropdown,setOpenDropdown] = useState(false);
    const treeRef = useRef();
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
    //Area
    
    const [stateID,setStateID] = useState(null);

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


    //Indicator
 
  const [indicatorDropdownOpt, setIndicatorDropdownOpt] = useState(null);



  useEffect(() => {
    const url = 'http://localhost:8000/api/indicator/'+tab;
    json(url).then( options =>{
      setIndicatorDropdownOpt(options);
    }
    
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId])

   // change selIndicator when indicator updated
   useEffect(() => {
    if(indicatorDropdownOpt){
      setSelIndicator(indicatorDropdownOpt[0].value)
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [indicatorDropdownOpt])



   //subgroup
   
   const [subgroupDropdownOpt, setSubgroupDropdownOpt] = useState(null);


   useEffect(() => {
    const url = `http://localhost:8000/api/subgroup/${selIndicator}`;
    json(url).then( options =>{
      setSubgroupDropdownOpt(options);
    }
    )
  }, [selIndicator])





   //timeperiod
  
   const [timeperiodDropdownOpt, setTimeperiodDropdownOpt] = useState(null);


   useEffect(() => {
    let url;
    // data is getting fetched when subdistrict is selected and timeperiod get changing so added this if logic
    if(isLevelThree)
    url = `http://localhost:8000/api/timeperiod/${selIndicator}/${selSubgroup}/${parentArea}`;
    else
    url = `http://localhost:8000/api/timeperiod/${selIndicator}/${selSubgroup}/${selArea}`;
    json(url).then( options =>{
      setTimeperiodDropdownOpt(options);
    }
    )
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selIndicator,selSubgroup,selArea])


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
       // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [timeperiodDropdownOpt])

  if(!areaDropdownOpt){

    return <SkeletonDropdown />
    
  }


  //AntDsearch expand tree

const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { value , title} = node;
    dataList.push({ value, title});
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(areaDropdownOpt)


const onChange = (e) =>{
  let { value } = e.target;
  value = value.charAt(0).toUpperCase() + value.slice(1);
  if(value === ""){
    setOpenDropdown(false);
    setFilterDropdownValue(areaDropdownOpt)
  }
  else{
    setOpenDropdown(true);
    const expandedKeys = dataList
    .map((item) => {
      if (item.title.indexOf(value) > -1) {
        return item;
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);

    setFilterDropdownValue(expandedKeys)
  }
}

    return (
        <Row className=' mt-3 '>
    
        <Col>
            <span className="dropdown-title">Select Area</span>
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange}  ref={searchRef}/>

            <TreeSelect
                // showSearch
                // filterTreeNode={filterTree}
                // treeNodeFilterProp ={'value'}
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selArea}
                onFocus={()=>setOpenDropdown(true)}
                onBlur={() => setOpenDropdown(false)}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={(filterDropdownValue.length !==0)?filterDropdownValue:areaDropdownOpt}
                treeDefaultExpandAll={false}
                ref = {treeRef}
                open={openDropdown}

                onChange={ (value,title) =>  {
                    if(value === "1"){
                        setLevel(1)
                        setIsLevelThree(false);
                    }
                    else if(stateID.indexOf(parseInt(value)) !== -1){
                        setIsLevelThree(false);
                        setLevel(2)

                    }
                    else setLevel(3);
                        setSelArea(value);
                        setAreaName(title[0]);
                    treeRef.current.blur()
                  } 
                }
              />
            </Col>

            <Col>
            <span className="dropdown-title">Select Indicator</span>

            <TreeSelect
                showSearch
                // onSearch={onSearch}
                optionFilterProp="children"
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selIndicator}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={indicatorDropdownOpt}
                filterTreeNode
                treeNodeFilterProp
                onChange={ value => setSelIndicator(value) }
                />
            </Col>

              
                <Col>
            <span className="dropdown-title">Select subgroup</span>

                <TreeSelect
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selSubgroup}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={subgroupDropdownOpt}
                onChange={ value => setSelSubgroup(value)}
                />
                </Col>
        
              <Col>
            <span className="dropdown-title"> Select timeperiod</span>

                <TreeSelect
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selTimeperiod}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={timeperiodDropdownOpt}
                onChange={value => setSelTimeperiod(value) }
                />
              </Col>
             
    </Row>
    )
}



