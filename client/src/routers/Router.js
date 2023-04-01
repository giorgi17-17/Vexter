import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Main from "../pages/Main";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Account from "../pages/Account";
import AdminSignUp from "../pages/AdminSignUp";
import Shop from "../pages/Shop";
import ShopType from "../pages/ShopType";
import Favorites from "../pages/FavoriteProducts";
import Orders from "../pages/Orders";
import StoreInformation from "../pages/StoreInformation";
import StorePage from "../pages/StorePage";
import Success from "../pages/Success";
// import { useEffect } from "react";
// import ReactGA from "react-ga"

const Router = () => {

  // useEffect(() => {
  //   ReactGA.pageview(window.location.pathname + window.location.search)
  // },[])

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route exact path="/:gender/:category" element={<Shop />} />
        <Route exact path="/:gender/:category/:type" element={<ShopType />} />
        <Route exact path='/:gender' element={<Main />} />
        <Route exact path='/detail/:id' element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="admin-sign-up" element={<AdminSignUp />} />
        <Route path="account" element={<Account />} />
        <Route path="orders" element={<Orders />} />
        <Route path="storeInfo" element={<StoreInformation />} />
        <Route path="storepage/:storename" element={<StorePage />} />
        <Route path="/success" element={<Success />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
  );
};

export default Router;
