import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Main from "../pages/Main";
// import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
// import Account from "../pages/Account";
import AdminSignUp from "../pages/AdminSignUp";
import Favorites from "../pages/FavoriteProducts";
// import Orders from "../pages/Orders";
import StoreInformation from "../pages/StoreInformation";
import StorePage from "../pages/StorePage";
import Success from "../pages/Success";
// import ReactGA from "react-ga"
import { lazy, Suspense } from "react";
import Error from "../components/Error";
const Shop = lazy(() => import("../pages/Shop"));
const ShopType = lazy(() => import("../pages/ShopType"));
const Account = lazy(() => import("../pages/Account"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Orders = lazy(() => import("../pages/Orders"));

const Router = () => {
  // useEffect(() => {
  //   ReactGA.pageview(window.location.pathname + window.location.search)
  // },[])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        exact
        path="/:gender/:category"
        element={
          <Suspense fallback={<Error />}>
            <Shop />
          </Suspense>
        }
      />
      <Route
        exact
        path="/:gender/:category/:type"
        element={
          <Suspense fallback={<Error />}>
            <ShopType />
          </Suspense>
        }
      />
      <Route
        path="account"
        element={
          <Suspense fallback={<Error />}>
            <Account />
          </Suspense>
        }
      />
      <Route
        exact
        path="/detail/:id"
        element={
          <Suspense fallback={<Error />}>
            <ProductDetails />
          </Suspense>
        }
      />
      <Route
        path="orders"
        element={
          <Suspense fallback={<Error />}>
            <Orders />
          </Suspense>
        }
      />
      <Route exact path="/:gender" element={<Main />} />
      <Route path="cart" element={<Cart />} />
      <Route path="favorites" element={<Favorites />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="admin-sign-up" element={<AdminSignUp />} />
      <Route path="storeInfo" element={<StoreInformation />} />
      <Route path="storepage/:storename" element={<StorePage />} />
      <Route path="/success" element={<Success />} />
      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
  );
};

export default Router;
