import React from "react";
import { useEffect, useState } from "react";
import Product from "../components/Product";
import { db } from "../firebase/firebase";
import styles from "../components/css/shop.module.css";
import { ShoppingCart } from "../Context/CartContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Categories from "../components/Categories";

const Shop = () => {
  const { firstPath, secondPath, thirdPath } = ShoppingCart();

  const [productsType, setProductsType] = useState([]);

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
      // console.log(items);
    });

    return () => {
      unsub();
    };
  }, [firstPath, secondPath, thirdPath]);
  // console.log(productsType);

  return (
    <div className={styles.container}>
      <div className={styles.categories}>
        <Categories setProducts={setProductsType} />
      </div>
      <div className={styles.products}>
        {productsType.map((item) => {
          return (
            <div key={item.id} className={styles.prod}>
              <Product
                title={item.title}
                name={item.name}
                img={item.image}
                price={item.price}
                id={item.id}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shop;
