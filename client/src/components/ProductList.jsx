import Product from "./Product";
import styles from "../components/css/productList.module.css";
import React, { useEffect, useState } from "react";
import { rdb } from "../firebase/firebase";
import { onValue, ref } from "firebase/database";
const ProductList = () => {
  const [list, setList] = useState([]);
  const readRef = ref(rdb, "products");

  useEffect(() => {
    onValue(readRef, (snap) => {
      setList([]);
      const data = snap.val();
      if (data !== null) {
        Object.values(data).map((store) =>
          setList((array) => [...array, store])
        );
      }
    });
  }, []);
  return (
    <div className={styles.container}>
      <h1>Popular Products</h1>
      <div className={styles.products}>
        {list.slice(0,5).map((item, i) => {
          return (
            <div key={i} className={styles.container}>
              <Product
                title={item.title}
                name={item.name}
                img={item.img}
                price={item.price}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
