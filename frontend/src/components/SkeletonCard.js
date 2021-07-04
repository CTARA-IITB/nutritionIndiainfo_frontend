import React from "react";
import "./SkeletonCard.css";
import Skeleton from "react-loading-skeleton";
import {Row,Col} from 'react-bootstrap';
const SkeletonDropdown = () => {

    return (
      <section>
        {/* <Row >
          <Col md={2}><Skeleton duration={.5} height={40} width={150} /> </Col>
          <Col md={{ span: 2, offset: 3 }}><Skeleton duration={.15} height={60} width={65} /> </Col>
        </Row> */}
        {/* <Row>
          <Col md={{ span: 6, offset: 3 }}><Skeleton duration={.15} height={20} width={300} /></Col>
        </Row> */}
        <Row>
          <Col padding={2}><Skeleton circle={true} width={65} height={65} /><Skeleton duration={.15} height={20} width={100} /> </Col>
          <Col> <Skeleton duration={.5} height={20} width={100} /></Col>
          <Col><Skeleton duration={.5} height={20} width={100} /> </Col>
          <Col> <Skeleton duration={.5} height={20} width={100} /></Col>
          <Col><Skeleton duration={.5} height={20} width={100} /> </Col>
        </Row>
        <Row >
          <Col><Skeleton rectangle={true} height={400} width={600} /></Col>
          <Col><Skeleton rectangle={true} height={400} width={600} /> </Col>
        </Row>   
        <Row>
          <Col><Skeleton rectangle={true} height={400} width={600} /></Col>
          <Col><Skeleton rectangle={true} height={400} width={600} /> </Col>
        </Row>  
       </section>
    );
  };
  const SkeletonMapCard = () => {

    return (
      <section>
        <Row>
        <Skeleton rectangle={true} height={300} width={250} /> 
        &nbsp;&nbsp;<Skeleton rectangle={true} height={100} width={100} />
        </Row>   
      </section>
    );
  };
  const SkeletonCard = () => {

    return (
      <section>
        <div>
        <Skeleton rectangle={true} height={250} width={240} />&nbsp;&nbsp;&nbsp;&nbsp;
        <Skeleton rectangle={true} height={250} width={240} />
        <br/>
        <br/>
        <Skeleton rectangle={true} height={250} width={240} />&nbsp;&nbsp;&nbsp;&nbsp;
        <Skeleton rectangle={true} height={250} width={240} />


</div>
      </section>

);
  };
   export { SkeletonCard, SkeletonMapCard, SkeletonDropdown}