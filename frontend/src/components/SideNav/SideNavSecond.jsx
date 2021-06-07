import React, {useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown'
import Popup from "../Popup/Popup";
import { saveAs } from 'file-saver'; 
import GetAppIcon from '@material-ui/icons/GetApp';
import TableChartIcon from '@material-ui/icons/TableChart';
import ShareIcon from '@material-ui/icons/Share';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import "./SideNav.css";
import Share  from "../Share/Share";
import { CSVLink } from "react-csv";
import MenuIcon from '@material-ui/icons/Menu';
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import PrintIcon from '@material-ui/icons/Print';
import { useReactToPrint } from "react-to-print";
import Chart from 'chart.js';


const SideNavSecond = ({table,id,screen,title,timePeriod,componentRef}) => {

  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  const [isOpenShare,setIsOpenShare]=useState(false);
  const toggleShare=()=>{
    setIsOpenShare(!isOpenShare);
  }

  const [isOpenTable, setIsOpenTable] = useState(false);
  const toggleTablePopup = ()=>{
    setIsOpenTable(!isOpenTable); 
  }
  
  //print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  // draw white background 
  var backgroundColor = 'white';
  Chart.plugins.register({
      beforeDraw: function(c) {
          var ctx = c.chart.ctx;
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, c.chart.width, c.chart.height);
      }
  });

  //save to png
  const savePng=()=>{
    const canvasSave = document.getElementById(id);
    canvasSave.toBlob(function (blob) {
          saveAs(blob, "chart.png")
    })     
  } 
  // save to jpeg
  const saveJpeg=()=>{
    const canvasSave = document.getElementById(id);
    canvasSave.toBlob(function (blob) {
          saveAs(blob, "chart.jpeg")
    })
  } 

  // save to svg
  const saveSvg=()=>{
    const canvasSave = document.getElementById(id);
    canvasSave.toBlob(function (blob) {
          saveAs(blob, "chart.svg")
    })
  } 
  // save to pdf
  const savePdf=()=>{
    let input = document.getElementById(id);
    html2canvas(input).then(canvas => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "pt", [700, 700]);
      pdf.addImage(img,"jpeg",0,0);
      pdf.save("chart.pdf");
    });
  } 

    return(
      <div>
        {isOpenTable && <Popup
          content={<>
              <div id="title">{title}</div>
              <BootstrapTable data={ table } 
                hover 
                search
                headerStyle={ { background:'#ECECEC' } }
              >
                <TableHeaderColumn dataField='area' isKey dataSort >Time Period</TableHeaderColumn>
                <TableHeaderColumn dataField='data' >Data</TableHeaderColumn>
              </BootstrapTable> 
          </>}
          handleClose={toggleTablePopup}
        />}

        {isOpen && <Popup
          content={<div className="container">
            <CSVLink 
              data={table}
              filename="chart.csv"
              target="_blank"
            ><button id="btn">csv</button></CSVLink>
            <button onClick={saveJpeg} id="btn">jpeg</button>
            <button onClick={savePng} id="btn">png</button>
            <button onClick={saveSvg} id="btn">svg</button>
            <button onClick={savePdf} id="btn">pdf</button>
          </div>}
          handleClose={togglePopup}
        />}

        {isOpenShare && <Popup
          content={<>
            <Share id={id}/>
          </>}
          handleClose={toggleShare}
        />}

        <Dropdown  style={{float:'right'}}>
          <Dropdown.Toggle variant="link" bsPrefix="p-0">
            <MenuIcon id="icon"/>
          </Dropdown.Toggle>
          <Dropdown.Menu align="right">
            <Dropdown.Item onClick={togglePopup} eventKey="1"  style={{fontSize:'15px'}}><GetAppIcon/> Download</Dropdown.Item>
            <Dropdown.Item onClick={()=>{screen.enter()}} eventKey="2"  style={{fontSize:'15px'}}><FullscreenIcon/> Full View </Dropdown.Item>
            <Dropdown.Item onClick={toggleTablePopup} eventKey="3"  style={{fontSize:'15px'}}><TableChartIcon  style={{fontSize:'20px'}}/> Table</Dropdown.Item>
            <Dropdown.Item onClick={toggleShare} eventKey="4"  style={{fontSize:'15px'}}><ShareIcon  style={{fontSize:'20px'}}/> Share </Dropdown.Item>
            <Dropdown.Item onClick={handlePrint} eventKey="5"  style={{fontSize:'15px'}}><PrintIcon  style={{fontSize:'20px'}}/> Print</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
}
export default SideNavSecond;