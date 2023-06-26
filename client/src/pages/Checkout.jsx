import { useState, useEffect } from "react";
import styles from "../components/css/checkout.module.css";
import { UserAuth } from "../Context/AuthContext";
import { ShoppingCart } from "../Context/CartContext";
import ClipLoader from "react-spinners/ClipLoader";

const Checkout = () => {
  const [name, setName] = useState("");
  const [surName, setSurName] = useState("");
  const [number, setNumber] = useState(0);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [homeStatus, setHometatus] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = UserAuth();

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const { items, totalAmount, cost, delivery } = ShoppingCart();

  useEffect(() => {
    if (link) {
      setLoading(false);
      setOpen(false);
      window.location.href = link;
    }
  }, [link, open]);

  // https://vexter.onrender.com/checkout
  // http://localhost:4000/checkout
  const handleSendInfo = async () => {
    setOpen(true);
    console.log(name);

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
        userInfo: {
          name,
          surName,
          number,
          city,
          postalCode,
          address,
          homeStatus,
        },
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLink(data.transactionUrl.transactionUrl);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.mainContainer}>
      {open && (
        <div className={styles.spinner}>
          <h1>გადადიხართ გადახდის გვერზე</h1>
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
      {!loading && (
        <div className={styles.container}>
          <div className={styles.allInformation}>
            <p>მისამართი</p>
            <div className={styles.information}>
              <div className={styles.info}>
                <label htmlFor="">სახელი</label>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
              <div className={styles.info}>
                <label htmlFor="">გვარი</label>
                <input
                  type="text"
                  onChange={(e) => setSurName(e.target.value)}
                  value={surName}
                />
              </div>
              <div className={styles.info}>
                <label htmlFor="">ნომერი</label>
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
                <label htmlFor="">საცხოვრებლის ტიპი</label>
                <select
                  name=""
                  id=""
                  onChange={(e) => setHometatus(e.target.value)}
                  value={homeStatus}
                >
                  <option value=""></option>
                  <option value="bina">ბინა</option>
                  <option value="saxli">სახლი</option>
                </select>
              </div>
            </div>
            {/*  */}
            <div>
              <button className={styles.btn} onClick={handleSendInfo}>
                გადახდა
              </button>
            </div>
            {/* <div>schedule</div> */}
          </div>

          <div className={styles.products}>
            {items.length > 0 ? (
              <div className={styles.cartCont}>
                <div className={styles.cartProducts}>
                  {items?.map((item, i) => {
                    // setStoreName(item.name)
                    return (
                      <div className={styles.cartProduct} key={i}>
                        <div className={styles.productContainer}>
                          <div className={styles.image}>
                            <img src={item.img} alt={item.title} />
                          </div>
                          <div className={styles.cartinfo}>
                            <p className={styles.title}>{item.title}</p>
                            <p>ზომა:{item.size}</p>
                            <div className={styles.rightSide}>
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
                </div>
              </div>
            ) : (
              <div>
                <h1>კალათა ცარიელია</h1>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
