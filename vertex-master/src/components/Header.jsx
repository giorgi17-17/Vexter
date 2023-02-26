import { CgProfile } from "react-icons/cg";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMenuAltRight } from "react-icons/bi";
// import { IoIosArrowDown } from "react-icons/io";
import { BsBag } from "react-icons/bs";
import { VscClose } from "react-icons/vsc";

// import logo from "../assets/vertex---logo.png";
import styles from "./css/header.module.css";
import { Link, NavLink } from "react-router-dom";
import "./css/head.css";
import "../App.css";
import { ShoppingCart } from "../Context/CartContext";
import { useState } from "react";
import { Favorites } from "../Context/FavoritesContext";
// import ReactGA from "react-ga"

const nav_link = [
  {
    path: "man",
    display: "Man",
  },
  {
    path: "woman",
    display: "Woman",
  },
  {
    path: "kids",
    display: "Kids",
  },
];

const Header = () => {
  const { firstPath, items } = ShoppingCart();
  const { favoriteItems } = Favorites();

  const [open, setOpen] = useState(false);

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
  const gender = localStorage.getItem("gender");
  // console.log(gender)
  if (gender) {
    //'splited' make gender to array and removes first and last charaqter
    const splited = gender.split("").slice(1, -1);
    //'path' joins array items into string
    var path = splited.join("");
  }

  // useEffect(() => {
  //   ReactGA.pageview(window.location.pathname + window.location.search)
  //   console.log('first')
  // },[firstPath])

  let apparelTypes = [
    {
      path: `${path}/clothe`,
      display: "Clothing",
      subMenu: [
        {
          title: "T-shirt",
          path: "t-shirt",
        },
        {
          title: "Shirt",
          path: "shirt",
        },
        {
          title: "Jeans",
          path: "jeans",
        },
        {
          title: "Shorts",
          path: "shorts",
        },
        {
          title: "Sweater",
          path: "sweater",
        },
        {
          title: "Hoodies",
          path: "hoodies",
        },
        {
          title: "Jackets",
          path: "jackets",
        },
        {
          title: "Trousers",
          path: "trousers",
        },
        {
          title: "Shorts",
          path: "shorts",
        },
      ],
    },
    {
      path: `${path}/shoe`,
      display: "Shoes",
      subMenu: [
        {
          title: "Sneakers",
          path: "sneakers",
        },
        {
          title: "Boots",
          path: "boots",
        },
        {
          title: "Loafers",
          path: "loafers",
        },
      ],
    },
    {
      path: `${path}/sport`,
      display: "Sports",
    },
    {
      path: `${path}/streetwear`,
      display: "Streetwear",
    },
    {
      path: `${path}/accessories`,
      display: "Accessories",
    },
    {
      path: `${path}/sale`,
      display: "Sale %",
    },
  ];

  // this reduce function shows number of items in cart
  const productsCount = items.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
  const favoritesCount = favoriteItems.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  return (
    <div className={styles.container}>
      {open && (
        <div className={styles.sideBar}>
          <div className={styles.topBar}>
            <h5>Browse by category</h5>
            <div className={styles.closeIcon}>
              {open ? closeIcon : hamburgerIcon}
            </div>
          </div>
          <div className={styles.gendreButtons}>
            {nav_link.map((item, i) => (
              <button key={i} className={styles.nav_item} >
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
            {apparelTypes.map((item, i) => {
              return (
                <div key={i} className={styles.nav_items}>
                  <div className={styles.linkk} >
                    <Link className={styles.link} to={item.path}>
                      {item.display}
                    </Link>
                    {/* <span>
                      <IoIosArrowDown />
                    </span> */}
                  </div>
                  <div>
                    {/* {item.subMenu
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
                    : null} */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* ------------------------------------------ */}
      <div className={styles.upHeader}>
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
          {/* <img src={logo} alt="Vertex" /> */}
          <div>
            <Link className="link" to={`/${path}`}>
              <h1 className={styles.mainName}>Vertex</h1>
            </Link>
          </div>
        </div>
        <div className={styles.additional}>
          <span>
            <Link className="link" to="/account">
              <CgProfile size={"1.5rem"} className={styles.icon} />
            </Link>
          </span>
          <span className={styles.fav_icon}>
            {/* favorites */}
            <Link className="link" to="/favorites">
              <AiOutlineHeart size={"1.5rem"} className={styles.icon} />
              <span className={styles.badge}>{favoritesCount}</span>
            </Link>
          </span>
          <span className={styles.fav_icon}>
            {/* cart */}
            <Link className="link" to="/cart">
              <BsBag size={"1.5rem"} className={styles.icon} />
              <span className={styles.badge}>{productsCount}</span>
            </Link>
          </span>
          <div className={styles.hamburger}>
            <span>{open ? closeIcon : hamburgerIcon}</span>
          </div>
        </div>
      </div>
      <div className={styles.downHeader}>
        <div className={styles.categories}>
          {apparelTypes.map((item, i) => {
            return (
              <div key={i} className={styles.nav_items}>
                <div className={styles.link}>
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

        <div className={styles.search}>
          <input
            className={styles.searchBar}
            type="text"
            placeholder="Search"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
