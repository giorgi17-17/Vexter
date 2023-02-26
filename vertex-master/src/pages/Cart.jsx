import { ShoppingCart } from "../Context/CartContext";
// import Product from "../components/Product";
// import { useEffect } from "react";
import styles from "../components/css/cart.module.css";
import { Link } from "react-router-dom";
// import axios from "axios";

const Cart = () => {
  const { items, deleteOneFromCart, totalAmount, cost, delivery } =
    ShoppingCart();

  // const options = {
  //   method: "POST",
  //   headers: { accept: "application/json", "content-type": "application/json" },
  //   mode:"no-cors",
  //   body: JSON.stringify({
  //     method: "justPay",
  //     apiKey: "",
  //     apiSecret: "",
  //     data: {
  //       amount: 10,
  //       currency: "USD",
  //       callback: "https://corp.com/success_callback",
  //       callbackError: "https://corp.com/fail_url",
  //       preauthorize: false,
  //       lang: "EN",
  //       hookUrl: "https://corp.com/payze_hook?authorization_token=token",
  //       hookRefund: false,
  //     },
  //   }),
  // };

  // const checkout = async () => {
  //   await fetch('https://payze.io/api/v1', options)
  //   .then(response => response.json())
  //   .then(response => console.log(response))
  //   .catch(err => console.error(err));

  // try {
  //   const response = await axios.post("https://payze.io/api/v1", options);
  //   console.log(response.data);
  // } catch (error) {
  //   console.error(error);
  // }

  //   axios
  // .post('https://payze.io/api/v1', options)
  // .then(response => {
  // 	console.log(response.data);
  // })
  // .catch(function (error) {
  // 	console.error(error);
  // });
  // };

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
                        <button className={styles.del} onClick={() => deleteOneFromCart(item.id)}>
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
            <Link to="/checkout">
              <button className={styles.btn}>Go To Checkout</button>
            </Link>
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
