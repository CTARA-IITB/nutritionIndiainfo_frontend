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
    // const bundle = {}
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
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[areaName])
    return data;

  }
  
const jsonNewIndianstate = 'https://gist.githubusercontent.com/AnimeshN/8ee87a2d19b3683253faaa27b168250b/raw/8c978e5914365982438314ded456db27e2008736/india_state_updated_topojsonv1.json';
const jsonNewIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/e2329a92b954edc40557a1f9cbe8e20e/raw/b733dab71d3321225da54a824deb147b7e6cbe46/india_district_topojson_updated.json';

export const useNewBoundaries = () => {
    let [data, setData] = useState(null);
    useEffect(() => {
    json(jsonNewIndianstate).then(stateTopology => {
      const state = stateTopology.objects.state
      json(jsonNewIndiaDistrict).then(districtTopology =>{
        const dist = districtTopology.objects.india_district_geojson;
      	setData({'new_state':feature(stateTopology,state),'new_dist':feature(districtTopology,dist)})
      })
    });  
  }, []);

  return data;
  } 