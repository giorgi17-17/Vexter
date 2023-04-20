import { useState, useEffect } from "react";
import styles from "./css/categories.module.css";
import Slider from "@mui/material/Slider";
import { db } from "../firebase/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ShoppingCart } from "../Context/CartContext";
// import { BsEmojiNeutralFill } from "react-icons/bs";

function valuetext(value) {
  return `${value}`;
}

const Categories = ({ setProducts }) => {
  const { firstPath, secondPath, thirdPath } = ShoppingCart();
  const [priceArray, setPriceArray] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const [save, setSave] = useState(false);
  // const [test, setTest] = useState(false);

  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  // const [price, setPrice] = useState("");
  const [subType, setSubType] = useState("");
  // const [gender, setGender] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [value, setValue] = useState([0, 1000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const gender = localStorage.getItem("gender");
  if (gender) {
    //'splited' make gender to array and removes first and last charaqter
    const splited = gender.split("").slice(1, -1);
    //'path' joins array items into string
    var path = splited.join("");
  }

  let minElement = priceArray[0];

  for (let i = 1; i < priceArray.length; ++i) {
    if (priceArray[i] < minElement) {
      minElement = priceArray[i];
    }
  }

  let maxElement = priceArray[0];

  for (let i = 1; i < priceArray.length; ++i) {
    if (priceArray[i] > maxElement) {
      maxElement = priceArray[i];
    }
  }

  // useEffect(() => {
  //   setDropDown(false);
  // }, [test]);

  useEffect(() => {
    const collRef = collection(db, "products");

    // setGender(firstPath);

    setType(secondPath);
    let q = query(collRef);
    if (subType !== "")
      q = query(q, where("category.subType", "==", `${subType}`));
    if (brand !== "") q = query(q, where("category.brand", "==", `${brand}`));
    // if (price !== "") q = query(q, where("price", "==", `${price}`));
    if (size !== "") q = query(q, where("category.size", "==", `${size}`));
    // if (type !== "") q = query(q, where("category.type", "==", `${type}`));
    if (color !== "") q = query(q, where("category.color", "==", `${color}`));
    if (path !== "") q = query(q, where("category.gender", "==", `${path}`));

    if (firstPath === "man" || firstPath === "woman" || firstPath === "kids") {
      if (type !== "") q = query(q, where("category.type", "==", `${type}`));
    }

    if (save) {
      if (value[0] >= 1) q = query(q, where("price", ">=", value[0]));
      if (value[1] >= 1) q = query(q, where("price", "<=", value[1]));
    }

    // if (thirdPath)
    //   q = query(q, where("category.subType", "==", `${thirdPath}`));

    if (sortBy === "asc" || sortBy === "desc") {
      if (sortBy) q = query(q, orderBy("price", `${sortBy}`));
    } else if (sortBy === "axali") {
      q = query(q, orderBy("createdAt", `desc`));
    } else if (sortBy === "dzveli") {
      q = query(q, orderBy("createdAt", `asc`));
    }

    //   if(test === false){
    //   setDropDown(false)
    // }
    // setDropDown(false)

    const unsub = onSnapshot(q, (snap) => {
      const items = [];
      const prices = [];
      snap.forEach((doc) => {
        prices.push(doc.data().price);
        items.push(doc.data());
      });
      setPriceArray(prices);
      setProducts(items);
    });

    return () => {
      unsub();
    };
  }, [
    value,
    save,
    minElement,
    sortBy,
    subType,
    setProducts,
    brand,
    size,
    color,
    // price,
    firstPath,
    secondPath,
    // gender,
    path,
    type,
    thirdPath,
    // priceArray
  ]);
  console.log(save);
  // if(test === false){
  //   setDropDown(false)
  // }
  return (
    <div className={styles.categoriesContainer}>
      <select
        onChange={(e) => {
          setSortBy(e.target.value);
        }}
      >
        <option value="">დალაგება</option>
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
      {thirdPath === undefined ? (
        <select
          onChange={(e) => {
            setSubType(e.target.value);
          }}
        >
          <option value="">ქვე კატეგორია</option>
          <option value="shirt">Shirt</option>
          <option value="sweater">Sweater</option>
          <option value="jeans">Jeans</option>
        </select>
      ) : null}
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

      <div className={styles.price}>
        {!dropDown ? (
          <button onClick={() => setDropDown(!dropDown)}>
            {dropDown ? null : "ფასი"}
          </button>
        ) : null}

        {dropDown && (
          <div className={styles.rangeSlider}>
            <Slider
              getAriaLabel={() => "Temperature range"}
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              min={0}
              max={500}
              size="small"
            />
            <div className={styles.priceValues}>
              <div>{value[0]}</div>
              <div>{value[1]}</div>
            </div>
            <div
              className={styles.save}
              onClick={() => {
                // Do something when "Save" button is clicked
                setDropDown(false); // Close the dropdown
                setSave(true);
              }}
            >
              save
            </div>
          </div>
        )}
      </div>

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
