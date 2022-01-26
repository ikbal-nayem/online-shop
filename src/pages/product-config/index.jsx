import React from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import asyncComponent from '../../util/asyncComponent';
// import FilterRoute from 'components/FilterRoutes';
// import user_type from 'util/user_type';


const Color = asyncComponent(() => import('./Color'))
const Size = asyncComponent(() => import('./Size'))
const NotFound = asyncComponent(() => import('../error/NotFound'))

const ProductConfigRoutes = ()=>{
  // if(pathname === '/configuration')
  //   return <Navigate to="/" />

  return(
    <Routes>
      <Route path="/color" element={<Color/>}/>
      <Route path="/size" element={<Size/>}/>
      <Route path="/" element={<NotFound/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  )
}

export default ProductConfigRoutes;