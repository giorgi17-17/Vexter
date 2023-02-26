import { createContext, useContext, useEffect, useState } from "react";

export const FavoritesContext = createContext({
  items: [],
  getFavoritesQuantity: () => {},
  addOneToFavorites: () => {},
  removeOneFromFavorites: () => {},
  deleteOneFromFavorites: () => {},
  getTotalCost: () => {},
  getProductData: () => {},
});

if (!localStorage.getItem("favorites")) {
  localStorage.setItem("favorites", JSON.stringify([]));
}
const favoritesFromlocalstoreage = JSON.parse(
  localStorage.getItem("favorites") || []
);

export function FavoritesProvider({ children }) {
  const [favoriteProducts, setFavoriteProducts] = useState(
    favoritesFromlocalstoreage
  );

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteProducts || []));
  }, [favoriteProducts]);

  //gets product quantity wich is incremented in cart components ( Not the number of items)
  function getFavoritesQuantity(id) {
    const quantity = favoriteProducts.find(
      (product) => product.id === id
    )?.quantity;

    if (quantity === undefined) {
      return 0;
    }

    return quantity;
  }

  //adds one item in cart
  function addOneToFavorites(id, title, img, price, name,size) {
    const quantity = getFavoritesQuantity(id);

    if (quantity === 0) {
      // product in not in cart
      setFavoriteProducts([
        ...favoriteProducts,
        { id: id, quantity: 1, title, img, price, name,size },
      ]);
    } else {
      //product is in cart
      setFavoriteProducts(
        favoriteProducts.map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
    }
  }

  //deletes one item from cart
  function deleteOneFromFavorites(id) {
    setFavoriteProducts((cartProducts) =>
      cartProducts.filter((currentProduct) => {
        return currentProduct.id !== id;
      })
    );
  }

  //removes whole product from cart (Not decrements quantity)
  function removeOneFromFavorites(id) {
    const quantity = getFavoritesQuantity(id);

    if (quantity === 1) {
        deleteOneFromFavorites(id);
    } else {
      setFavoriteProducts(
        favoriteProducts.map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
      );
    }
  }

  function getProductData(id) {
    let productData = favoriteProducts.find((product) => product.id === id);
    // console.log(productData)
    if (productData === undefined) {
      console.log("Product data does not exist for ID: " + id);
      return undefined;
    }

    return productData;
  }

  function getTotalCost() {
    let totalCost = 0;
    favoriteProducts.forEach((cartItem) => {
      const productsData = getProductData(cartItem.id);
      totalCost += productsData.price * cartItem.quantity;
    });
    return totalCost;
  }

  const contextValue = {
    favoriteItems: favoriteProducts,

    getFavoritesQuantity,
    addOneToFavorites,
    removeOneFromFavorites,
    deleteOneFromFavorites,
    getTotalCost,
    getProductData,
    setFavoriteProducts,
  };

  //   console.log(contextValue.items);
  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
} // last

export default FavoritesProvider;

export const Favorites = () => {
  return useContext(FavoritesContext);
};
