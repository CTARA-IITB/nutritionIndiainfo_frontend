import React, {useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown'
import Popup from "../Popup/Popup";
import GetAppIcon from '@material-ui/icons/GetApp';
import TableChartIcon from '@material-ui/icons/TableChart';
import ShareIcon from '@material-ui/icons/Share';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Share  from "../Share/Share";
import {saveSvgAsPng,svgAsPngUri}  from 'save-svg-as-png';
import jsPDF from 'jspdf';
import { CSVLink } from "react-csv";
import MenuIcon from '@material-ui/icons/Menu';
import PrintIcon from '@material-ui/icons/Print';
import { useReactToPrint } from "react-to-print";

const SideNavFirst = ({table,id,dataField,columnName,screen,title,componentRef})=>{

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenTable, setIsOpenTable] = useState(false);
    const [isOpenShare,setIsOpenShare]=useState(false);
    const [isFullscreen,setIsFullscreen]=useState(true);
    const [icon,setIcon] = useState(<FullscreenIcon/>)
    const [text,setText]=useState('Full View')

    let imageNameJpeg;
    let imageNamePng;
    let imageNameSvg;
    let imageNamePdf;
    let imageNameCsv;

    // downloaded image name 
    if(id==="svgMap"){
        imageNameJpeg = 'map.jpeg';
        imageNamePng = 'map.png';
        imageNameSvg = 'map.svg';
        imageNamePdf = 'map.pdf'
        imageNameCsv = 'map.csv'
    }
    else{
        imageNameJpeg = 'trend.jpeg';
        imageNamePng = 'trend.png';
        imageNameSvg = 'trend.svg';
        imageNamePdf = 'trend.pdf'
        imageNameCsv = 'trend.csv'
    }
    
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }
    const toggleTablePopup = ()=>{
        setIsOpenTable(!isOpenTable); 
    }
    const toggleShare=()=>{
        setIsOpenShare(!isOpenShare);
    }

    //toggle fullscreen
    const OpenFullscreen = () =>{
        setIcon(<FullscreenExitIcon/>);
        setText("Exit");
        setIsFullscreen(false);
    }

    const closeFullscreen = ()=>{
        setIcon(<FullscreenIcon/>);
        setText("Full View");
        setIsFullscreen(true);
    }

    //print
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });

    // set white background of downloaded image
    const options = {
        scale: 10,
        encoderOptions: 1,
        backgroundColor: 'white',
    }
    
    const saveJpeg = () => {
        saveSvgAsPng(document.getElementById(id), imageNameJpeg, options);
    };

    const savePng = () => {
       saveSvgAsPng(document.getElementById(id), imageNamePng, options);
    };

    const saveSvg = () => {
        saveSvgAsPng(document.getElementById(id), imageNameSvg, options);
    };

    async function savePdf() {
        const graph = document.getElementById(id);
        const pdf = new jsPDF("l", "pt", [900, 800]);
        const pdfCanvas = document.createElement("canvas");
        pdfCanvas.setAttribute("width", 900);
        pdfCanvas.setAttribute("height", 900);
        const dataURI = await svgAsPngUri(graph);
        pdf.addImage(dataURI, "PNG", 0, 0);
        pdf.save(imageNamePdf);
    }

    return(
        <>
            {isOpenTable && <Popup
            content={<>
                <div id="title">{title}</div>
                <BootstrapTable data={ table } 
                    hover 
                    search
                    headerStyle={ { background:'#ECECEC' } }
                >
                    <TableHeaderColumn dataField={dataField}  isKey dataSort>{columnName}</TableHeaderColumn>
                    <TableHeaderColumn dataField='data'>Data</TableHeaderColumn>
                </BootstrapTable> 
            </>}
                handleClose={toggleTablePopup}
            />}

            {isOpenShare && <Popup
            content={<>
                <Share id={id}/>
            </>}
                handleClose={toggleShare}
            />}

            {isOpen && <Popup
            content={<div className="container">
                <CSVLink 
                    data={table}
                    filename= {imageNameCsv}
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
                    <Dropdown.Item  onClick={togglePopup} eventKey="1" style={{fontSize:'15px'}}><GetAppIcon/> Download</Dropdown.Item>
                    <Dropdown.Item 
                        onClick={(e)=>{
                            if(isFullscreen){
                                screen.enter();
                                OpenFullscreen();
                            }else{
                                screen.exit();
                                closeFullscreen();
                            }
                        }}
                        eventKey="2" style={{fontSize:'15px'}}>{icon} {text}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={toggleTablePopup} eventKey="3" style={{fontSize:'15px'}}><TableChartIcon  style={{fontSize:'20px'}}/> Table</Dropdown.Item>
                    <Dropdown.Item onClick={toggleShare} eventKey="4"  style={{fontSize:'15px'}}><ShareIcon  style={{fontSize:'20px'}}/> Share </Dropdown.Item>
                    <Dropdown.Item onClick={handlePrint} eventKey="5"  style={{fontSize:'15px'}}><PrintIcon  style={{fontSize:'20px'}}/> Print</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>    
    )    
}

export default SideNavFirst;
