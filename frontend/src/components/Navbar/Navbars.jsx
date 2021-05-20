import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    useParams
  } from "react-router-dom";
//   import Layout from "../../containers/Layout/Layout";
import "./navbar.css";
import {Navbar, Nav} from 'react-bootstrap';


export const Navbars = ({setTabId}) => {
        return(
            <div>
                <div className="container">
                    <div className="container-nav">
                        <Router>
                        <Navbar expand="lg">
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto" >
                        <NavLink exact activeClassName="navbar__link--active" className="navbar__link" to="/section1">Manifestation</NavLink>
                            <NavLink activeClassName="navbar__link--active" className="navbar__link" to="/section2">Immediate Causes</NavLink>
                            <NavLink activeClassName="navbar__link--active" className="navbar__link" to="/section3">Underlying Causes</NavLink>
                            <NavLink activeClassName="navbar__link--active" className="navbar__link" to="/section4">Basic Causes</NavLink>
                        </Nav>
                        </Navbar.Collapse>
                        </Navbar>
                            {/* <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                                <ul className="navbar-nav">
                                    <li className="nav-item active">
                                        <Link to="/" className="nav-link">Mainfestation</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/1" className="nav-link">Immediate Causes</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/3" className="nav-link">Underlying Causes</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/6" className="nav-link">Basic Causes</Link>
                                    </li>
                                </ul>
                            </nav> */}
                            <Switch>
                                <Route exact path="/" children={<Child setTabId={setTabId}/>} />
                                <Route path="/:id" children={<Child setTabId={setTabId}/>} />
                            </Switch>
                        </Router>
                    </div>
                </div>
            </div>
        )  
   
}


function Child({setTabId}) {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { id } = useParams();
    setTabId(id)
    return (<></>
        // <Layout tabId={id} />
    );
}