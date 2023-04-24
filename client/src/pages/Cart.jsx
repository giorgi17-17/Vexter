import { ShoppingCart } from "../Context/CartContext";
// import Product from "../components/Product";
import styles from "../components/css/cart.module.css";
import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
// import io from "socket.io-client"
import { UserAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

//change this with render url
// const socket = io.connect("https://vertex-ecommerce.web.app")
// socket.on("connect_error", (err) => {
//   console.log(err.message); // prints the message associated with the error
// });

// if (!localStorage.getItem("transactionId")) {
//   localStorage.setItem("transactionId", JSON.stringify([]));
// }
// const tra = JSON.parse(localStorage.getItem("transactionId") || "");

const Cart = () => {
  const { items, deleteOneFromCart, totalAmount, cost, delivery } =
    ShoppingCart();
  const [link, setLink] = useState("");
  const [acountNumber, setAccountNumber] = useState("");
  // const [data, setData] = useState("");
  // const [test, setTest] = useState("");
  // const [transactionID, setTransactionId] = useState(tra);
  const [cartItemsToChange, setCartItemsToChange] = useState([]);
  const [checkUser, setCheckUser] = useState(true);
  let [loading, setLoading] = useState(false);
  let [open, setOpen] = useState(false);
  // console.log(transactionID)
  // console.log(cartItemsToChange)
  const { user } = UserAuth();
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  localStorage.setItem("purchasedItems", JSON.stringify(cartItemsToChange));
  // localStorage.setItem("transactionId", JSON.stringify(transactionID));

  // socket.on("recieveData", (data) => {
  //   // console.log(data.info)
  //   setData(data.info)
  //   setTest(data.test)
  //   // alert(data.info)
  // })



  useEffect(() => {
    const collRef = collection(db, "store");

    const q = query(
      collRef,
      where("email", "==", `${user.email}`),
      // where("category.type", "==", `${type}`)
    );

    const getProducts = onSnapshot(q, (snap) => {
      const items = [];
      // console.log('adad')
      let accountNum = ""
      snap.forEach((doc) => {
        items.push(doc.data());
        accountNum = doc.data().bankNumber
        console.log(doc.data())
      });
      // console.log(items)
      setAccountNumber(accountNum);

      // setLoading(false);
      //   console.log(items);
    });
    // console.log('first')
    return () => {
      getProducts();
    };
  }, [user.email]);
  
// console.log(acountNumber)


  useEffect(() => {
    if (link) {
      setLoading(false);
      setOpen(false);
      // window.open(link);
      window.location.href = link;
    }
  }, [link, open]);
  // https://vexter.onrender.com/checkout
  // http://localhost:4000/checkout
  const handleSendInfo = async () => {
    if (user) {
      setCheckUser(true);
      setOpen(true);
      setLoading(true);
      await fetch("https://vexter.onrender.com/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          cartItems: items,
          email: user.email,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setLink(data.transactionUrl.transactionUrl);
          // setTransactionId(data.transactionUrl.transactionId);
          setCartItemsToChange(data.cartItems);
          // setCartItemsToChange()
          // console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setCheckUser(false);
      return (
        <div>
          <p>Please register before making a purchase</p>
          {/* Other content to display when user is not registered */}
        </div>
      );
    }
  };

  //
  return (
    <div className={styles.container}>
      {checkUser ? (
        <div>
          {open && (
            <div className={styles.spinner}>
              <ClipLoader
                color="#ffffff"
                loading={loading}
                cssOverride={override}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          )}
          {items.length > 0 ? (
            <div className={styles.cartCont}>
              <div className={styles.cartProducts}>
                {items?.map((item, i) => {
                  return (
                    <div className={styles.cartProduct} key={i}>
                      <div className={styles.productContainer}>
                        <div className={styles.image}>
                          <img src={item.img} alt={item.title} />
                        </div>
                        <div className={styles.info}>
                          <p className={styles.title}>{item.title}</p>
                          <p>ზომა:{item.size}</p>
                          <div className={styles.rightSide}>
                            <button
                              className={styles.del}
                              onClick={() => deleteOneFromCart(item.id)}
                            >
                              წაშლა
                            </button>
                            <p>₾ {item.price}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.totalPrice}>
                <h2>Total</h2>
                <div className={styles.prices}>
                  <div className={styles.subtotal}>
                    <p>პროდუქტი</p>
                    <p>{cost}</p>
                  </div>
                  <div className={styles.delivery}>
                    <p>მიტანა</p>
                    <p>{delivery}</p>
                  </div>
                  <div className={styles.total}>
                    <p>ჯამი</p>
                    <p>{totalAmount}</p>
                  </div>
                </div>
                {/* <Link to="/checkout"> */}
                <button onClick={handleSendInfo} className={styles.btn}>
                  ყიდვა
                </button>
                {/* </Link> */}
              </div>
            </div>
          ) : (
            <div>
              <h1>კალათა ცარიელია</h1>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.falseUserContainer}>
          <div className={styles.box}>
            <div className={styles.text}>
              <h2>ყიდვამდე გაიარეთ რეგისტრაცია</h2>
            </div>
            <div className={styles.buttons}>
              <Link to={"/login"}>
                <button className={styles.signInButton}>შესვლა</button>
              </Link>
              <Link to={"/signup"}>
                <button className={styles.registerButton}>რეგისტრაცია</button>
              </Link>
              {/* <button className={styles.registerButton}>რეგისტრაცია</button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
