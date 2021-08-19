import React, {useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown'
import Popup from "../Popup/Popup";
import GetAppIcon from '@material-ui/icons/GetApp';
import TableChartIcon from '@material-ui/icons/TableChart';
import ShareIcon from '@material-ui/icons/Share';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import CloseIcon from '@material-ui/icons/Close';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import ShareImage from "../Share/ShareImage";
import jsPDF from 'jspdf';
import { CSVLink } from "react-csv";
import MenuIcon from '@material-ui/icons/Menu';
import PrintIcon from '@material-ui/icons/Print';
import { useReactToPrint } from "react-to-print";
import "./SideNav.css";
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

const SideNavFirst = ({table,id,dataField,columnName,screen,title,componentRef,selLifecycle,selCategory,selIndicator})=>{

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
    else if(id==="svgBarArea"){
        imageNameJpeg = 'barArea.jpeg';
        imageNamePng = 'barArea.png';
        imageNameSvg = 'barArea.svg';
        imageNamePdf = 'barArea.pdf'
        imageNameCsv = 'barArea.csv'
    }
    else if(id==="svgBar"){
        imageNameJpeg = 'bar.jpeg';
        imageNamePng = 'bar.png';
        imageNameSvg = 'bar.svg';
        imageNamePdf = 'bar.pdf'
        imageNameCsv = 'bar.csv'
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
        setIcon(<CloseIcon/>);
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
    
    const saveJpeg=()=>{
        htmlToImage.toJpeg(document.getElementById(id),{backgroundColor:'white'})
        .then(function (dataUrl) {
          download(dataUrl, imageNameJpeg);
        });
    } 
    
    const savePng = ()=>{
        htmlToImage.toPng(document.getElementById(id),{backgroundColor:'white'})
        .then(function (dataUrl) {
            download(dataUrl, imageNamePng);
        });
    }

    // const saveSvg =()=>{
    //     htmlToImage.toJpeg(document.getElementById(id),{backgroundColor:'white'})
    //     .then(function (dataUrl) {
    //         var link = document.createElement('a');
    //         link.download = imageNameSvg;
    //         link.href = dataUrl;
    //         link.click();
    //     });
    // }

    const savePdf = () => {
        htmlToImage
          .toPng(document.getElementById(id), { quality: 1 })
          .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = imageNameJpeg;
            const pdf = new jsPDF();
    
            let img = new Image();
            img.src = dataUrl;
            img.onload = function () {
              var imgHeight = img.height;
              var imgWidth = img.width;
    
              let width = pdf.internal.pageSize.getWidth();
              let height = pdf.internal.pageSize.getHeight();
              let hratio = imgHeight / imgWidth;
              let imgPDFHeight = width * hratio;
    
              pdf.addImage(dataUrl, 'PNG', 0, 0, width, imgPDFHeight);
              pdf.save(imageNamePdf);
            };
          })
          .catch((error) => console.error('oops, something went wrong!', error));
      };

    return(
        <>
            {isOpenTable && <Popup 
            content={<>
                <div id="title" className="table">{title}</div>
                <BootstrapTable data={ table }
                    hover 
                    search
                    headerStyle={ { background:'#ECECEC', zIndex:'99' } }
                    className="table"
                    // style={{ backgroundColor:"red"}}
                >
                    <TableHeaderColumn dataField={dataField}  headerAlign="center" dataAlign="center"  width="500" isKey dataSort>{columnName}</TableHeaderColumn>
                    <TableHeaderColumn dataField='data' headerAlign="center" dataAlign="center" >Data</TableHeaderColumn>
                </BootstrapTable> 
            </>}
                handleClose={toggleTablePopup}
            />}

            {isOpenShare && <Popup
            content={<>
                <ShareImage title={title} id={id} selLifecycle={selLifecycle} selCategory ={selCategory} selIndicator={selIndicator}/>
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
                {/* <button onClick={saveSvg} id="btn">svg</button> */}
                <button onClick={savePdf} id="btn">pdf</button>
            </div>}
                handleClose={togglePopup}
            />}
            <Dropdown style={{float:'right'}} className="">
                <Dropdown.Toggle variant="link" bsPrefix="p-0">
                    <MenuIcon id="icon" className=""/>
                </Dropdown.Toggle>
                <Dropdown.Menu align="right" className="">
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
