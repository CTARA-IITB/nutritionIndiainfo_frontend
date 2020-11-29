import { useState, useEffect } from 'react';
import { json } from 'd3';
import { feature } from 'topojson';

const jsonIndianstate =
    'https://gist.githubusercontent.com/AnimeshN/da2cb5d197bdc0f811a2cda3eaf2e97d/raw/india_state_nfhs4.topojson';;
const jsonIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/7dd993301b4fb2657a221e3f5e148069/raw/india_district_nfhs4.topojson';

export const useData = (selArea) => {
    let [data, setData] = useState(null);
  	// console.log(selectedArea)
    useEffect(() => {
    const bundle = {}
    json(jsonIndianstate).then(stateTopology => {
      const state = stateTopology.objects.india;
      json(jsonIndiaDistrict).then(districtTopology =>{
      	const dist = districtTopology.objects.india;
      	setData({'state':feature(stateTopology,state),'dist':feature(districtTopology,dist)})
      })
    });  
  }, []);
  return data;
  } 

  export const useDataDistrict = (selArea) => {
    let [data, setData] = useState(null);
    // console.log(selectedArea)
    useEffect(() => {
    const bundle = {}
    json(jsonIndiaDistrict).then(districtTopology => {
      const states = districtTopology.objects.india;
        setData({'state':feature(districtTopology,states)})
  
    });  
  }, []);
  
  return data;
  }

  export const useDataState =(areaName,indiaDistrictGeojson) =>{
    let [data, setData] = useState(null);
    areaName = (areaName === "Telangana")?"Telengana":areaName; // hack.. will later change areaname in geojson data to Telangana
  
    useEffect(()=>{
      let features;
      if(indiaDistrictGeojson)
        features = indiaDistrictGeojson.state.features.filter(feature => feature.properties.NAME2_ === areaName);
      
      const featureCollection = {type: "FeatureCollection",features}
      setData(featureCollection);
      

    },[areaName])
    return data;

  }
  