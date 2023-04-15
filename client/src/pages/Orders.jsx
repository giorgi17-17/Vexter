import React from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { UserAuth } from "../Context/AuthContext";
import styles from "../components/css/userDashboard.module.css";

const Orders = () => {
  const [products, setProducts] = useState([]);
  const { user } = UserAuth();

  function time(mil) {
    let date = new Date(mil);
    return date.toLocaleString("en-GB");
  }

  useEffect(() => {
    const collRef = collection(db, "store");

    const q = query(collRef, where("email", "==", `${user.email}`));
    console.log(user.email);

    const getProducts = onSnapshot(q, (snap) => {
      const items = [];
      snap.forEach((doc) => {
        items.push(doc.data());
      });
      setProducts(items);
      //   console.log(items);
    });

    return () => {
      getProducts();
    };
  }, [user.email]);

  // console.log(products)

  // products.map(item => {
  //   console.log(item)
  //   item.map(e => {
  //     // console.log(e.title)
  //   })
  // })

  return (
    <div>
      {products.map((item, i) => {
        return (
          <div key={i} className={styles.allOrder}>
            {item.order
              ? item.order.map((e, i) => {
                  console.log(e);
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
            {/* <div className={styles.totalAmount}>
              გადახდილი თანხა:{item.amount}
            </div> */}
          </div>
        );
      })}
    </div>
  );
};

export default Orders;
