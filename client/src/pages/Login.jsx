import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import style from "../components/css/login.module.css";
import { UserAuth } from "../Context/AuthContext";

const Login = () => {
  const { signIn } = UserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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

  return (
    <div className={style.container}>
      <ToastContainer />
      <h1>ავტორიზაცია</h1>
      <form>
        <div className={style.email}>
          <label>Email</label>
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className={style.password}>
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleSubmit} className={style.btn}>
          შესვლა
        </button>
      </form>
      <p>არ გაქვთ ანგარიში?</p>
      <Link to="/signup" className={style.logIn}>
        რეგისტრაცია
      </Link>
    </div>
  );
};

export default Login;
