import React, {useState,useEffect,useCallback} from "react";
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Popup from "../Popup/Popup";
import { saveAs } from 'file-saver'; 
import GetAppIcon from '@material-ui/icons/GetApp';
import TableChartIcon from '@material-ui/icons/TableChart';
import ShareIcon from '@material-ui/icons/Share';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import "./SideNavBar.css";
import Share  from "../../components/Share/Share";
import { CSVLink } from "react-csv";


const SideNavBar = ({chartData,id,screen}) => {

  //table details
  let table=[];
  for(var i=0;i<chartData.labels.length;i++){
    table.push({
       label:chartData.labels[i],
       data:+chartData.datasets[0].data[i],
 
    })
  }
  console.log(table,'table');

  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  const [isOpenShare,setIsOpenShare]=useState(false);
  const toggleShare=()=>{
    setIsOpenShare(!isOpenShare);
  }

  //toggle fullscreen
  const[image,setImage]=useState(<FullscreenIcon/>);
  const[text,setText]=useState("Full View");
  const[flag,setFlag]=useState(true);
  const toggleDropDownItem = ()=>{
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
    const canvasSave = document.getElementById(id);
    canvasSave.toBlob(function (blob) {
          saveAs(blob, "chart.pdf")
    })
  } 

  const [isOpenTable, setIsOpenTable] = useState(false);
  const toggleTablePopup = ()=>{
    setIsOpenTable(!isOpenTable); 
  }
 
    return(
      <div>
        {isOpenTable && <Popup
          content={<>
              <BootstrapTable data={ table } >
                  <TableHeaderColumn dataField='label' isKey dataSort>Time Period</TableHeaderColumn>
                  <TableHeaderColumn dataField='data'>Data</TableHeaderColumn>
              </BootstrapTable> 
          </>}
          handleClose={toggleTablePopup}
        />}

        {isOpen && <Popup
          content={<>
            <CSVLink 
              data={table}
              filename="chart.csv"
              target="_blank"
            ><button>csv</button></CSVLink>
            <button onClick={saveJpeg}>jpeg</button>
            <button onClick={savePng}>png</button>
            <button onClick={saveSvg}>svg</button>
            <button onClick={savePdf}>pdf</button>
          </>}
          handleClose={togglePopup}
        />}

        {isOpenShare && <Popup
          content={<>
            <Share/>
          </>}
          handleClose={toggleShare}
        />}

        <DropdownButton
          style={{float:'right'}}
          key="left"
          size="sm"
          id="dropdown-button-drop-left"
          drop="left"
          variant="light"
          title=""
        >
          <Dropdown.Item onClick={togglePopup} eventKey="1"><GetAppIcon/> Download</Dropdown.Item>
          <Dropdown.Item onClick={()=>{
            if(flag){
              screen.enter();
              toggleDropDownItem();
            }
            else exitFullScreen();
          }} eventKey="2">{image} {text}</Dropdown.Item>
          <Dropdown.Item onClick={toggleTablePopup} eventKey="3"><TableChartIcon/> Table</Dropdown.Item>
          <Dropdown.Item onClick={toggleShare} eventKey="4"><ShareIcon/> Share </Dropdown.Item>
        </DropdownButton>          
      </div>
    )
}
export default SideNavBar;