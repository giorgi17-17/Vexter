import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import styles from "../components/css/footer.module.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.linkContainer}>
          <Link>About Us</Link>
          <Link>Services</Link>
          <Link>Contact</Link>
        </div>
        <div className={styles.social}>
          <Link><FaFacebook size={"2rem"} /></Link>
          <Link><FaLinkedin size={"2rem"} /></Link>
          <Link><FaInstagram size={"2rem"} /></Link>
        </div>
        <form className={styles.form}>
          <input type="email" id="email" name="email" placeholder="Enter your email address" required />
          <button type="submit">Subscribe</button>
        </form>
        <div className={styles.bottomText}>
          <p>&copy; {new Date().getFullYear()} Vexter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
