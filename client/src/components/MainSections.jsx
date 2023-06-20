import React from "react";
import styles from "./css/mainSections.module.css";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { ShoppingCart } from "../Context/CartContext";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import Product from "./Product";
import { Link } from "react-router-dom";
import { ProductsSkeleton } from "./ProductsSkeleton";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";

const MainSections = ({ type }) => {
  const [products, setProducts] = useState([]);
  const { firstPath } = ShoppingCart();
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: undefined });

  const localgender = localStorage.getItem("gender");

  if (localgender) {
    const splited = localgender.split("").slice(1, -1);
    var path = splited.join("");
  }

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

    const q = query(
      collRef,
      where("category.gender", "==", `${path}`),
      where("category.type", "==", `${type}`)
    );

    const getProducts = onSnapshot(q, (snap) => {
      const items = [];
      snap.forEach((doc) => {
        items.push(doc.data());
      });
      setProducts(items);
      setLoading(false);
    });

    return () => {
      getProducts();
    };
  }, [localgender, path, type]);

  var gender;
  if (firstPath === "man") {
    gender = "კაცის";
  } else if (firstPath === "woman") {
    gender = "ქალის";
  } else if (firstPath === "kids") {
    gender = "ბავშვის";
  }

  var apparelType;
  if (type === "shoe") {
    apparelType = "ფეხსაცმელი";
  } else if (type === "clothe") {
    apparelType = "ტანსაცმელი";
  } else if (type === "sport") {
    apparelType = "სპორტული ჩასაცმელი";
  } else if (type === "bags") {
    apparelType = "ჩანთები";
  }

  const getSlidesPerView = () => {
    if (windowSize.width >= 1280) {
      return 5;
    } else if (windowSize.width >= 960) {
      return 3;
    } else if (windowSize.width >= 600) {
      return 3;
    } else {
      return 2;
    }
  };

  return (
    <section className={styles.container}>
      <header className={styles.sectionName}>
        <p>
          {gender} {apparelType}
        </p>
        <Link className={styles.seeMore} to={`/${path}/${type}`}>
          მეტის ნახვა
        </Link>
      </header>
      <main className={styles.products}>
        {loading && windowSize.width < 600 ? (
          <ProductsSkeleton cards={2} />
        ) : null}
        {loading && windowSize.width > 600 ? (
          <ProductsSkeleton cards={7} />
        ) : null}

        {!loading && (
          <div className={styles.splideContainer}>
            <Splide
              options={{
                // type: "loop",
                gap: "1rem",
                autoplay: false,
                pagination: true,
                arrows: true,
                perPage: getSlidesPerView(),
                breakpoints: {
                  600: {
                    perPage: 2,
                  },
                  1024: {
                    perPage: 3,
                  },
                  1280: {
                    perPage: 5,
                  },
                },
                classes: {
                  arrow: `splide__arrow ${styles.yourClassArrow}`,
                  prev: `splide__arrow--prev ${styles.yourClassPrev}`,
                  next: `splide__arrow--next ${styles.yourClassNext}`,
                },
              }}
            >
              {products
                .slice(0, 20)
                .filter((item) => item.quantity !== 0)
                .map((item) => (
                  <SplideSlide key={item.id}>
                    <div className={styles.prod}>
                      <Product
                        title={item.category.brand}
                        name={item.name}
                        img={item.image}
                        price={item.price}
                        id={item.id}
                        storeLocation={item.location}
                        size={item.category.size}
                        alt={`${item.name} image`}
                      />
                    </div>
                  </SplideSlide>
                ))}
            </Splide>
          </div>
        )}
      </main>
    </section>
  );
};

export default MainSections;
