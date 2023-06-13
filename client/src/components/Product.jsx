import styles from "./css/product.module.css";
import { AiOutlineCheck, AiOutlineHeart } from "react-icons/ai";
// import { ShoppingCart } from "../Context/CartContext";
import { Link, useLocation } from "react-router-dom";
import { Favorites } from "../Context/FavoritesContext";
import ReactGA from "react-ga4";

const Product = ({ title, name, img, price, id, storeLocation, size }) => {
  // const { getPoductQuantity, addOneToCart, removeOneFromCart } = ShoppingCart();
  const { getFavoritesQuantity, addOneToFavorites, deleteOneFromFavorites } =
    Favorites();
  const productQuantity = getFavoritesQuantity(id);
  // console.log(items)

  const eventClick = (title, price) => {
    ReactGA.gtag('event', 'added to favotites', {
      event_category: 'favotites',
      event_label: title,
      value: price
    });
  };
  

  let location = useLocation();
  return (
    <div className={styles.container}>
      <Link className={styles.imageContainer} to={`/detail/${id}`}>
        <div className={styles.image}>
          <img src={img} alt={title} loading="lazy" />
        </div>
      </Link>

      <div className={styles.info}>
        <div className={styles.upPart}>
          <div className={styles.left}>
            <h1>{title}</h1>
          </div>
          <div className={styles.right}>
            <p>{name}</p>
            {/* <p>{storeLocation}</p> */}
          </div>
        </div>
        <div className={styles.down}>
          <div className={styles.price}>
            <p>₾ {price}</p>
          </div>
          <div className={styles.btn}>
            {location.pathname !== "/cart" ? (
              <div className={styles.addButton}>
                {productQuantity > 0 ? (
                  <div
                    onClick={() => deleteOneFromFavorites(id)}
                    className={styles.checkIcon}
                  >
                    <AiOutlineCheck size={"1.5rem"} />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      addOneToFavorites(id, title, img, price, name, size);
                      eventClick(title, price, img);
                    }}
                    className={styles.addIcon}
                  >
                    <AiOutlineHeart size={"1.5rem"} />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
