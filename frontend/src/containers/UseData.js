import { useState, useEffect } from 'react';
import { json } from 'd3';
import { feature } from 'topojson';

const jsonIndianstate =
    'https://gist.githubusercontent.com/AnimeshN/b705d4f1a910a16013348e6743d597f4/raw/13ff136e1cd3a90b2fcca370158960dddf74fbee/india_state_old.json';;
const jsonIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/7dd993301b4fb2657a221e3f5e148069/raw/india_district_nfhs4.topojson';

export const useData = (selArea) => {
    let [data, setData] = useState(null);
  	// console.log(selectedArea)
    useEffect(() => {
    // const bundle = {}
    json(jsonIndianstate).then(stateTopology => {
      console.log("JSONINDIASTATE",stateTopology)
      const state = stateTopology.objects.india_state_old;
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
        setData({'dist':feature(districtTopology,states)})
  
    });  
  }, []);
  
  return data;
  }

  export const useDataState =(areaName,indiaDistrictGeojson) =>{
    let [data, setData] = useState(null);
    // areaName = (areaName === "Telangana")?"Telengana":areaName; // hack.. will later change areaname in geojson data to Telangana
  
    useEffect(()=>{
      let features;
      if(indiaDistrictGeojson )
        features = indiaDistrictGeojson.dist.features.filter(feature => feature.properties.NAME2_ === areaName);
      
      const featureCollection = {type: "FeatureCollection",features}
      setData(featureCollection);
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[areaName])
    return data;

  }
  
const jsonNewIndianstate = 'https://gist.githubusercontent.com/AnimeshN/8ee87a2d19b3683253faaa27b168250b/raw/8c978e5914365982438314ded456db27e2008736/india_state_updated_topojsonv1.json';
const jsonNewIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/2ccb4212bc27490b5ef6a06d5d6461d9/raw/e014a11d3f11b51e4842f0105646a6bfb9494b99/india_dist_v2.json'

export const useNewBoundaries = () => {
    let [data, setData] = useState(null);
    useEffect(() => {
    json(jsonNewIndianstate).then(stateTopology => {
      const state = stateTopology.objects.state
      json(jsonNewIndiaDistrict).then(districtTopology =>{
        const dist = districtTopology.objects.india_dist_v2;
        let new_state = feature(stateTopology,state);
        let new_dist = feature(districtTopology,dist);
      	setData({'new_state': new_state,'new_dist': new_dist})
      })
    });  
  }, []);

  return data;
  } 

  export const useNewDistrictBoundaries = () => {
    let [data, setData] = useState(null);
    useEffect( async () => {
    const distTopo = await json(jsonNewIndiaDistrict)
      setData({'dist':feature(distTopo,distTopo.objects.india_dist_v2)})
  }, []);
  return data;
  }