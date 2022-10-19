import TopBar from "../admin/components/topbar/TopBar";
import Sidebar from "../admin/components/sidebar/Sidebar";
import FeaturedInfo from "../admin/components/featuredInfo/FeaturedInfo";
import Chart from "../admin/components/chart/Chart";
import {userData} from './dummyData'
import WidgetSm from "../admin/components/widgetSm/WidgetSm";
import WidgetLg from "../admin/components/widgetLg/WidgetLg";
import Home from './page/home/Home';

import './App.css'

function Layout() {
  return (
    <div className="body">
      <TopBar/>
     <div className="container">

      <Sidebar/>
     <Home/>
      </div>
    </div>
  )
}

export default Layout