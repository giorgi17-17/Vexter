import styles from "../components/css/main.module.css";
import Baner from "../components/Baner";
import MainSections from "../components/MainSections";
// import StoreSection from "../components/StoreSection";
// import ReactGA from "react-ga"

const Main = () => {
  return (
    <div className={styles.container}>
      <div className={styles.baner}>
        <Baner />
      </div>
      <div className={styles.productsList}>
        {/* <MainSections type="bags" /> */}
        {/* <StoreSection store="vertex" /> */}
        <MainSections type="shoe" />
        <MainSections type="clothe" />
      </div>
    </div>
  );
};

export default Main;
