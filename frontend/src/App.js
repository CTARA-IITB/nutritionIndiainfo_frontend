import React, { Component } from "react";
import Layout from "./containers/Layout/Layout";
import 'bootstrap/dist/css/bootstrap.min.css';       // added bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';       // added bootstrap
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';   
import { Navbars } from "./components/Navbar/Navbars";

class App extends Component {
  render() {
    return <Navbars />;
  }
}
export default App;
