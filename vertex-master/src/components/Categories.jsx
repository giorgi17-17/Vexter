import { useState, useEffect } from "react";
import styles from "../components/css/categories.module.css";

import { db } from "../firebase/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ShoppingCart } from "../Context/CartContext";

const Categories = ({ setProducts }) => {
  const { firstPath, secondPath, thirdPath } = ShoppingCart();
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  // const [price, setPrice] = useState("");
  const [subType, setSubType] = useState("");
  const [gender, setGender] = useState("");
  const [sortBy, setSortBy] = useState("");
  // const [name, setName] = useState("");

  //   const [products, setProducts] = useState([]);
  //   console.log(products)
  useEffect(() => {
    const collRef = collection(db, "products");
    setGender(firstPath);
    setType(secondPath);
    let q = query(collRef);
    if (subType !== "")
      q = query(q, where("category.subType", "==", `${subType}`));
    if (brand !== "") q = query(q, where("category.brand", "==", `${brand}`));
    // if (price !== "") q = query(q, where("price", "==", `${price}`));
    if (size !== "") q = query(q, where("category.size", "==", `${size}`));
    if (type !== "") q = query(q, where("category.type", "==", `${type}`));
    if (color !== "") q = query(q, where("category.color", "==", `${color}`));
    if (gender !== "")
      q = query(q, where("category.gender", "==", `${gender}`));
    if (thirdPath)
      q = query(q, where("category.subType", "==", `${thirdPath}`));


    if (sortBy === "asc" || sortBy === "desc") {
      if (sortBy) q = query(q, orderBy("price", `${sortBy}`));
    } else if (sortBy === "axali") {
      q = query(q, orderBy("createdAt", `desc`));
    } else if (sortBy === "dzveli") {
      q = query(q, orderBy("createdAt", `asc`));
    }

    const unsub = onSnapshot(q, (snap) => {
      // setProducts([])
      const items = [];
      snap.forEach((doc) => {
        // setProducts(doc.data())
        items.push(doc.data());
      });
      setProducts(items);
    });

    return () => {
      unsub();
    };
  }, [
    sortBy,
    subType,
    setProducts,
    brand,
    size,
    color,
    // price,
    firstPath,
    secondPath,
    gender,
    type,
    thirdPath,
  ]);
  return (
    <div className={styles.categoriesContainer}>
      <select
        onChange={(e) => {
          setSortBy(e.target.value);
        
        }}
      >
        <option value="">Sort By</option>
        <option id="priceUp" value="asc">
          ფასი ზრდადი
        </option>
        <option id="priceDown" value="desc">
          ფასი კლებადი
        </option>
        <option id="new" value="axali">
          ახალი
        </option>
        <option id="old" value="dzveli">
          ძველი
        </option>
      </select>
      <select
        onChange={(e) => {
          setBrand(e.target.value);
        }}
      >
        <option value="">Brand</option>
        <option value="nike">Nike</option>
        <option value="addidas">Adiddas</option>
        <option value="puma">Puma</option>
        <option value="hand-made">Hand made</option>
        <option value="New Balance">New Balance</option>
      </select>
      <select
        onChange={(e) => {
          setColor(e.target.value);
        }}
      >
        <option value="">Color</option>
        <option value="white">White</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
      </select>
      {thirdPath === undefined ? (
        <select
          onChange={(e) => {
            setSubType(e.target.value);
          }}
        >
          <option value="">Sub Type</option>
          <option value="shirt">Shirt</option>
          <option value="sweater">Sweater</option>
          <option value="jeans">Jeans</option>
        </select>
      ) : null}

      {secondPath !== "shoe" ? (
        <select
          onChange={(e) => {
            setSize(e.target.value);
          }}
        >
          <option value="">Size</option>
          <option value="s">S</option>
          <option value="m">M</option>
          <option value="l">L</option>
        </select>
      ) : (
        <select
          onChange={(e) => {
            setSize(e.target.value);
          }}
        >
          <option value="">Size</option>
          <option value="40">40</option>
          <option value="41">41</option>
          <option value="42">42</option>
        </select>
      )}
      {/* <input type="range" min="0" max="10" /> */}
    </div>
  );
};

export default Categories;
