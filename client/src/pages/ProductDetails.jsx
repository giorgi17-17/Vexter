import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import styles from "../components/css/productDetails.module.css";
import { ShoppingCart } from "../Context/CartContext";
import { AiOutlineCheck, AiOutlineHeart } from "react-icons/ai";
// import { BsFillBagPlusFill } from "react-icons/bs";
import ImageCarousel from "../components/ImageCarousel";
import { Favorites } from "../Context/FavoritesContext";
import MainSections from "../components/MainSections";

const Productdetails = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  // const [size, setSize] = useState("");
  // const [error, setError] = useState("");
  const { getFavoritesQuantity, addOneToFavorites, deleteOneFromFavorites } =
    Favorites();
  const favoritesQuantity = getFavoritesQuantity(id);

  const { addOneToCart, getPoductQuantity, removeOneFromCart} = ShoppingCart();
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
    });

    return () => {
      unsub();
    };
  }, [id]);
  // window.scrollTo(0, 0);
  // add place where u show quantity of product
  let type 

  return (
    <div className={styles.container}>
      {products.map((item) => {
        type = item.category.type
        // console.log(item.category.size)
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
                <p className={styles.color}>ზომა: {item.category.size}</p>
                <Link className={styles.link} to={`/storepage/${item.name}`}>
                <p className={styles.color}>მაღაზია: {item.name}</p>
                </Link>
                
              </div>
              {/* <div className={styles.input}>
                {!size && <p className={styles.sizeError}>{error}</p>}

                {item.category.type === "shoe" ? (
                  <select
                    onChange={(e) => {
                      setSize(e.target.value);
                    }}
                  >
                    <option value="">Size</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                  </select>
                ) : item.category.type === "clothe" ? (
                  <select
                    onChange={(e) => {
                      setSize(e.target.value);
                    }}
                  >
                    <option value="Size">Size</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                  </select>
                ) : item.category.type === "bags" ? (
                  <select
                    onChange={(e) => {
                      setSize(e.target.value);
                    }}
                  >
                    <option value="Size">Size</option>
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
                    <option value="subType">Sub Type</option>
                  </select>
                )}
              </div> */}
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
                          addOneToCart(
                            id,
                            item.title,
                            item.image,
                            item.price,
                            item.name,
                            item.category.size
                          );
                        // setError("ზომა არ არის მითითებული");
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
                          item.category.size
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
        <MainSections type={`${type}`}/>
      </div>
    </div>
  );
};

export default Productdetails;
