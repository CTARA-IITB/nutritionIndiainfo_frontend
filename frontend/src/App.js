import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';       // added bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';       // added bootstrap
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';   
import { Dropdown } from "./components/Dropdown/Dropdown";
import {BrowserRouter as Router, Route} from "react-router-dom";
import "./components/Navbar/navbar.css";


//header images
import mhf from './image_logos/mhf.png'
import nil from './image_logos/nutrition-logo.svg'
import pa from './image_logos/pa.png'


// footer images
import nilf from "./image_logos/nutrition-logo-footer.svg";
import clf from "./image_logos/ctara-logo.png";
import unil from "./image_logos/unicefLogo.png";


const App = ()=> {
return(<> 
			
<main id='main_app_container' className='flex flex-col max-h-screen'>

	<div  id="brand_container" className="grid grid-cols-3 p-4 m-2">
		{/* <div className="d-flex col-12 align-items-center p-4 main-head"> */}
			<div ><a href="https://www.mohfw.gov.in/" target="_blank"><img src={mhf} className="health-ministry"/></a></div>
		<div className=" mt-4 mx-auto">	<a href="/" target=""><img src={nil} className="nutrition-india"/></a></div>
		<div>	<a href="http://poshanabhiyaan.gov.in/#/" target="_blank"> <img src={pa} className="poshan-abhiyan"/></a></div> 
		{/* </div> */}
	</div>
	<Router  basename={'/dashboard'}>
		<Route exact path="/">
			<Dropdown/>
		</Route>
		<Route exact path="/:queryLifecycle">
			<Dropdown/>
		</Route>
		<Route exact path="/:queryLifecycle/:queryCategory">
			<Dropdown/>
		</Route>
		<Route exact path="/:queryLifecycle/:queryCategory/:queryIndicator">
			<Dropdown/>
		</Route>
	</Router>   


	<footer className="footer p-0 mt-4">
			<div className="row  p-0 m-0 align-items-center">
				<div className="col-4">
					<a href="https://nutritionindia.info/" target="_blank"><img src={nilf} className="nutrition-image"/></a>
				</div>
				<div className="col-4">
					<a href="https://www.ctara.iitb.ac.in/" target="_blank"><img src={clf} title="CTARA" className="iitb-image"/></a>
				</div>
			
				<div className="col-4">
					<a href="http://unicef.in/" target="_blank"><img src={unil}  className="unichef-image"/></a>
				</div>
			</div> 
		</footer>

</main>      
</>);
  }

 
export default App;