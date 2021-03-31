import React from "react";
import Skeleton from "react-loading-skeleton";
import {Row } from 'react-bootstrap';
const SkeletonDropdown = () => {

    return (
      <section>
        <Row>
        <h2 className="section-title" >
          <Skeleton duration={.15} height={20} width={250} />
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={20} width={250} />
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={20} width={250} />
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={20} width={250} />
        </h2>
        </Row>
        <Row>
        <h2 className="section-title">
          <Skeleton duration={.15} height={20} width={250} />
        </h2>
        </Row>
      </section>
    );
  };
  const SkeletonMapCard = () => {

    return (
      <section>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Skeleton rectangle={true} height={500} width={450} /> 
                &nbsp;&nbsp;<Skeleton rectangle={true} height={150} width={140} />
                
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