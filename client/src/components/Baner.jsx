// import baner from "../assets/baner.png";
import { useState } from "react";
import vexter from "../assets/vexterBanner.webp";
import Skeleton from "react-loading-skeleton";

const Baner = () => {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };
  return (
    <div>
      {loading && <Skeleton height={300} />}
      <img style={{ width: "100%" }} src={vexter} alt="აღმოაჩინე ახალი მაღაზიები, იშოპინგე ონლაინ" onLoad={handleImageLoad}/>
    </div>
  );
};

export default Baner;
