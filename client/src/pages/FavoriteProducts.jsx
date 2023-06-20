// import { AiOutlineCheck } from "react-icons/ai";
// import { BsFillBagPlusFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import styles from "../components/css/favoriteProducts.module.css";
// import { ShoppingCart } from "../Context/CartContext";
import { Favorites } from "../Context/FavoritesContext";

const FavoriteProducts = () => {
  const { removeOneFromFavorites, favoriteItems } = Favorites();
  // const {  getPoductQuantity } = ShoppingCart();
  let favoriteStorage = JSON.parse(localStorage.getItem("favorites"));

  return (
    <div className={styles.container}>
      {favoriteStorage.length > 0 ? (
        <div>
          {favoriteItems.map((item, i) => {
            // const productQuantity = getPoductQuantity(item.id);
            return (
              <div className={styles.productContainer} key={i}>
                <Link
                  className={styles.imageContainer}
                  to={`/detail/${item.id}`}
                >
                  <div className={styles.image}>
                    <img src={item.img} alt={item.title} />
                  </div>
                </Link>

                <div className={styles.info}>
                  <div className={styles.upPart}>
                    <div className={styles.left}>
                      <h1>{item.title}</h1>
                    </div>
                    <div className={styles.right}>
                      <p>{item.name}</p>
                      <p>{item.location}</p>
                    </div>
                  </div>
                  <div className={styles.down}>
                    <div className={styles.price}>
                      <p>$ {item.price}</p>
                    </div>
                    {/* <div className={styles.btn}>
                      {productQuantity > 0 ? (
                        <div
                          onClick={() => deleteOneFromCart(item.id)}
                          className={styles.checkIcon}
                        >
                          <AiOutlineCheck size={"1.5rem"} />
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            addOneToCart(
                              item.id,
                              item.title,
                              item.img,
                              item.price,
                              item.name,
                              item.size
                            );
                          }}
                          className={styles.addIcon}
                        >
                          <BsFillBagPlusFill size={"1.5rem"} />
                        </div>
                      )}
                    </div> */}
                  </div>
                </div>
                <button
                  className={styles.del}
                  onClick={() => removeOneFromFavorites(item.id)}
                >
                  წაშლა
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div>ფავორიტები ცარიელია</div>
      )}
    </div>
  );
};

export default FavoriteProducts;
