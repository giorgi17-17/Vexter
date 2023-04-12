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
  const [adress, setAdress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [storeStatus, setStoretatus] = useState("");
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

    const unsubb = onSnapshot(q, (snap) => {
      let items = "";
      snap.forEach((doc) => {
        items = doc.data().id;
      });
      setStoreName(items);
    });

    return () => {
      unsubb();
    };
  }, [setStoreName, user]);

  async function update() {
    const updateDocId = doc(db, "store", storeName);

    await updateDoc(updateDocId, {
      adress,
      city,
      number,
      postalCode
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.information}>
        <div className={styles.info}>
          <label htmlFor="">number</label>
          <input
            type="number"
            onChange={(e) => setNumber(e.target.value)}
            value={number}
          />
        </div>
        <div className={styles.info}>
          <label htmlFor="">city</label>
          <input
            type="text"
            onChange={(e) => setCity(e.target.value)}
            value={city}
          />
        </div>
        <div className={styles.info}>
          <label htmlFor="">postal code</label>
          <input
            type="text"
            onChange={(e) => setPostalCode(e.target.value)}
            value={postalCode}
          />
        </div>
        <div className={styles.info}>
          <label htmlFor="">adress</label>
          <input
            type="text"
            onChange={(e) => setAdress(e.target.value)}
            value={adress}
          />
        </div>
        <div className={styles.info}>
          <label htmlFor="">საცხოვრებლის ტიპი</label>
          <select
            name=""
            id=""
            onChange={(e) => setStoretatus(e.target.value)}
            value={storeStatus}
          >
            <option value=""></option>
            <option value="bina">bina</option>
            <option value="saxli">saxli</option>
          </select>
        </div>
      </div>
      <button onClick={update}>add</button>
    </div>
  );
};

export default StoreInformation;
