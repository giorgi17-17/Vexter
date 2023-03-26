// import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Baner from "../components/Baner";
import styles from "../components/css/home.module.css";
import "../components/css/head.css";
import { useEffect } from "react";

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





const Home = () => {


  const navigate = useNavigate();
  useEffect(() => {
    const gender = localStorage.getItem("gender");
    if (gender) {
      const splited = gender.split("").slice(1, -1);
      //'path' joins array items into string
      var path = splited.join("");
      navigate(`/${path}`);
    }
  }, [navigate]);



  return (
    <div className={styles.container}>
      <Baner />
      <div className={styles.choose}>
        <p>Where do you want to start</p>
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
      </div>
    </div>
  );
};

export default Home;
