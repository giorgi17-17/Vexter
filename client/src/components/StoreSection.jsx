import { collection, onSnapshot, query, where } from "firebase/firestore";
// import { ShoppingCart } from "../Context/CartContext";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import Product from "./Product";
import { Link } from "react-router-dom";
import { ProductsSkeleton } from "./ProductsSkeleton";
import styles from "./css/mainSections.module.css";

const StoreSection = ({ store }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: undefined });

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

    const q = query(collRef, where("name", "==", `${store}`));

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
  }, [store]);

  return (
    <div>
      <div className={styles.sectionName}>
      <p>
          {store}
        </p>
        <Link className={styles.seeMore} to={`/storepage/${store}`}>
          მეტის ნახვა
        </Link>
      </div>
      <div className={styles.products}>
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
              <div key={item.id} className={styles.prod}>
                <Product
                  title={item.title}
                  name={item.name}
                  img={item.image}
                  price={item.price}
                  id={item.id}
                  storeLocation={item.location}
                  size={item.category.size}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default StoreSection;
