import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';       // added bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';       // added bootstrap
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';   
import { Dropdown } from "./components/Dropdown/Dropdown";
import {BrowserRouter as Router, Route} from "react-router-dom";
import "./components/Navbar/navbar.css";
const App = ()=> {

    return(<> 
    <Router>
        <Route exact path="/">
            <Dropdown/>
        </Route>
        <Route exact path="/:lifecycle">
            <Dropdown/>
        </Route>
        <Route exact path="/:lifecycle/:category">
            <Dropdown/>
        </Route>
        <Route exact path="/:lifecycle/:category/:indicator">
            <Dropdown/>
        </Route>
    </Router>         
    </>);
  }

 
export default App;