import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import styles from "../components/css/productDetails.module.css";
import { ShoppingCart } from "../Context/CartContext";
import { AiOutlineCheck, AiOutlineHeart } from "react-icons/ai";
import ImageCarousel from "../components/ImageCarousel";
import { Favorites } from "../Context/FavoritesContext";
import MainSections from "../components/MainSections";
import { ProductsDetailsSkeleton } from "../components/ProductsSkeleton";

const Productdetails = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [images, setImages] = useState([]);
  const [size, setSize] = useState("");
  const [error, setError] = useState("");
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
    });

    return () => {
      unsub();
    };
  }, [id]);

  let type;
  return (
    <div className={styles.container}>
      {loading && <ProductsDetailsSkeleton cards={1} />}
      {products.map((item) => {
        type = item.category.type;
        return (
          <div key={item.id} className={styles.cont}>
            <div className={styles.productImages} key={item.id}>
              <ImageCarousel images={images} />
            </div>
            <div className={styles.infoContainer}>
              <div className={styles.info}>
                <p className={styles.brand}>{item.category.brand}</p>
                <p className={styles.title}>{item.title}</p>
                <p className={styles.price}>₾ {item.price}</p>
                <p className={styles.color}>ფერი: {item.category.color}</p>
                <p className={styles.color}>რაოდენობა: {item.quantity}</p>

                {/* <p className={styles.color}>ზომა: {item.category.size}</p> */}
                <Link className={styles.link} to={`/storepage/${item.name}`}>
                  <p className={styles.color}>მაღაზია: {item.name}</p>
                </Link>
              </div>
              <div className={styles.input}>
                {!size && <p className={styles.sizeError}>{error}</p>}

                {item.category.type === "shoe" ? (
                  <select
                    value={size}
                    onChange={(e) => {
                      setSize(e.target.value);
                      setError("");
                    }}
                  >
                    <option value="">Size</option>
                    {item.category.size.map((sizeItem) => (
                      <option key={sizeItem} value={sizeItem}>
                        {sizeItem}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={size}
                    onChange={(e) => {
                      setSize(e.target.value);
                      setError("");
                    }}
                  >
                    <option value="Size">Size</option>
                    {item.category.size.map((sizeItem) => (
                      <option key={sizeItem} value={sizeItem}>
                        {sizeItem}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className={styles.buttons}>
                <div className={styles.addButton}>
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
                </div>
                <div className={styles.favButton}>
                  {favoritesQuantity > 0 ? (
                    <div
                      onClick={() => deleteOneFromFavorites(id)}
                      className={styles.checkIcon}
                    >
                      <AiOutlineCheck size={"1.5rem"} />
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
          </div>
        );
      })}
      <div className={styles.downSections}>
        <MainSections type={`${type}`} />
      </div>
    </div>
  );
};

export default Productdetails;
