import React from "react";
import { UserAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import styles from "./css/userDashboard.module.css";
import { collection, onSnapshot, query, where } from "firebase/firestore";
// import { ShoppingCart } from "../Context/CartContext";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
// import Product from "./Product";
// import { Link } from "react-router-dom";
const UserDashboard = ({ user }) => {
  const [products, setProducts] = useState([]);
  // const [time, setTime] = useState("");

  const navigate = useNavigate();
  const { logOut } = UserAuth();

  function time(mil) {
    //  return new Date(mil)
    let date = new Date(mil);
    //  console.log(date.toLocaleDateString('en-US'))
    //  date.toLocaleString('en-GB')
    //  console.log(date.toLocaleString('en-GB'))
    return date.toLocaleString("en-GB");
    //  1680871156
  }

  // time(1681576300033)

  useEffect(() => {
    const collRef = collection(db, "users");

    const q = query(collRef, where("email", "==", `${user.email}`));

    const getProducts = onSnapshot(q, (snap) => {
      const items = [];
      snap.forEach((doc) => {
        // console.log(doc.data());
        items.push(doc.data());
      });
      setProducts(items);
      // console.log(items);
    });

    return () => {
      getProducts();
    };
  }, [user.email]);

  // let orders = products.map((item) => {
  // return console.log(item)
  // })

  // console.log(orders)

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/");
      console.log("logged out");
    } catch (error) {
      console.log(error.message);
    }
  };
  // console.log(user.displayName)

  return (
    <div className={styles.container}>
      {user.displayName ? (
        <AdminDashboard />
      ) : (
        <div className={styles.container}>
          <div className={styles.user}>
            <p>Email: {user ? user.email : null}</p>
            {/* <p>Orders</p>
            <p>Return an item</p> */}
          </div>

          <div className={styles.ordersContainer}>
            {products.map((item) => {
              // console.log(item.amount)
              return (
                <div key={item.email} className={styles.allOrder}>
                  {item.order
                    ? item.order.map((e, i) => {
                        // console.log(e.createdAt)
                        // setTime(e.createdAt)
                        return (
                          <div key={i} className={styles.orders}>
                            <div className={styles.product}>
                              <div className={styles.left}>
                                <div className={styles.image}>
                                  <img src={e.img[0]} alt={e.title} />
                                </div>
                                <div className={styles.title}>
                                  <p>{e.title}</p>
                                </div>
                              </div>
                              <div className={styles.price}>
                                <p>₾ {e.price}</p>
                              </div>
                            </div>
                            <div className={styles.price}>
                              <p>შეკვეთის დრო: </p>
                              <p>{time(e.createdAt)}</p>
                            </div>
                          </div>
                        );
                      })
                    : null}
                  <div className={styles.totalAmount}>
                    გადახდილი თანხა:{item.amount}
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <button className={styles.btn} onClick={handleLogOut}>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
