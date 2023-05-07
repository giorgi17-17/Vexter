import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import styles from "../components/css/footer.module.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.flexWrap}>
          <div className={styles.column}>
            <div className={styles.social}>
              <Link className={styles.fb}>
                <FaFacebook size={"2rem"} />
              </Link>
              <Link className={styles.tw}>
                <FaLinkedin size={"2rem"} />
              </Link>
              <Link className={styles.ig}>
                <FaInstagram size={"2rem"} />
              </Link>
            </div>
          </div>
          <div className={styles.column}>
            <h2 className={styles.mainText}>Useful Links</h2>
            <ul>
              <Link>About Us</Link>
              <Link>Services</Link>
              <Link>Contact</Link>
            </ul>
          </div>
          <div className={styles.columnEmail}>
            <h2 className={styles.mainText}>გამოგვიწერე სიახლეებისთვის</h2>
            <form>
              <div className={styles.columnEmailElements}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
                <button type="submit" className={styles.mainText}>
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className={`text-center ${styles.textCenter}`}>
          <p className={styles.bottomText}>
            &copy; {new Date().getFullYear()} Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
