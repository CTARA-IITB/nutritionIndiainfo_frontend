import React from "react";
import "./SkeletonCard.css";
import Skeleton from "react-loading-skeleton";
import {Row,Col} from 'react-bootstrap';
import {
  Grid,
  Paper,
  Container,
  Box,
  Card
} from '@material-ui/core';
const SkeletonDropdown = () => {

    return (
      <Box  p={2} lg={12}>
        <Grid  lg={12} item container spacing={2} padding={2}>
          <Grid lg={12} sm={6}>
            <Row className=' mt-3 mb-3'>
              <Col><Skeleton height={50}/> </Col>
              <Col><Skeleton height={50}/> </Col>
              <Col><Skeleton height={50}/> </Col>
              <Col><Skeleton height={50}/> </Col>
              <Col><Skeleton height={50}/> </Col>
            </Row>
          </Grid>
          <Grid item lg={6} xs={12} sm={6}  zeroMinWidth><Skeleton height={400}/></Grid>
          <Grid item lg={6} xs={12} sm={6}  ><Skeleton height={400}/></Grid>
          <Grid item lg={6} xs={12} sm={6}  ><Skeleton height={400}/></Grid>
          <Grid item lg={6} xs={12} sm={6}  ><Skeleton height={400}/></Grid>
        </Grid>  
      </Box>
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