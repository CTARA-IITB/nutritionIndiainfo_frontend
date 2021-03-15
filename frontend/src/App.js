import React, { useState, useEffect, useRef } from "react";

import {Layout} from "./components/Layout/Layout";
import 'bootstrap/dist/css/bootstrap.min.css';       // added bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';       // added bootstrap
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';   
import { Dropdown } from "./components/Dropdown/Dropdown";
import { json } from 'd3';

import { Navbars } from "./components/Navbar/Navbars";
import {BrowserRouter as Router, Switch, Route, NavLink, useParams} from "react-router-dom";
import "./components/Navbar/navbar.css";
import {Navbar, Nav} from 'react-bootstrap';
import { createHierarchy } from './utils';

const App = ()=> {
  const iniSelArea = '1';  //india
  const [selArea, setSelArea] = useState(iniSelArea);
  const iniSelIndicator = '12';
  const [selIndicator, setSelIndicator] = useState(iniSelIndicator);
  const iniSelSubgroup = '6';  //All
  const [selSubgroup, setSelSubgroup] = useState(iniSelSubgroup);

  const iniSelTimeperiod = '22';  //NHHS5
  const [selTimeperiod, setSelTimeperiod] = useState(iniSelTimeperiod);
  const [unit, setUnit] = useState(1);
  const [indicatorDropdownOpt, setIndicatorDropdownOpt] = useState([]);
  const [timeperiodDropdownOpt, setTimeperiodDropdownOpt] = useState([]);
  const [subgroupDropdownOpt, setSubgroupDropdownOpt] = useState([]);
  let id =8;
  useEffect(() => {
    
    const url = 'http://localhost:8000/api/indicator/'+id;
    json(url).then( options =>{
      setIndicatorDropdownOpt(options);
    } )
    const url_1 = `http://localhost:8000/api/subgroup/${selIndicator}`;
    json(url_1).then(options => {
      setSubgroupDropdownOpt(options);
    })
   const  url_2 = `http://localhost:8000/api/timeperiod/${selIndicator}/${selSubgroup}/1`;
    json(url_2).then( options =>{
      setTimeperiodDropdownOpt(options);
    } )
    const url_3 = `http://localhost:8000/api/getUnit/${selIndicator}`;
    json(url_3).then(unit => {
      setUnit(unit[0].unit)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
    return(<> 
  <div>
                <div className="">
                    <div className="">
                    <Router> 
                        <Navbar expand="lg">
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto" >
                        <NavLink exact activeClassName="navbar__link--active"  className="navbar__link" to="/section1" >Manifestation</NavLink>
                            <NavLink activeClassName="navbar__link--active" className="navbar__link" to="/section2" >Immediate Causes</NavLink>
                            <NavLink activeClassName="navbar__link--active" className="navbar__link" to="/section3" >Underlying Causes</NavLink>
                            <NavLink activeClassName="navbar__link--active" className="navbar__link" to="/section4" >Basic Causes</NavLink>
                        </Nav>
                        </Navbar.Collapse>
                        </Navbar>
                            <Switch>
                                <Route exact path="/" component= {Dropdown}/>
                                <Route path="/:id" component= {Dropdown}/>
                            </Switch> 
                        </Router>
                    </div>
                </div>
            </div>
         
    </>);
  }

 
export default App;