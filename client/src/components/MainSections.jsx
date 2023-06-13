import React from "react";
import styles from "./css/mainSections.module.css";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { ShoppingCart } from "../Context/CartContext";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import Product from "./Product";
import { Link } from "react-router-dom";
import { ProductsSkeleton } from "./ProductsSkeleton";

const MainSections = ({ type }) => {
  const [products, setProducts] = useState([]);
  const { firstPath } = ShoppingCart();
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: undefined });

  const localgender = localStorage.getItem("gender");

  if (localgender) {
    //'splited' make gender to array and removes first and last charaqter
    const splited = localgender.split("").slice(1, -1);
    //'path' joins array items into string
    var path = splited.join("");
  }

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
      setLoading(false);
      //   console.log(items);
    });

    return () => {
      getProducts();
    };
  }, [localgender, path, type]);
  // console.log(windowSize.width)

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
  } else if (type === "bags") {
    apparelType = "ჩანთები";
  }

  return (
    <section className={styles.container}>
    <header className={styles.sectionName}>
      <h1>
        {gender} {apparelType}
      </h1>
      <Link className={styles.seeMore} to={`/${path}/${type}`}>
        მეტის ნახვა
      </Link>
    </header>
    <main className={styles.products}>
      {loading && windowSize.width < 600 ? (
        <ProductsSkeleton cards={2} />
      ) : null}
      {loading && windowSize.width > 600 ? (
        <ProductsSkeleton cards={7} />
      ) : null}

      {products
        .filter((item) => item.quantity !== 0)
        .map((item) => {
          return (
            <article key={item.id} className={styles.prod}>
              <Product
                title={item.title}
                name={item.name}
                img={item.image}
                price={item.price}
                id={item.id}
                storeLocation={item.location}
                size={item.category.size}
                alt={`${item.name} image`} // alt attribute for image
              />
            </article>
          );
        })}
    </main>
  </section>
  );
};

export default MainSections;
