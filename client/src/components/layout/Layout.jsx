import React from "react";
import { AuthContextProvider } from "../../Context/AuthContext.js";
import CartProvider from "../../Context/CartContext.js";
import Router from "../../routers/Router.js";
import Footer from "../Footer";
import Header from "../Header";
import "../../App.css";
import FavoritesProvider from "../../Context/FavoritesContext.js";
import { SkeletonTheme } from "react-loading-skeleton";

const Layout = () => {
  return (
    <div className="layout">
      <SkeletonTheme >
        <AuthContextProvider>
          <CartProvider>
            <FavoritesProvider>
              <Header />
              <div className="body">
                <Router />
              </div>
              <Footer />
            </FavoritesProvider>
          </CartProvider>
        </AuthContextProvider>
      </SkeletonTheme>
    </div>
  );
};

export default Layout;
