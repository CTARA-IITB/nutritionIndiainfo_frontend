import { useState, useEffect } from 'react';
import { json } from 'd3';
import { feature } from 'topojson';

const jsonIndianstate =
    'https://gist.githubusercontent.com/AnimeshN/b705d4f1a910a16013348e6743d597f4/raw/13ff136e1cd3a90b2fcca370158960dddf74fbee/india_state_old.json';;
const jsonIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/9b27088c28f134b51983f1a25012474e/raw/7d551013cc70a2b4f08bc1bebd092f3e53a9ceca/india_district_old_v2.json';

export const useData = (selArea) => {
    let [data, setData] = useState(null);
  	// console.log(selectedArea)
    useEffect(() => {
    // const bundle = {}
    json(jsonIndianstate).then(stateTopology => {
      console.log("JSONINDIASTATE",stateTopology)
      const state = stateTopology.objects.india_state_old;
      json(jsonIndiaDistrict).then(districtTopology =>{
      	const dist = districtTopology.objects.india_district_old_v2;
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
      console.log("OLDDistrict",districtTopology)
      const states = districtTopology.objects.india_district_old_v2;
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
const jsonNewIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/262881c21197aa8da0524550b128d639/raw/ffd5cb39d90469934c1072ab7399c16e823fc82e/india_district_new_v3.json'

export const useNewBoundaries = () => {
    let [data, setData] = useState(null);
    useEffect(() => {
    json(jsonNewIndianstate).then(stateTopology => {
      const state = stateTopology.objects.state
      json(jsonNewIndiaDistrict).then(districtTopology =>{
        const dist = districtTopology.objects.india_district_new_v3;
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
      async function fetchData(){
        const distTopo = await json(jsonNewIndiaDistrict)
        setData({'dist':feature(distTopo,distTopo.objects.india_district_new_v3)})
      }
      fetchData();
  }, []);
  return data;
  }