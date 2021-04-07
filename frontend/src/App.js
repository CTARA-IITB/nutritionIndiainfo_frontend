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
import "./App.css";

const App = ()=> {

    return(<> 
    <div className="layout" id="layout_id">
    <Router> 
    <div class="layout_navbar">

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
            </div>

                <Switch>
                    <Route exact path="/" component= {Dropdown}/>
                    <Route path="/:id" component= {Dropdown}/>
                </Switch> 
            </Router>
   
    </div>
       
         
    </>);
  }

 
export default App;