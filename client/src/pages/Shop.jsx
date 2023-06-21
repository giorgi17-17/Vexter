import React from "react";
import { useEffect, useState } from "react";
import Product from "../components/Product";
import { db } from "../firebase/firebase";
import styles from "../components/css/shop.module.css";
import { ShoppingCart } from "../Context/CartContext";
import Categories from "../components/Categories";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { ProductsSkeleton } from "../components/ProductsSkeleton";
import MobileCategories from "../components/MobileCategories";

const Shop = () => {
  const { firstPath, secondPath } = ShoppingCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: undefined });

  useEffect(() => {
    window.scrollTo(0, 0);

    const collRef = collection(db, "products");

    const q = query(
      collRef,
      where("category.gender", "==", `${firstPath}`),
      where("category.type", "==", `${secondPath}`)
      // where("quantity", "!=", 0)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items = [];
      snap.forEach((doc) => {
        items.push(doc.data());
      });
      setProducts(items);
      setLoading(false);
    });

    return () => {
      unsub();
    };
    // products.length იწვევს პრობლემას
  }, [firstPath, secondPath]);

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

  // console.log(products)

  return (
    <div className={styles.container}>
      <div className={styles.categories}>
        {windowSize.width < 600 ? (
          <MobileCategories setProducts={setProducts} />
        ) : (
          <Categories setProducts={setProducts} />
        )}
      </div>
      <div className={styles.products}>
        {loading && <ProductsSkeleton cards={8} />}

        {products.length > 0 && (
          <div className={styles.productsTrue}>
            <p className={styles.productsCount}>{products.length} პროდუქტი</p>
            {products
              .filter((item) => item.quantity !== 0)
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
        {products.length === 0 && loading === false && (
          <div className={styles.productsFalse}>
            <h1>პროდუქტები ვერ მოიძებნა</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
