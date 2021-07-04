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
      <Grid container direction="row" justify="space-between" alignItems="flex-end">
        <Grid  xs={1}>
          <Skeleton height={25}/>
        </Grid>  
        <Grid  xs={3}>
          <Skeleton height={25}/>
        </Grid>  
        <Grid  xs={1}>
          <Skeleton height={25}/>
        </Grid>
      </Grid>
      <Box pt={7} lg={12}>
      <Grid  lg={12} item container spacing={2} padding={2} >
        <Grid lg={12} sm={6}>
          <Row className=' mt-3 mb-3'>
            <Col><Skeleton circle={true}  width ={65} height={65}/> </Col>
            <Col><Skeleton height={30}/> </Col>
            <Col><Skeleton height={30}/> </Col>
            <Col><Skeleton height={30}/> </Col>
            <Col><Skeleton height={30}/> </Col>
            <Col><Skeleton height={30}/> </Col>
            <Col><Skeleton circle={true}  width ={30} height={30}/> </Col>
          </Row>
        </Grid>
        <Grid item lg={6} xs={12} sm={6}  zeroMinWidth><Skeleton height={400}/></Grid>
        <Grid item lg={6} xs={12} sm={6}  ><Skeleton height={400}/></Grid>
        <Grid item lg={6} xs={12} sm={6}  ><Skeleton height={400}/></Grid>
        <Grid item lg={6} xs={12} sm={6}  ><Skeleton height={400}/></Grid>
      </Grid>  
      </Box>
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
    <Box lg={12}>
      <Grid  lg={12} item container>
        <Grid item lg={12} xs={12} sm={12}><Skeleton height={400}/></Grid>
      </Grid>
    </Box>
  );
};
export { SkeletonCard, SkeletonMapCard, SkeletonDropdown}