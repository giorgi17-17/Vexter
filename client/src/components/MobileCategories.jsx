import { useState, useEffect } from "react";
// import styles from "./css/categories.module.css";
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
import styles from "../components/css/mobileCategories.module.css";
import {
  apparelTypesArray,
  colors,
  clotheSize,
  shoeSize,
  brands,
} from "./assets";
import BrandSelector from "./BrandSelector";

function valuetext(value) {
  return `${value}`;
}

const MobileCategories = ({ setProducts }) => {
  const { firstPath, secondPath, thirdPath } = ShoppingCart();
  const [priceArray, setPriceArray] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const [save, setSave] = useState(false);
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [subType, setSubType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [value, setValue] = useState([0, 1000]);
  const [filterButton, setFilterButton] = useState(false);

  // ...Rest of your component logic goes here...

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBrandSelect = (brand) => {
    setBrand(brand);
  };

  const gender = localStorage.getItem("gender");
  if (gender) {
    //'splited' make gender to array and removes first and last charaqter
    const splited = gender.split("").slice(1, -1);
    //'path' joins array items into string
    var path = splited.join("");
  }
  const apparelTypes = apparelTypesArray(path);

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

  useEffect(() => {
    const collRef = collection(db, "products");
    // setApparelPath(secondPath);
    setType(secondPath);
    //

    let q = query(collRef);
    if (subType !== "")
      q = query(q, where("category.subType", "==", `${subType}`));
    if (brand !== "") q = query(q, where("category.brand", "==", `${brand}`));
    if (size !== "")
      q = query(q, where("category.sizes", "array-contains", size));
    if (color !== "")
      q = query(q, where("category.colors", "array-contains", color));
    if (path !== "") q = query(q, where("category.gender", "==", `${path}`));

    if (firstPath === "man" || firstPath === "woman" || firstPath === "kids") {
      if (type !== "") q = query(q, where("category.type", "==", `${type}`));
    }

    if (save) {
      if (value[0] >= 1) q = query(q, where("price", ">=", value[0]));
      if (value[1] >= 1) q = query(q, where("price", "<=", value[1]));
    }

    if (sortBy === "asc" || sortBy === "desc") {
      if (sortBy) q = query(q, orderBy("price", `${sortBy}`));
    } else if (sortBy === "axali") {
      q = query(q, orderBy("createdAt", `desc`));
    } else if (sortBy === "dzveli") {
      q = query(q, orderBy("createdAt", `asc`));
    }

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
    firstPath,
    secondPath,
    path,
    type,
    thirdPath,
  ]);

  return (
    <div className={styles.mobileCategoriesContainer}>
      {!filterButton && (
        <div className={styles.filter}>
          <button
            className={styles.filterButton}
            onClick={() => setFilterButton(!filterButton)}
          >
            ფილტრი
          </button>
          <select
            className={styles.sort}
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
        </div>
      )}

      {filterButton && (
        <div className={styles.categoriesContainer}>
          {thirdPath === undefined ? (
            <select
              onChange={(e) => {
                setSubType(e.target.value);
              }}
            >
              <option value="">ქვე კატეგორია</option>
              {apparelTypes.map((type) =>
                type.path === `${firstPath}/${secondPath}` &&
                type.subMenu &&
                type.subMenu.length > 0
                  ? type.subMenu.map((subMenuOption) => (
                      <option
                        key={subMenuOption.path}
                        value={subMenuOption.path}
                      >
                        {subMenuOption.title}
                      </option>
                    ))
                  : null
              )}
            </select>
          ) : null}
        
          <BrandSelector brands={brands} onSelect={handleBrandSelect} />

          <div className={styles.price}>
            {!dropDown ? (
              <button
                onClick={() => {
                  setDropDown(!dropDown);
                  setSave(false);
                }}
              >
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
                  შენახვა
                </div>
              </div>
            )}
          </div>

          <select
            onChange={(e) => {
              setColor(e.target.value);
            }}
          >
            <option value="">ფერი</option>
            {colors.map((color, i) => (
              <option value={color.color} key={i}>
                {color.displayColor}
              </option>
            ))}
          </select>

          {secondPath !== "shoe" ? (
            <select
              onChange={(e) => {
                setSize(e.target.value);
              }}
            >
              <option value="">ზომა</option>
              {clotheSize.map((size, i) => (
                <option value={size} key={i}>
                  {size}
                </option>
              ))}
            </select>
          ) : (
            <select
              onChange={(e) => {
                setSize(e.target.value);
              }}
            >
              <option value="">ზომა</option>
              {shoeSize.map((size, i) => (
                <option value={size} key={i}>
                  {size}
                </option>
              ))}
            </select>
          )}
          <div
            className={styles.showBtn}
            onClick={() => setFilterButton(false)}
          >
            ნახვა
          </div>
          {/* <input type="range" min="0" max="10" /> */}
        </div>
      )}
    </div>
  );
};

export default MobileCategories;
