import React from "react";
import {Route, Routes, Navigate, useLocation} from "react-router-dom";
import classnames from "classnames";
import useStyles from "./styles";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { useLayoutState } from "../../context/LayoutContext";
import asyncComponent from '../../util/asyncComponent';



import Configuration from "../../pages/configuration";
import ProductConfig from "../../pages/product-config";

const Dashboard = asyncComponent(() => import('pages/dashboard'))
const ResetPass = asyncComponent(() => import('pages/ChangePassword'))
const NotFound = asyncComponent(() => import('../../pages/error/NotFound'))


const AppRoutes = React.memo(()=>{
  const {pathname} = useLocation()

  if(pathname === '/')
    return <Navigate to="/dashboard"/>

    return(
    <Routes>
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/configuration/*" element={<Configuration/>}/>
      <Route path="/product-config/*" element={<ProductConfig/>}/>
      <Route path="/reset-password" element={<ResetPass/>}/>
      <Route path="*" element={<NotFound/>} />
    </Routes>
  )
})


function Layout() {
  var classes = useStyles();
  var layoutState = useLayoutState();
  const location = useLocation()

  return (
    <div className={classes.root}>
      <Header/>
      <Sidebar />
      <div className={classnames(classes.content, {
          [classes.contentShift]: layoutState.isSidebarOpened,
        })}
      >
        <AppRoutes reset={location.state?.reset}/>
      </div>
    </div>
  );
}

export default Layout;
