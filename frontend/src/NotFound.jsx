import React from 'react';
import { Link } from 'react-router-dom';
let origin = window.location.origin;
console.log(origin)
export const NotFound = () => (
  <div>
    <h1>404 - Not Found!</h1>
    <a href={`${window.location.origin}`}>Go to Home Page</a>
  </div>
);
