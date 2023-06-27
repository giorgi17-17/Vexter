import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styles from "../components/css/storeInformation.module.css";
import { UserAuth } from "../Context/AuthContext";
import { db } from "../firebase/firebase";

const StoreInformation = () => {
  const [number, setNumber] = useState(0);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [storeStatus, setStoreStatus] = useState("");
  const [storeName, setStoreName] = useState("");

  const { user } = UserAuth();

  useEffect(() => {
    let storeName;
    if (user) {
      storeName = user.displayName;
    } else {
      storeName = "";
    }

    const storeRef = collection(db, "store");
    const q = query(storeRef, where("name", "==", `${storeName}`));

    const unsub = onSnapshot(q, (snap) => {
      let items = "";
      snap.forEach((doc) => {
        items = doc.data().id;
      });
      setStoreName(items);
    });

    return () => {
      unsub();
    };
  }, [setStoreName, user]);

  async function update() {
    const updateDocId = doc(db, "store", storeName);

    await updateDoc(updateDocId, {
      address,
      city,
      number,
      postalCode,
      storeStatus
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.information}>
        <div className={styles.info}>
          <label htmlFor="">ტელეფონის ნომერი</label>
          <input
            type="number"
            onChange={(e) => setNumber(e.target.value)}
            value={number}
          />
        </div>
        <div className={styles.info}>
          <label htmlFor="">ქალაქი</label>
          <input
            type="text"
            onChange={(e) => setCity(e.target.value)}
            value={city}
          />
        </div>
        <div className={styles.info}>
          <label htmlFor="">საფოსტო კოდი</label>
          <input
            type="text"
            onChange={(e) => setPostalCode(e.target.value)}
            value={postalCode}
          />
        </div>
        <div className={styles.info}>
          <label htmlFor="">მისამართი</label>
          <input
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          />
        </div>
        <div className={styles.info}>
          <label htmlFor="">მაღაზიის სტატუსი</label>
          <select
            name=""
            id=""
            onChange={(e) => setStoreStatus(e.target.value)}
            value={storeStatus}
          >
            <option value=""></option>
            <option value="bina">კომერციული ფართი</option>
            <option value="bina">ბინა</option>
            <option value="saxli">სახლი</option>
          </select>
        </div>
      </div>
      <button className={styles.addBtn} onClick={update}>დამატება</button>
    </div>
  );
};

export default StoreInformation;
