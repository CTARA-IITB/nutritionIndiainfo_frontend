import React,{useState,useEffect} from "react";

import {Row, Col } from 'react-bootstrap';
import { TreeSelect,Input } from 'antd';
import { json } from 'd3';

import { fetchAreaCode,createHierarchy } from '../../utils';

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
    setIsLevelThree}) =>{
    

    const [expandedKeys,setExpandedKeys] = useState([]);
    const [searchValue,setSearchValue] = useState("");
    const [autoExpandParent,setAutoExpandParent] = useState(true);
    const [filterDropdownValue,setFilterDropdownValue] = useState([]);
    const [openDropdown,setOpenDropdown] = useState(false);
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
    
    const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
    const [stateID,setStateID] = useState(null);

    // console.log(areaList.filter(d => d.area_level));
    useEffect(() => {
        const url = 'http://localhost:8000/api/area';
        json(url).then( options =>{
        const [country,statesID] = createHierarchy(options);
        setStateID(statesID)
        setAreaDropdownOpt(country);
        setAreaList(options);
        }
        )
      }, [])


    //Indicator
 
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
    const url = `http://localhost:8000/api/timeperiod/${selIndicator}/${selSubgroup}/${selArea}`;
    json(url).then( options =>{
      setTimeperiodDropdownOpt(options);
    }
    )

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
       
        }, [timeperiodDropdownOpt])

  if(!areaDropdownOpt){
    return <pre>Loading</pre>
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
  const { value } = e.target;
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
        <Row className='mb-5 mt-3 '>
    
        <Col>
            <span className="dropdown-title">Select Area</span>
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange}  />

            <TreeSelect
                // showSearch
                // filterTreeNode={filterTree}
                // treeNodeFilterProp ={'value'}
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selArea}
                onFocus={()=>setOpenDropdown(true)}

                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={(filterDropdownValue.length !=0)?filterDropdownValue:areaDropdownOpt}
                treeDefaultExpandAll={false}
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
                    // console.log(stateID.indexOf(parseInt(value)),'test');
                    // setAreaCode(fetchAreaCode(areaList, value));
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



