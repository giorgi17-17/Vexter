import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import style from "../components/css/login.module.css";
import { UserAuth } from "../Context/AuthContext";
import { db } from "../firebase/firebase";

const Signup = () => {
  const { createUser } = UserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  const navigate = useNavigate();
  const collRef = collection(db, "users");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError("");
    try {
      await createUser(email, password);
      navigate("/");

      await addDoc(collRef, {
        email,
        createdAt: serverTimestamp(),
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

  return (
    <div className={style.container}>
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
      <form onSubmit={handleSubmit}>
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
        <button className={style.btn}>რეგისტრაცია</button>
      </form>
      <p>უკვე გაქვთ ანგარიში?</p>
      <Link to="/login" className={style.signUp}>
        ანგარიშზე შესვლა
      </Link>
    </div>
  );
};

export default Signup;
