import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import BarClassComponent from './BarClassComponent';
import SideNavSecond from "../SideNav/SideNavSecond";

export const Print = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
         <SideNavSecond componentRef={componentRef} />
        <BarClassComponent ref={componentRef}/>
    </div>
  );
};