import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import ReactGA from "react-ga"

export const CartContext = createContext({
  items: [],
  getPoductQuantity: () => {},
  addOneToCart: () => {},
  removeOneFromCart: () => {},
  deleteOneFromCart: () => {},
  getTotalCost: () => {},
  getProductData: () => {},
});

if(!localStorage.getItem("cart")){
  localStorage.setItem("cart", JSON.stringify([]));
}
const cartFromlocalstoreage = JSON.parse(localStorage.getItem("cart") || []);



export function CartProvider({ children }) {
  let location = useLocation();
  const [cartProducts, setCartProducts] = useState(cartFromlocalstoreage);
  // const [addStoreLocation, setAddStoreLocation ] = useState('');
  const [storeLocation, setStoreLocation]= useState([]);
  const [products, setProducts] = useState([]); // this state is for products which are displayed in shop component

  let getStoreLocation = storeLocation

  let cost = getTotalCost();
  let delivery = 5;
  let totalAmount = cost + delivery


  // const zero = location.pathname.split(".")[0];
  let firstPath = location.pathname.split("/")[1];
  const secondPath = location.pathname.split("/")[2];
  const thirdPath = location.pathname.split("/")[3];

  // console.log(cartProducts);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartProducts || []));
    // ReactGA.pageview(window.location.pathname + window.location.search)

  }, [cartProducts,firstPath,secondPath,thirdPath]);

  //gets product quantity wich is incremented in cart components ( Not the number of items)
  function getPoductQuantity(id) {
    const quantity = cartProducts.find(
      (product) => product.id === id
    )?.quantity;

    if (quantity === undefined) {
      return 0;
    }

    return quantity;
  }

  //adds one item in cart
  function addOneToCart(id, title, img, price,name,size) {

    
    const quantity = getPoductQuantity(id);

    if (quantity === 0) {
      // product in not in cart
      setCartProducts([
        ...cartProducts,
        { id: id, quantity: 1, title, img, price,name,size },
      ]); 
    } else {
      //product is in cart
      setCartProducts(
        cartProducts.map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
    }
  }

  //deletes one item from cart
  function deleteOneFromCart(id) {
    setCartProducts((cartProducts) =>
      cartProducts.filter((currentProduct) => {
        return currentProduct.id !== id;
      })
    );
  }

  //removes whole product from cart (Not decrements quantity)
  function removeOneFromCart(id) {
    const quantity = getPoductQuantity(id);

    if (quantity === 1) {
      deleteOneFromCart(id);
    } else {
      setCartProducts(
        cartProducts.map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
      );
    }
  }

  function getProductData(id) {
    let productData = cartProducts.find((product) => product.id === id);
    // console.log(productData)
    if (productData === undefined) {
      console.log("Product data does not exist for ID: " + id);
      return undefined;
    }

    return productData;
  }

  function getTotalCost() {
    let totalCost = 0;
    cartProducts.forEach((cartItem) => {
      const productsData = getProductData(cartItem.id);
      totalCost += productsData.price * cartItem.quantity;
    });
    return totalCost;
  }

  const contextValue = {
    items: cartProducts,
    setProducts,
    products,
    getPoductQuantity,
    addOneToCart,
    removeOneFromCart,
    deleteOneFromCart,
    getTotalCost,
    getProductData,
    setCartProducts,
    firstPath,
    secondPath,
    thirdPath,
    totalAmount,
    cost,
    delivery,
    setStoreLocation,
    storeLocation,
    getStoreLocation,
  };

  //   console.log(contextValue.items);
  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
} // last

export default CartProvider;

export const ShoppingCart = () => {
  return useContext(CartContext);
};
