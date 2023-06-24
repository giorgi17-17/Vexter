import { CgProfile } from "react-icons/cg";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMenuAltRight } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { BsBag } from "react-icons/bs";
import { VscClose } from "react-icons/vsc";
import styles from "./css/header.module.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./css/head.css";
import "../App.css";
import { ShoppingCart } from "../Context/CartContext";
import { useEffect, useState } from "react";
import { Favorites } from "../Context/FavoritesContext";
import { UserAuth } from "../Context/AuthContext";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { nav_link, apparelTypesArray } from "./assets";

const gender = localStorage.getItem("gender");
// console.log(gender)
if (gender) {
  //'splited' make gender to array and removes first and last character
  const splited = gender.split("").slice(1, -1);
  //'path' joins array items into string
  var path = splited.join("");
}

const Header = () => {

  const { firstPath, items } = ShoppingCart();
  const { favoriteItems } = Favorites();
  const { user } = UserAuth();

  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const { pathname } = useLocation();
  const apparelTypes = apparelTypesArray(path);

  useEffect(() => {
    setOpen(() => false); // close menu if path changes!
    setActiveCategory(null); // reset active category
  }, [pathname]);

  const hamburgerIcon = (
    <BiMenuAltRight
      className={styles.icon}
      size={"1.5rem"}
      onClick={() => setOpen(!open)}
    />
  );
  const closeIcon = (
    <VscClose
      className={styles.icon}
      size={"1.5rem"}
      onClick={() => setOpen(!open)}
    />
  );

  //this if statment sets gender value to localStorage
  if (firstPath === "man" || firstPath === "woman" || firstPath === "kids") {
    localStorage.setItem("gender", JSON.stringify(firstPath));
  }

  // 'gender' gets gender value from localstorage

  // this reduce function shows number of items in cart
  const productsCount = items.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
  const favoritesCount = favoriteItems.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  const handleCategoryClick = (index) => {
    if (activeCategory === index) {
      setActiveCategory(null);
    } else {
      setActiveCategory(index);
    }
  };

  return (
    <HelmetProvider>
      <header className={styles.container}>
        <Helmet>
          <title>Vexter - იშოპინგე ონლაინ</title>
        </Helmet>
        <div className={styles.demo}>საიტი არის ტესტირების რეჟიმში</div>
        {open && (
          <nav className={styles.sideBar}>
            <div className={styles.topBar}>
              <div className={styles.closeIcon}>
                {open ? closeIcon : hamburgerIcon}
              </div>
            </div>
            <div className={styles.gendreButtons}>
              {nav_link.map((item, i) => (
                <button key={i} className={styles.nav_item}>
                  <NavLink
                    to={item.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? `${styles.nav_active}`
                        : `${styles.nav_item}`
                    }
                  >
                    {item.display}
                  </NavLink>
                </button>
              ))}
            </div>
            {/* ---------------------- */}
            <div className={styles.mobile_categories}>
              {apparelTypes.map((item, i) => (
                <div key={i} className={styles.nav_items}>
                  <div className={styles.mobileCat}>
                    <Link className={styles.link} to={item.path}>
                      {item.display}
                    </Link>
                    <span
                      className={styles.arrowDown}
                      onClick={() => handleCategoryClick(i)}
                    >
                      <IoIosArrowDown size={"1.5rem"} />
                    </span>
                  </div>
                  <div className={styles.mobileItemsCont}>
                    {activeCategory === i &&
                      item.subMenu &&
                      item.subMenu.map((e, j) => (
                        <div className={styles.items} key={j}>
                          <Link
                            className={styles.linkItems}
                            to={`${item.path}/${e.path}`}
                          >
                            <p>{e.title}</p>
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        )}
        <nav className={styles.upHeader}>
          <div className={styles.buttons}>
            {nav_link.map((item, i) => (
              <button key={i} className={styles.nav_item}>
                <NavLink
                  to={item.path}
                  className={(navClass) =>
                    navClass.isActive
                      ? `${styles.nav_active}`
                      : `${styles.nav_item}`
                  }
                >
                  {item.display}
                </NavLink>
              </button>
            ))}
          </div>
          <div className={styles.logo}>
            <Link className="link" to={`/${path}`}>
              <h1 className={styles.mainName}>Vexter</h1>
            </Link>
          </div>
          <div className={styles.additional}>
            <span>
              {user ? (
                <div>
                  <Link className="link" to="/account">
                    <CgProfile size={"1.5rem"} className={styles.icon} />
                  </Link>
                </div>
              ) : (
                <div>
                  <Link className="login" to="/login">
                    <button className={styles.loginBtn}>შესვლა</button>
                  </Link>
                </div>
              )}
            </span>
            <span className={styles.fav_icon}>
              <Link className="link" to="/favorites">
                <AiOutlineHeart size={"1.5rem"} className={styles.icon} />
                <span className={styles.badge}>{favoritesCount}</span>
              </Link>
            </span>
            <span className={styles.fav_icon}>
              <Link className="link" to="/cart">
                <BsBag size={"1.5rem"} className={styles.icon} />
                <span className={styles.badge}>{productsCount}</span>
              </Link>
            </span>
            <div className={styles.hamburger}>
              <span>{open ? closeIcon : hamburgerIcon}</span>
            </div>
          </div>
        </nav>
        <main className={styles.downHeader}>
          <div className={styles.categories}>
            {apparelTypes.map((item, i) => {
              return (
                <div key={i} className={styles.appaerlItems}>
                  <div className={styles.apparelCategories}>
                    <Link className={styles.link} to={item.path}>
                      {item.display}
                    </Link>
                  </div>
                  <div className={styles.itemsCont}>
                    {item.subMenu
                      ? item.subMenu.map((e, i) => {
                          // console.log(e.title)
                          return (
                            <div className={styles.items} key={i}>
                              <Link
                                className={styles.linkItems}
                                to={`${item.path}/${e.path}`}
                              >
                                <p>{e.title}</p>
                              </Link>
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </header>
    </HelmetProvider>
  );
};

export default Header;
