import React, { useState } from "react";
// import { useRef } from "react";
import "../App.css";
import styles from "./css/imageCarousel.module.css";

const ImageCarousel = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);
  // const refs = useRef([]);
  // refs.current = [];

  function hoverHandler(image, i) {
    setMainImage(image);
    // refs.current[i].classList.add(styles.active);
    // for (let j = 0; j < image.length; j++) {
    //   if (i !== j) {
    //     refs.current[j].classList.remove(styles.active);
    //   }
    // }
  }

  // function addRefs(el) {
  //   if (el && !refs.current.includes(el)) {
  //     refs.current.push(el);
  //   }
  // }

  return (
    <div className={styles.carousel}>
      <div className={styles.sideImages}>
        {images.map((img, i) => {
          return (
            <div
              // ref={addRefs}
              onMouseOver={() => hoverHandler(img, i)}
              key={img}
              className={
                i === 0
                  ? [styles.sideImage, styles.active].join(" ")
                  : styles.sideImage
              }
            >
              <img src={img} alt="" />
            </div>
          );
        })}
      </div>
      <div className={styles.mainImage}>
        <img src={mainImage} alt="cant load" />
      </div>
    </div>
  );
};

export default ImageCarousel;
