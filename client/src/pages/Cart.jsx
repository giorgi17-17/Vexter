import { ShoppingCart } from "../Context/CartContext";
// import Product from "../components/Product";
import styles from "../components/css/cart.module.css";
import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
// import io from "socket.io-client"
import { UserAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer,Slide } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Cart = () => {
  const { items, deleteOneFromCart, totalAmount, cost, delivery } =
    ShoppingCart();

  const [link, setLink] = useState("");
  const [checkUser, setCheckUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [signinPopUp, setSigninPopUp] = useState(false);
  const [signupPopUp, setSignupPopUp] = useState(false);
  const [box, setBox] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const collRef = collection(db, "users");

  const { user, signIn, createUser } = UserAuth();
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

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
      await fetch("http://localhost:4000/checkout", {
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
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setCheckUser(false);
      setBox(true);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    // setError("");
    try {
      await signIn(email, password);
      navigate("/");
      toast.success("წარმატებით დარეგისტრირდით", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: "slide",
      });
    } catch (error) {
      if (error.message === "Firebase: Error (auth/wrong-password).") {
        toast.error("იმეილი ან პაროლი არასწორია", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (error.message === "Firebase: Error (auth/user-not-found).") {
        toast.error("მომხმარებელი ვერ მოიძებნა", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      // setError(error.message);
      console.log(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    // setError("");
    try {
      await createUser(email, password);
      navigate("/");

      await addDoc(collRef, {
        email,
        createdAt: serverTimestamp(),
        order: null,
        amount: 0,
      });

      toast.success("წარმატებით დარეგისტრირდით");
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        toast.error("იმეილი უკვე გამოყენებულია", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (
        error.message ===
        "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        toast.error("პაროლი უნდა შედგებოდეს მინიმუმ 6 ასოსგან", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      // setError(error.message);

      // console.log(error.message);
    }
  };

  //
  return (
    <div className={styles.container}>
      {checkUser && (
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
      )}

      {/* -------------- */}
      {!checkUser && (
        <div className={styles.falseUserContainer}>
          {box && (
            <div className={styles.box}>
              <div className={styles.text}>
                <h2>ყიდვამდე გაიარეთ რეგისტრაცია</h2>
              </div>
              <div className={styles.buttons}>
                {/* <Link to={"/login"}>
                <button className={styles.signInButton}>შესვლა</button>
              </Link> */}
                <button
                  className={styles.signInButton}
                  onClick={() => {
                    setSigninPopUp(true);
                    setBox(false);
                  }}
                >
                  შესვლა
                </button>

                <button
                  className={styles.registerButton}
                  onClick={() => {
                    setSignupPopUp(true);
                    setBox(false);
                  }}
                >
                  რეგისტრაცია
                </button>
                {/* <button className={styles.registerButton}>რეგისტრაცია</button> */}
              </div>
            </div>
          )}

          {signinPopUp && (
            <div className={styles.signinPopUpcontainer}>
              <ToastContainer />
              <h1>ავტორიზაცია</h1>
              <form>
                <div className={styles.email}>
                  <label>Email</label>
                  <input
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.password}>
                  <label>Password</label>
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button onClick={handleSignIn} className={styles.btn}>
                  შესვლა
                </button>
              </form>
              <p>არ გაქვთ ანგარიში?</p>
              <Link to="/signup" className={styles.logIn}>
                რეგისტრაცია
              </Link>
            </div>
          )}
          {signupPopUp && (
              <div className={styles.signUpPopUpcontainer}>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                limit={10}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                // pauseOnFocusLoss
                draggable
                // pauseOnHover
                theme="dark"
                transition={Slide}
              />
              <h1>ახალი მომხმარებლის რეგისტრაცია</h1>
              <form onSubmit={handleSignUp}>
                <div className={styles.email}>
                  <label>Email</label>
                  <input onChange={(e) => setEmail(e.target.value)} type="text" />
                </div>
                <div className={styles.password}>
                  <label>Password</label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                </div>
                <button className={styles.btn}>რეგისტრაცია</button>
              </form>
              <p>უკვე გაქვთ ანგარიში?</p>
              <Link to="/login" className={styles.signUp}>
                ანგარიშზე შესვლა
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
