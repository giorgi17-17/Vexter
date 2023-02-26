import React from "react";
import { UserAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import styles from "../components/css/userDashboard.module.css";

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { logOut } = UserAuth();

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/");
      console.log("logged out");
    } catch (error) {
      console.log(error.message);
    }
  };
  // console.log(user.displayName)

  return (
    <div className={styles.container}>
      {user.displayName ? (
        <AdminDashboard />
      ) : (
        <div className={styles.container}>
          <div className={styles.user}>
            <p>Email: {user ? user.email : null}</p>
            <p>Orders</p>
            <p>Return an item</p>
          </div>
          <div >
            <button className={styles.btn} onClick={handleLogOut}>Sign out</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
