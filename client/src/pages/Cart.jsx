import { ShoppingCart } from "../Context/CartContext";
// import Product from "../components/Product";
import styles from "../components/css/cart.module.css";
import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

const Cart = () => {
  const { items, deleteOneFromCart, totalAmount, cost, delivery } =
    ShoppingCart();
  const [link, setLink] = useState("");

  useEffect(() => {
  //  redirect("/login");
  //  window.location.href = link
    // navigate(link);
    if(link) {

      // window.open(link);
      window.location.href = link
    }
  },[link])

  const handleSendInfo = async () => {
    await fetch("https://vexter.onrender.com/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item: totalAmount }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log(data)
        setLink(data.transactionUrl);
      })
      .catch((error) => {
        console.log(error);
      });

  
  };

  //
  return (
    <div className={styles.container}>
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
              Go To Checkout
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
  );
};

export default Cart;
