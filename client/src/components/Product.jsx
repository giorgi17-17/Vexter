import styles from "./css/product.module.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { Favorites } from "../Context/FavoritesContext";
import ReactGA from "react-ga4";

const Product = ({ title, name, img, price, id }) => {
  const { getFavoritesQuantity, addOneToFavorites, deleteOneFromFavorites } =
    Favorites();
  const productQuantity = getFavoritesQuantity(id);

  let location = useLocation();


  const eventClick = (title, price) => {
    ReactGA.gtag("event", {
      action: "added_to_favorites",
      event_category: "favotites",
      label: title,
      value: price,
    });
  };

  return (
    <div className={styles.container}>
      <Link className={styles.imageContainer} to={`/detail/${id}`}>
        <img className={styles.image} src={img} alt={title} loading="lazy" />
      </Link>

      <div className={styles.info}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.name}>{name}</p>

        <div className={styles.bottom}>
          <p className={styles.price}>₾ {price}</p>
          {location.pathname !== "/cart" && (
            <button
              onClick={
                productQuantity > 0
                  ? () => deleteOneFromFavorites(id)
                  : () => {
                      addOneToFavorites(id, title, img, price);
                      eventClick(title, price);
                    }
              }
              className={
                productQuantity > 0
                  ? styles.favoriteButtonActive
                  : styles.favoriteButton
              }
            >
              {productQuantity > 0 ? (
                <AiFillHeart size={"1.5rem"} />
              ) : (
                <AiOutlineHeart size={"1.5rem"} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
