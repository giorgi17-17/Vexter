import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { UserAuth } from "../Context/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import styles from "../components/css/storePage.module.css";
import Categories from "../components/Categories";
import Product from "../components/Product";
import { ShoppingCart } from "../Context/CartContext";

const StorePage = () => {
  const { user } = UserAuth();
//   const [store, setStore] = useState([]);
  const [products, setProducts] = useState([]);
  const { secondPath } = ShoppingCart();

  // const [storeName, setStoreName] = useState("");
//   const { firstPath } = ShoppingCart();
  // console.log(secondPath)
  useEffect(() => {
    // let storeName;
    // if (user) {
    // //   storeName = user.displayName;
    //   setStoreName(user.displayName)
    // } else {
    //     setStoreName('')
    // }
    const collRef = collection(db, "products");
    const q = query(collRef, where("name", "==", `${secondPath}`));

    const unsub = onSnapshot(q, (snap) => {
      const items = [];
      snap.forEach((doc) => {
        items.push(doc.data());
      });
      setProducts(items);
    });
    // console.log('...')
    return () => {
      unsub();
    };
  }, [secondPath,user]);

  return (
    <div className={styles.container}>
      <div className={styles.categories}>
        <Categories setProducts={setProducts} />
      </div>
        <h1>{secondPath}</h1>
      <div className={styles.products}>
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
      </div>
    </div>
  );
};

export default StorePage;
