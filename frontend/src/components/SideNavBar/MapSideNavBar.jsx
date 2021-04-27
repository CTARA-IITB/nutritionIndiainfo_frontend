import React, {useState} from "react";
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Popup from "../Popup/Popup";
import GetAppIcon from '@material-ui/icons/GetApp';
import TableChartIcon from '@material-ui/icons/TableChart';
import ShareIcon from '@material-ui/icons/Share';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Share  from "../../components/Share/Share";

const MapSideNavBar = ({mapData,screen})=>{

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
        label:mapData[i].area_name,
        data:+mapData[i].data_value,
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

    return(
        <>
            {isOpenTable && <Popup
            content={<>
                <BootstrapTable data={ table } >
                    <TableHeaderColumn dataField='label' isKey dataSort>Area Name</TableHeaderColumn>
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

            <DropdownButton
                style={{float:'right'}}
                key="left"
                size="sm"
                id="dropdown-button-drop-left"
                drop="left"
                variant="light"
                title=""
                >
                <Dropdown.Item  id="saveMap" eventKey="1"><GetAppIcon/> Download</Dropdown.Item>
                <Dropdown.Item onClick={()=>{
                    if(flag){
                        screen.enter();
                        toggleFullScreen();
                    }
                    else exitFullScreen();
                }} eventKey="2">{image} {text}</Dropdown.Item>
                <Dropdown.Item onClick={toggleTablePopup} eventKey="3"><TableChartIcon/> Table</Dropdown.Item>
                <Dropdown.Item onClick={toggleShare} eventKey="4"><ShareIcon/> Share </Dropdown.Item>
            </DropdownButton>    

        </>    
    )    
}
export default MapSideNavBar;