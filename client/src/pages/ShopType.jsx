import React from "react";
import { useEffect, useState } from "react";
import Product from "../components/Product";
import { db } from "../firebase/firebase";
import styles from "../components/css/shopType.module.css";
import { ShoppingCart } from "../Context/CartContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Categories from "../components/Categories";
import { ProductsSkeleton } from "../components/ProductsSkeleton";
import MobileCategories from "../components/MobileCategories";

const Shop = () => {
  const { firstPath, secondPath, thirdPath } = ShoppingCart();

  const [productsType, setProductsType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: undefined });

  useEffect(() => {
    window.scrollTo(0, 0);

    const collRef = collection(db, "products");
    const q = query(
      collRef,
      where("category.gender", "==", `${firstPath}`),
      where("category.type", "==", `${secondPath}`),
      where("category.subType", "==", `${thirdPath}`)
    );
    const unsub = onSnapshot(q, (snap) => {
      const items = [];
      snap.forEach((doc) => {
        items.push(doc.data());
      });
      setProductsType(items);
      setLoading(false);
      // console.log(items);
    });
    // if (productsType.length > 0) {
    //   setLoading(false);
    //   console.log(productsType.length);
    // }

    return () => {
      unsub();
    };
    // productsType.length იწვევს პრობლემას
  }, [firstPath, secondPath, thirdPath]);
  // console.log(productsType);

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
console.log(productsType)
  return (
    <div className={styles.container}>
      <div className={styles.categories}>
        {windowSize.width < 600 ? (
          <MobileCategories setProducts={setProductsType} />
        ) : (
          <Categories setProducts={setProductsType} />
        )}
      </div>
      <div className={styles.products}>
        {loading && <ProductsSkeleton cards={8} />}

        {productsType.length > 0 && (
          <div className={styles.productsTrue}>
            <p className={styles.productsCount}>
              {productsType.length} პროდუქტი
            </p>
            {productsType
              .filter(
                (item) =>
                  item.variants &&
                  item.variants.find((variant) => variant.quantity > 0)
              )
              .map((item) => {
                return (
                  <div key={item.id} className={styles.prod}>
                    <Product
                      title={item.title}
                      name={item.name}
                      img={item.image}
                      price={item.price}
                      id={item.id}
                      size={item.category.size}
                      storeLocation={item.location}
                    />
                  </div>
                );
              })}
          </div>
        )}
        {productsType.length === 0 && loading === false && (
          <div className={styles.productsFalse}>
            <h1>პროდუქტები ვერ მოიძებნა</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
