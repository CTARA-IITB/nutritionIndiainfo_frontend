import React from "react";
import "./SkeletonCard.css";
// import Skeleton from "react-loading-skeleton";
import {Row,Col} from 'react-bootstrap';
import {
  Grid,
  Box,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const SkeletonDropdown = () => {
  return (
    <Box p={2} lg={12} >
      <Grid  lg={12} item container spacing={2} padding={2}>
        <Grid item lg={3} xs={6} sm={3}  zeroMinWidth><Skeleton animation='wave' height={30}/></Grid>
        <Grid item lg={3} xs={6} sm={3}  ><Skeleton animation='wave' height={30}/></Grid>
        <Grid item lg={3} xs={6} sm={3}  ><Skeleton animation='wave' height={30}/></Grid>
        <Grid item lg={3} xs={6} sm={3}  ><Skeleton animation='wave' height={30}/></Grid>
        <Grid item lg={6} xs={12} sm={6}  zeroMinWidth><Skeleton animation='wave' height={400}/></Grid>
        <Grid item lg={6} xs={12} sm={6}  ><Skeleton animation='wave' height={400}/></Grid>
        <Grid item lg={6} xs={12} sm={6}  ><Skeleton animation='wave' height={400}/></Grid>
        <Grid item lg={6} xs={12} sm={6}  ><Skeleton animation='wave' height={400}/></Grid>
      </Grid>  
    </Box>
  );
};

const SkeletonCard = ({className}) => {
  return (
    <Grid container spacing={1}>
      <Grid item lg={8} xs={12} sm={12} md={6} >
        <Skeleton className={className}  animation='wave' height={400} />
      </Grid>
    </Grid>
  );
};
export { SkeletonCard, SkeletonDropdown}