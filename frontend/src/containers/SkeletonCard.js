import React from "react";
import Skeleton from "react-loading-skeleton";
import {Table, Row, Col } from 'react-bootstrap';
const SkeletonDropdown = () => {

    return (
      <section>

       
        {/* <Row>
        <h2 className="section-title" >
          <Skeleton duration={.15} height={10} width={100} />
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={10} width={100} />
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={10} width={100} />
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={10} width={100} />
        </h2>
        </Row> */}
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

        {/* <Skeleton height={1180} width={`65%`}/>  */}
                {/* <Row> */}
                    
                        {/* <Skeleton height={150} width={`15%`} />
                        <Skeleton height={150} width={`15%`} />
                         <Skeleton height={150} width={`15%`} />
                        <Skeleton height={150} width={`15%`} /> */}
                       {/* <h4 className="card-title"> */}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Skeleton rectangle={true} height={500} width={450} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                
                    <Skeleton height={150} width={`25%`} />
               

                {/* </h4> */}
                {/* </Row> */}
            


      </section>
    );
  };
  const SkeletonCard = () => {

    return (
      <section>
        
        <Skeleton height={230} width={`45%`}/> &nbsp;&nbsp;&nbsp;&nbsp;
        <Skeleton height={230} width={`45%`}/>
        <Skeleton height={230} width={`45%`}/> &nbsp;&nbsp;&nbsp;&nbsp;
        <Skeleton height={230} width={`45%`}/>
        

      </section>

);
  };
   export { SkeletonCard, SkeletonMapCard, SkeletonDropdown}