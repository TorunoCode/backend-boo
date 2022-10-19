import React from "react";
import { Routes as Rou, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Movie from "../pages/Movie.jsx";
import Event from "../pages/Event.jsx";
import MovieDetail from "../pages/MovieDetail.jsx";
import Layout from "../components/admin/Layout.jsx";
import UserList from "../components/admin/page/userList/UserList";
import User from "../components/admin/page/user/User";
import NewUser from "../components/admin/page/newUser/NewUser";
import ProductsList from "../components/admin/page/productList/ProductsList";
import Product from "../components/admin/page/product/Product";
import NewProduct from "../components/admin/page/newProduct/NewProduct";
const Routes = () => {
  return (
    <Rou>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Movie" element={<Movie />} />
      <Route path="/Event" element={<Event />} />
      <Route path="/MovieDetail/:id" element={<MovieDetail />} />
      <Route path="/HomeAdmin" element={<Layout />} />
      <Route path="/HomeAdmin/users" element={<UserList/>}>
      </Route>  
      <Route path="/HomeAdmin/user/:userId" element={<User/>}>
      </Route>          
      <Route path="/HomeAdmin/newUser" element={<NewUser/>}>
      </Route>  
      <Route path="/HomeAdmin/products" element={<ProductsList/>}>
      </Route>  
      <Route path="/HomeAdmin/product/:productId" element={<Product/>}>
      </Route>          
      <Route path="/HomeAdmin/newProduct" element={<NewProduct/>}>
      </Route> 
    </Rou>
  );
};

export default Routes;
