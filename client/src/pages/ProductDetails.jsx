import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import styles from "../components/css/productDetails.module.css";
import { ShoppingCart } from "../Context/CartContext";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import ImageCarousel from "../components/ImageCarousel";
import { Favorites } from "../Context/FavoritesContext";
import MainSections from "../components/MainSections";
import { ProductsDetailsSkeleton } from "../components/ProductsSkeleton";
import { colors } from "../components/assets.js";

const Productdetails = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("");
  const [error, setError] = useState("მიუთითეთ ზომა");
  const [images, setImages] = useState([]);
  const { getFavoritesQuantity, addOneToFavorites, deleteOneFromFavorites } =
    Favorites();

  const favoritesQuantity = getFavoritesQuantity(id);
  const { addOneToCart, getPoductQuantity, removeOneFromCart } = ShoppingCart();
  const productQuantity = getPoductQuantity(id);

  useEffect(() => {
    window.scrollTo(0, 0);

    const collRef = collection(db, "products");
    const q = query(collRef, where("id", "==", `${id}`));

    const unsub = onSnapshot(q, (snap) => {
      const items = [];
      const imgs = [];
      snap.forEach((doc) => {
        items.push(doc.data());
        imgs.push(doc.data().image);
      });
      setProducts(items);
      setImages(imgs[0]);
      setLoading(false);
      if (
        items.length > 0 &&
        items[0].variants &&
        items[0].variants.length > 0
      ) {
        setSize(items[0].variants[0].size); // Set the first variant's size as the default size
      }
    });

    return () => {
      unsub();
    };
  }, [id]);

  const getDisplayColor = (color) => {
    const colorMappingItem = colors.find((item) => item.color === color);
    return colorMappingItem ? colorMappingItem.displayColor : color;
  };

  return (
    <div className={styles.container}>
      {loading && <ProductsDetailsSkeleton cards={1} />}
      {products.map((item) => {
        const selectedVariant = item.variants?.find(
          (variant) => variant.size === size
        );

        return (
          <div key={item.id} className={styles.cont}>
            <div className={styles.productImages} key={item.id}>
              <ImageCarousel images={images} />
            </div>
            <div className={styles.infoContainer}>
              <div className={styles.info}>
                {/* <Link className={styles.link} to={`/storepage/${item.name}`}>
                  <p className={styles.color}>{item.name}</p>
                </Link> */}
                <Link
                  className={styles.link}
                  to={`/storepage/${item.category.brand.replace(/\s+/g, "_")}`}
                >
                  <p className={styles.brandLink}>{item.category.brand}</p>
                </Link>
                {/* <p className={styles.brand}>{item.category.brand}</p> */}
                <p className={styles.title}>{item.title}</p>
                <p className={styles.price}>₾ {item.price}</p>

                <div className={styles.input}>
                  {!size && <p className={styles.sizeError}>{error}</p>}
                  <label className={styles.selectLabel}>ზომა:</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">მიუთითეთ ზომა</option>
                    {item.variants?.map((variant, index) => (
                      <option key={index} value={variant.size}>
                        {variant.size}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedVariant && (
                  <div>
                    <p>ფერი: {getDisplayColor(selectedVariant.color)}</p>
                    <p>რაოდენობა: {selectedVariant.quantity}</p>
                  </div>
                )}
              </div>
              <div className={styles.buttons}>
                {productQuantity > 0 ? (
                  <div
                    onClick={() => removeOneFromCart(id)}
                    className={styles.checkIcon}
                  >
                    კალათიდან წაშლა
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      if (!size) {
                        setError("ზომა აირჩიეთ");
                      } else {
                        addOneToCart(
                          id,
                          item.title,
                          item.image,
                          item.price,
                          item.name,
                          size
                        );
                      }
                    }}
                    className={styles.addIcon}
                  >
                    კალათაში დამატება
                  </div>
                )}

                {favoritesQuantity > 0 ? (
                  <div
                    onClick={() => deleteOneFromFavorites(id)}
                    className={styles.favIconFill}
                  >
                    <AiFillHeart size={"2rem"} />
                  </div>
                ) : (
                  <div
                    className={styles.favIcon}
                    onClick={() =>
                      addOneToFavorites(
                        id,
                        item.title,
                        item.img,
                        item.price,
                        item.name,
                        size
                      )
                    }
                  >
                    <AiOutlineHeart size={"2rem"} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div className={styles.downSections}>
        <MainSections type={products[0]?.category.type || ""} />
      </div>
    </div>
  );
};

export default Productdetails;
