import React, {useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown'
import Popup from "../Popup/Popup";
import GetAppIcon from '@material-ui/icons/GetApp';
import TableChartIcon from '@material-ui/icons/TableChart';
import ShareIcon from '@material-ui/icons/Share';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Share  from "../../components/Share/Share";
import {saveSvgAsPng,svgAsPngUri}  from 'save-svg-as-png';
import jsPDF from 'jspdf';
import { CSVLink } from "react-csv";
import MenuIcon from '@material-ui/icons/Menu';

const MapSideNavBar = ({mapData,screen,mapTitle,timePeriod})=>{

    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const [isOpenTable, setIsOpenTable] = useState(false);
    const toggleTablePopup = ()=>{
        setIsOpenTable(!isOpenTable); 
    }

    const [isOpenShare,setIsOpenShare]=useState(false);
    const toggleShare=()=>{
        setIsOpenShare(!isOpenShare);
    }

    //table details
    let table=[];
    for(var i=0;i<mapData.length;i++){
        table.push({
        area:mapData[i].area_name,
        data:+mapData[i].data_value+" ("+timePeriod + ")",
        })
    }
    console.log(mapData,'map')
    
     //toggle fullscreen
    const[image,setImage]=useState(<FullscreenIcon/>);
    const[text,setText]=useState("Full View");
    const[flag,setFlag]=useState(true);
    const toggleFullScreen = ()=>{
        setFlag(!flag);
        setImage(<FullscreenExitIcon/>);
        setText("Exit");
    }
    const exitFullScreen = ()=>{
        if( (window.innerHeight === window.screen.height)) {
            setFlag(!flag);
            setImage(<FullscreenIcon/>);
            setText("Full View");
            screen.exit();
        }
    }

    // var svgNS = "http://www.w3.org/2000/svg";  
    // var outer = document.getElementById('map');

    // // get map content
    // var map = document.getElementById('map-div');
    // if(map.getElementsByTagName('svg')[0])
    //     var mapSvg = map.getElementsByTagName('svg')[0];
    // var mapContent = Array.from(mapSvg.childNodes);

    // // get legend content
    // var legend = document.getElementById('legend-div');
    // var legendSvg = legend.getElementsByTagName('svg')[0];
    // var legendContent = Array.from(legendSvg.childNodes);

    // // create a merged-div where we are going to merge the svgs
    // var merged = document.createElement('div');
    // merged.setAttribute('id', 'merged-div');
    // outer.appendChild(merged);

    // // createElementNS for svg
    // var mergedSvg = document.createElementNS(svgNS, 'svg');
    // mergedSvg.setAttribute('id', 'merged');
    // // keep the viewBox of the chart
    // mergedSvg.setAttribute('viewBox', mapSvg.getAttribute('viewBox'));
    // merged.appendChild(mergedSvg);

    // // adding the content of both svgs
    // for (let i = 0; i < mapContent.length; i++) {
    //     mergedSvg.appendChild(mapContent[i]);
    // }
    // for (let i = 0; i < legendContent.length; i++) {
    //     mergedSvg.appendChild(legendContent[i]);
    // }
      
    // // the unmerged svgs can be removed
    // map.remove();
    // legend.remove();

    // map download details
    const mapOptions = {
        scale: 10,
        encoderOptions: 1,
        backgroundColor: 'white',
    }
   
    const saveJpeg = () => {
        saveSvgAsPng(document.getElementById('svgMap'), 'map.jpeg', mapOptions);
    };

    const savePng = () => {
       saveSvgAsPng(document.getElementById('svgMap'), 'map.png', mapOptions);
    };

    const saveSvg = () => {
        saveSvgAsPng(document.getElementById('svgMap'), 'map.svg', mapOptions);
     };

    async function savePdf() {
        const graph = document.getElementById('svg-chart');
        const pdf = new jsPDF("l", "pt", [500, 300]);
        const pdfCanvas = document.createElement("canvas");
        pdfCanvas.setAttribute("width", 900);
        pdfCanvas.setAttribute("height", 600);
    
        const dataURI = await svgAsPngUri(graph);
    
        pdf.addImage(dataURI, "PNG", 0, 0);
        pdf.save("map.pdf");
    }

    return(
        <>
            {isOpenTable && <Popup
            content={<>
                <div id="title">{mapTitle}</div>
                <BootstrapTable data={ table } 
                    hover 
                    search
                    headerStyle={ { background:'#ECECEC' } }
                >
                    <TableHeaderColumn dataField='area' isKey dataSort>Area Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='data'>Data</TableHeaderColumn>
                </BootstrapTable> 
            </>}
                handleClose={toggleTablePopup}
            />}

            {isOpenShare && <Popup
            content={<>
                <Share/>
            </>}
                handleClose={toggleShare}
            />}

            {isOpen && <Popup
            content={<div className="container">
                <CSVLink 
                    data={table}
                    filename="map.csv"
                    target="_blank"
                ><button id="btn">csv</button></CSVLink>
                <button onClick={saveJpeg} id="btn">jpeg</button>
                <button onClick={savePng} id="btn">png</button>
                <button onClick={saveSvg} id="btn">svg</button>
                <button onClick={savePdf} id="btn">pdf</button>
            </div>}
                handleClose={togglePopup}
            />}
            <Dropdown style={{float:'right'}}>
                <Dropdown.Toggle variant="link" bsPrefix="p-0">
                    <MenuIcon id="icon"/>
                </Dropdown.Toggle>
                <Dropdown.Menu align="right" >
                    <Dropdown.Item  onClick={togglePopup} eventKey="1"  style={{fontSize:'15px'}}><GetAppIcon/> Download</Dropdown.Item>
                    <Dropdown.Item onClick={()=>{
                        if(flag){
                            screen.enter();
                            toggleFullScreen();
                        }
                        else exitFullScreen();
                    }} eventKey="2"  style={{fontSize:'15px'}}>{image} {text}</Dropdown.Item>
                    <Dropdown.Item onClick={toggleTablePopup} eventKey="3"  style={{fontSize:'15px'}}><TableChartIcon  style={{fontSize:'20px'}}/> Table</Dropdown.Item>
                    <Dropdown.Item onClick={toggleShare} eventKey="4"  style={{fontSize:'15px'}}><ShareIcon  style={{fontSize:'20px'}}/> Share </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>    
    )    
}
export default MapSideNavBar;