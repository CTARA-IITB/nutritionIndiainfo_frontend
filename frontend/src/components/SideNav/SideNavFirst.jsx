import React, {useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown'
import Popup from "../Popup/Popup";
import GetAppIcon from '@material-ui/icons/GetApp';
import TableChartIcon from '@material-ui/icons/TableChart';
import ShareIcon from '@material-ui/icons/Share';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
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

    //print
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });

    // map download details
    const options = {
        scale: 10,
        encoderOptions: 1,
        backgroundColor: 'white',
    }
    
    const saveJpeg = () => {
        saveSvgAsPng(document.getElementById(id), 'image.jpeg', options);
    };

    const savePng = () => {
       saveSvgAsPng(document.getElementById(id), 'image.png', options);
    };

    const saveSvg = () => {
        saveSvgAsPng(document.getElementById(id), 'image.svg', options);
     };

    async function savePdf() {
        const graph = document.getElementById(id);
        const pdf = new jsPDF("l", "pt", [500, 300]);
        const pdfCanvas = document.createElement("canvas");
        pdfCanvas.setAttribute("width", 900);
        pdfCanvas.setAttribute("height", 600);
    
        const dataURI = await svgAsPngUri(graph);
    
        pdf.addImage(dataURI, "PNG", 0, 0);
        pdf.save("image.pdf");
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
                <Share/>
            </>}
                handleClose={toggleShare}
            />}

            {isOpen && <Popup
            content={<div className="container">
                <CSVLink 
                    data={table}
                    filename="image.csv"
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
                    <Dropdown.Item onClick={()=>{screen.enter()}} eventKey="2" style={{fontSize:'15px'}}><FullscreenIcon/> Full View</Dropdown.Item>
                    <Dropdown.Item onClick={toggleTablePopup} eventKey="3" style={{fontSize:'15px'}}><TableChartIcon  style={{fontSize:'20px'}}/> Table</Dropdown.Item>
                    <Dropdown.Item onClick={toggleShare} eventKey="4"  style={{fontSize:'15px'}}><ShareIcon  style={{fontSize:'20px'}}/> Share </Dropdown.Item>
                    <Dropdown.Item onClick={handlePrint} eventKey="5"  style={{fontSize:'15px'}}><PrintIcon  style={{fontSize:'20px'}}/> Print</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>    
    )    
}
export default SideNavFirst;