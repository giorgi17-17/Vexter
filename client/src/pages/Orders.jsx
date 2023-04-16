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
                  // console.log(e);
                  return (
                    <div key={i} className={styles.orders}>
                      {e.orders
                        ? e.orders.map((item) => {
                            // console.log(e);
                            return (
                              <div className={styles.productCont} key={item.id}>
                                <div className={styles.product}>
                                  <div className={styles.left}>
                                    <div className={styles.image}>
                                      <img src={item.img[0]} alt={e.title} />
                                    </div>
                                    <div className={styles.title}>
                                      <p>{item.title}</p>
                                    </div>
                                  </div>
                                  <div className={styles.price}>
                                    <p>₾ {item.price}</p>
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
  );
};

export default Orders;
