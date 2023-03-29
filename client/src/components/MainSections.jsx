import React from "react";
import styles from "./css/mainSections.module.css";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { ShoppingCart } from "../Context/CartContext";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import Product from "./Product";
import { Link } from "react-router-dom";

const MainSections = ({ type }) => {
  const [products, setProducts] = useState([]);
  const { firstPath } = ShoppingCart();

  const localgender = localStorage.getItem("gender");

  if (localgender) {
    //'splited' make gender to array and removes first and last charaqter
    const splited = localgender.split("").slice(1, -1);
    //'path' joins array items into string
    var path = splited.join("");
  }

  useEffect(() => {
    const collRef = collection(db, "products");

    const q = query(
      collRef,
      where("category.gender", "==", `${path}`),
      where("category.type", "==", `${type}`)
    );

    const getProducts = onSnapshot(q, (snap) => {
      const items = [];
      snap.forEach((doc) => {
        items.push(doc.data());
      });
      setProducts(items);
      //   console.log(items);
    });

    return () => {
      getProducts();
    };
  }, [localgender, path, type]);

  var gender;
  if (firstPath === "man") {
    gender = "კაცის";
  } else if (firstPath === "woman") {
    gender = "ქალის";
  } else if (firstPath === "kids") {
    gender = "ბავშვის";
  }

  var apparelType;
  if (type === "shoe") {
    apparelType = "ფეხსაცმელი";
  } else if (type === "clothe") {
    apparelType = "ტანსაცმელი";
  } else if (type === "sport") {
    apparelType = "სპორტული ჩასაცმელი";
  }else if(type === "bags") {
    apparelType = "ჩანთები";
  }

  return (
    <div className={styles.container}>
      <div className={styles.sectionName}>
        <p>
          {gender} {apparelType}
        </p>
        <Link className={styles.seeMore} to={`/${path}/${type}`}>
          მეტის ნახვა
        </Link>
      </div>
      <div className={styles.products}>
        {products.map((item) => {
          return (
            <div key={item.id} className={styles.prod}>
              <Product
                title={item.title}
                name={item.name}
                img={item.image}
                price={item.price}
                id={item.id}
                storeLocation={item.location}
                size={item.category.size}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainSections;
