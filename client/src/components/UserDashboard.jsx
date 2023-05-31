import React from "react";
import { UserAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import styles from "./css/userDashboard.module.css";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";

const UserDashboard = ({ user }) => {
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  const { logOut } = UserAuth();

  function time(mil) {
    let date = new Date(mil);
    return date.toLocaleString("en-GB");
  }

  useEffect(() => {
    const collRef = collection(db, "users");
    const q = query(collRef, where("email", "==", `${user.email}`));

    const getProducts = onSnapshot(q, (snap) => {
      const items = [];
      snap.forEach((doc) => {
        items.push(doc.data());
      });
      setProducts(items);
    });

    return () => {
      getProducts();
    };
  }, [user.email]);

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/");
      console.log("logged out");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={styles.container}>
      {user.displayName ? (
        <AdminDashboard />
      ) : (
        <div className={styles.container}>
          <div className={styles.user}>
            <p>Email: {user ? user.email : null}</p>
            <button className={styles.btn} onClick={handleLogOut}>
              გასვლა
            </button>
          </div>
          {/* <div>
            <button className={styles.btn} onClick={handleLogOut}>
              გასვლა
            </button>
          </div> */}

          {products.map((item) => {
            return (
              <div key={item.email} className={styles.allOrder}>
                {item.order
                  ? item.order.map((e, i) => {
                      return (
                        <div key={i} className={styles.orders}>
                          {e.orders
                            ? e.orders.map((e) => {
                                return (
                                  <div
                                    className={styles.productCont}
                                    key={e.id}
                                  >
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
                                  </div>
                                );
                              })
                            : null}
                          <div className={styles.price}>
                            <p>შეკვეთის დრო: </p>
                            <p>{time(e.purchaseTime)}</p>
                          </div>
                          <div className={styles.totalAmount}>
                            გადახდილი თანხა:{e.amount}
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
