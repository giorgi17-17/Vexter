import { useEffect, useState } from "react";
import styles from "./css/adminDashboard.module.css";
import { UserAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import AddProduct from "./AddProduct";
import { db } from "../firebase/firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { ShoppingCart } from "../Context/CartContext";
import { AiFillSetting } from "react-icons/ai";
import ProductModal from "./ProductModal";


const AdminDashboard = () => {
  const [store, setStore] = useState([]);
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const { user, logOut } = UserAuth();
  const { setStoreLocation, getStoreLocation } = ShoppingCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  useEffect(() => {
    let storeName;
    if (user) {
      storeName = user.displayName;
    } else {
      storeName = "";
    }
    const collRef = collection(db, "products");
    const q = query(collRef, where("name", "==", `${storeName}`));

    const unsub = onSnapshot(q, (snap) => {
      const items = [];
      snap.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setStore(items);
    });
    return () => {
      unsub();
    };
  }, [user]);

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
        items = doc.data().storeLocation;
      });
      setStoreLocation(items);
    });

    return () => {
      unsubb();
    };
  }, [setStoreLocation, user]);

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/");
      console.log("logged out");
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteProduct = async () => {
    setShow(false);
    await deleteDoc(doc(db, "products", deleteId));
  };

  const deleteFunc = (id) => {
    setDeleteId(id);
    setShow(true);
  };

 

  return (
    <div className={styles.mainContainer}>
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      {show && (
        <div className={styles.popUp}>
          <div className={styles.popUpHeading}>
            <h1>გინდათ პროდუქტის წაშლა?</h1>
          </div>
          <div className={styles.popUpBtns}>
            <button className={styles.noBtn} onClick={() => setShow(false)}>
              არა
            </button>
            <button className={styles.YesBtn} onClick={() => deleteProduct()}>
              კი
            </button>
          </div>
        </div>
      )}
      {/* <div className={styles.popUp}></div> */}
      {user ? (
        <div className={styles.main}>
          <div className={styles.sideBar}>
            <div className={styles.user}>
              <p>{user ? user.displayName : null}</p>
              <p>{getStoreLocation || "ლოკაცია"}</p>
            </div>
            <div className={styles.additionalInfo}>
              <Link className={styles.link} to="/storeInfo">
                დამატებითი ინფორმაცია
              </Link>
              <Link className={styles.link} to="/orders">
                შეკვეთები
              </Link>
            </div>
            <div className={styles.btn}>
              <button onClick={handleLogOut}>Sign out</button>
            </div>
          </div>
          <div className={styles.settingsIcon}>
            <AiFillSetting
              size={"1.5rem"}
              onClick={() => setShowSettings(!showSettings)}
            />
          </div>
          {showSettings && (
            <div className={styles.settingsPopUp}>
              <div>
                <div className={styles.user}>
                  <p>{user ? user.displayName : null}</p>
                  <p>{getStoreLocation || "ლოკაცია"}</p>
                </div>
                <div className={styles.additionalInfo}>
                  <Link className={styles.link} to="/storeInfo">
                    დამატებითი ინფორმაცია
                  </Link>
                  <Link className={styles.link} to="/orders">
                    შეკვეთები
                  </Link>
                </div>
              </div>
              <div className={styles.btn}>
                <button onClick={handleLogOut}>Sign out</button>
              </div>
            </div>
          )}
          <div className={styles.top}>
            <AddProduct />
            <div className={styles.products}>
              {store.map((item, i) => {
                return (
                  <div key={i} className={styles.prodContainer}>
                    <div
                      className={styles.image}
                      onClick={() => setSelectedProduct(item)}
                    >
                      <img src={item.image} alt="" />
                    </div>
                    <div className={styles.info}>
                      <div className={styles.upPart}>
                        <div className={styles.left}>
                          <h1>{item.title}</h1>
                        </div>
                        <div className={styles.right}>
                          <p>{item.name}</p>
                          <p>{item.location}</p>
                        </div>
                      </div>
                      <div className={styles.price}>
                        <p>$ {item.price}</p>
                      </div>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteFunc(item.id)}
                    >
                      წაშლა
                    </button>
                    {/* <button onClick={() => updateProduct(item.id)}>Update</button> */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>ანგარიშზე შესასვლელად გაირეთ ავტორიზაცია</h1>
          <Link to="/login">ავტორიზაცია</Link>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
