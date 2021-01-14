import React from "react";
import Skeleton from "react-loading-skeleton";
import {Table, Row, Col } from 'react-bootstrap';
const SkeletonCard = () => {

    return (
      <section>
        <p className="card-channel">

       </p>
       
        <Row>
        <h2 className="section-title" >
          <Skeleton duration={.15} height={10} width={300} />
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={10} width={300} />
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={10} width={300} />
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={10} width={300} />
        </h2>
        </Row>
        <Row>
        <h2 className="section-title" >
          <Skeleton duration={.15} height={30} width={400} />
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={30} width={400} />
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={30} width={400} />
        </h2>
        <hr/>
        <h2 className="section-title">
          <Skeleton duration={.15} height={30} width={400} />
        </h2>
        </Row>
        <h2 className="section-title">
          <Skeleton duration={.15} height={30} width={400} />
        </h2>
       
          {Array(1)
            .fill()
            .map((item, index) => (
              <li className="card" key={index}>
{/*         
                <Skeleton height={1180} width={`65%`}/> */}
                <h4 className="card-title">
                &nbsp;&nbsp;&nbsp;&nbsp;<Skeleton rectangle={true} height={800} width={1000} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Skeleton height={250} width={`15%`} />
                    {/* <p className="card-channel">
                        <Skeleton width={`40%`} />    
                    </p> */}
               

                </h4>

              </li>
            ))}
       
      </section>
    );
  };

  export default SkeletonCard;