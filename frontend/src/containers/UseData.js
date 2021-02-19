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
        setData({'dist':feature(districtTopology,states)})
  
    });  
  }, []);
  
  return data;
  }

  export const useDataState =(areaName,indiaDistrictGeojson) =>{
    let [data, setData] = useState(null);
    areaName = (areaName === "Telangana")?"Telengana":areaName; // hack.. will later change areaname in geojson data to Telangana
  
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
const jsonNewIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/9112826520d38c6091733bc8abc1e280/raw/96fa05a0f6874741416e521b4e49c5aed0c5d2da/ind_dist_nfhs5_topo_v2.json'

export const useNewBoundaries = () => {
    let [data, setData] = useState(null);
    useEffect(() => {
    json(jsonNewIndianstate).then(stateTopology => {
      const state = stateTopology.objects.state
      json(jsonNewIndiaDistrict).then(districtTopology =>{
        const dist = districtTopology.objects.ind_dist_nfhs5;
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
      setData({'dist':feature(distTopo,distTopo.objects.ind_dist_nfhs5)})
  }, []);
  return data;
  }