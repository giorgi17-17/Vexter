import React from "react";
import { useEffect, useState } from "react";
import Product from "../components/Product";
import { db } from "../firebase/firebase";
import styles from "../components/css/shop.module.css";
import { ShoppingCart } from "../Context/CartContext";
import Categories from "../components/Categories";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const Shop = () => {
  const { firstPath, secondPath } = ShoppingCart();

  const [products, setProducts] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);

    const collRef = collection(db, "products");

    const q = query(
      collRef,
      where("category.gender", "==", `${firstPath}`),
      where("category.type", "==", `${secondPath}`)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items = [];
      snap.forEach((doc) => {
        items.push(doc.data());
      });
      setProducts(items);
    });

    return () => {
      unsub();
    };
  }, [firstPath, secondPath]);
  // console.log(products)

  return (
    <div className={styles.container}>
      <div className={styles.categories}>
        <Categories setProducts={setProducts} />
      </div>
      <div className={styles.products}>
        {products.length > 0 ? (
          <div className={styles.productsTrue}>
            <p className={styles.productsCount}>{products.length} პროდუქტი</p>
            {products.map((item) => {
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
        ) : (
          <div className={styles.productsFalse}>
            <h1>პროდუქტები ვერ მოიძებნა</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
