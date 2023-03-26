import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "../components/css/login.module.css";
import { UserAuth } from "../Context/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
// import { ShoppingCart } from "../Context/CartContext";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
const AdminSignUp = () => {
  const { createUser, user } = UserAuth();
  // const { storeLocation, setStoreLocation } = ShoppingCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const collRef = collection(db, "store");
  const [addStoreLocation, setAddStoreLocation] = useState("");

  useEffect(() => {
    console.log(addStoreLocation);
  }, [addStoreLocation]);
  var productId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // console.log(user)
      await createUser(email, password);
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      console.log(addStoreLocation);
      const newItem = await addDoc(collRef, {
        name,
        storeLocation: addStoreLocation,
        email,
        createdAt: serverTimestamp(),
      });
      productId = newItem.id;

      const updateDocId = doc(db, "store", productId);
      await updateDoc(updateDocId, {
        id: productId,
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  return (
    <div className={style.container}>
      {user ? (
        <div>
          <h1>მომხმარებელი დარეგისტრირებულია</h1>
          <Link to="/account">დეშბორდი</Link>
        </div>
      ) : (
        <div className={style.container}>
          <p className="p">{error}</p>
          <h1>Register Your Store</h1>

          <form onSubmit={handleSubmit}>
            <div className={style.name}>
              <label>Name</label>
              <input onChange={(e) => setName(e.target.value)} type="text" />
            </div>
            <div className={style.location}>
              <label>location</label>
              <select
                onChange={(e) => {
                  console.log(e.target.value);
                  setAddStoreLocation(e.target.value);
                }}
                name="location"
                id="location"
                value={addStoreLocation}
              >
                <option value=""></option>
                <option value="Tbilisi">თბილისი</option>
              </select>
            </div>
            <div className={style.email}>
              <label>Email</label>
              <input onChange={(e) => setEmail(e.target.value)} type="text" />
            </div>
            <div className={style.password}>
              <label>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </div>
            <button className={style.btn}>Sign up</button>
          </form>
          <p>
            Have an account?{" "}
            <Link to="/login" className={style.signUp}>
              Log in
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminSignUp;
