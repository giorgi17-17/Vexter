import React from "react";
import { useState } from "react";
import styles from "../components/css/checkout.module.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import uniqid from "uniqid";
import { UserAuth } from "../Context/AuthContext";
import { ShoppingCart } from "../Context/CartContext";

const Checkout = () => {
  const [name, setName] = useState("");
  const [surName, setSurName] = useState("");
  const [number, setNumber] = useState(0);
  const [city, setCity] = useState("");
  const [adress, setAdress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [homeStatus, setHometatus] = useState("");

  const { user } = UserAuth();

  const { getStoreLocation } = ShoppingCart();

  const addNewOrder = async () => {
    const collRef = collection(db, "orders");

    await addDoc(collRef, {
      name,
      surName,
      adress,
      city,
      postalCode,
      homeStatus,
      number: Number(number),
      storeName: user.displayName,
      id: uniqid(),
      quantity: Number(1),
      createdAt: serverTimestamp(),
      storeLocation: getStoreLocation,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.allInformation}>
        <p>delivery information</p>
        <div className={styles.information}>
          <div className={styles.info}>
            <label htmlFor="">Name</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className={styles.info}>
            <label htmlFor="">Surname</label>
            <input
              type="text"
              onChange={(e) => setSurName(e.target.value)}
              value={surName}
            />
          </div>
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
              onChange={(e) => setHometatus(e.target.value)}
              value={homeStatus}
            >
              <option value=""></option>
              <option value="bina">bina</option>
              <option value="saxli">saxli</option>
            </select>
          </div>
        </div>
        {/*  */}
        <div>
          <button className={styles.btn} onClick={addNewOrder}>
            Add Order
          </button>
        </div>
        <div>schedule</div>
        <div>paymant</div>
      </div>

      <div className={styles.products}>ordered products</div>
    </div>
  );
};

export default Checkout;
