import React from "react";
import Skeleton from "react-loading-skeleton";
import styles from "../components/css/productSkeleton.module.css";
import 'react-loading-skeleton/dist/skeleton.css'

export const ProductsSkeleton = ({cards}) => {
  return Array(cards).fill(0).map((item,i) => (
    <div key={i} className={styles.cont}>
          <Skeleton height={238} />
        <div className={styles.down}>
          <Skeleton count={3} style={{margin: "3px"}} />
        </div>
      </div>
  ))
};

export const ProductsDetailsSkeleton = ({cards}) => {
  return Array(cards).fill(0).map((item,i) => (
    <div key={i} className={styles.cont}>
          <Skeleton height={238} />
        <div className={styles.down}>
          <Skeleton count={3} style={{margin: "3px"}} />
        </div>
      </div>
  ))
};

export const BanerImage = ({cards}) => {
  return Array(cards).fill(0).map((item,i) => (
    <div key={i} className={styles.imageCont}>
          <Skeleton />
      </div>
  ))
};




// export default ProductsSkeleton;
