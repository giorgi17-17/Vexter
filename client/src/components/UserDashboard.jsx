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

  const navigate = useNavigate();
  const { logOut } = UserAuth();

  useEffect(() => {
    const collRef = collection(db, "users");

    const q = query(collRef, where("email", "==", `${user.email}`));

    const getProducts = onSnapshot(q, (snap) => {
      const items = [];
      snap.forEach((doc) => {
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
                        // console.log(e.img[0])
                        return (
                          <div key={i} className={styles.orders}>
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
                        );
                      })
                    : null}
                    <div className={styles.totalAmount}>გადახდილი თანხა:{item.amount}</div>
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
