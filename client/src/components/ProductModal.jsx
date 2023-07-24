import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { AiOutlineClose } from "react-icons/ai";
import { db } from "../firebase/firebase";
import styles from "./css/productModal.module.css";
import { colors } from "./assets";
import uniqid from "uniqid";

const ProductModal = ({ product, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editProductData, setEditProductData] = useState({ ...product });

  // Add a new state variable to store the id of the selected variant to edit
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const handleInputChange = (event) => {
    if (event.target.name === "size" || event.target.name === "color") {
      // Copy the existing variants array from the editProductData
      const updatedVariants = [...editProductData.variants];
      // Update the selected variant with the new data
      updatedVariants[selectedVariantId][event.target.name] =
        event.target.value;
      // Update the editProductData with the modified variants array
      setEditProductData({
        ...editProductData,
        variants: updatedVariants,
      });
    } else {
      setEditProductData({
        ...editProductData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const getSelectedDisplayColor = (variantColor) => {
    const matchingColor = colors.find(
      (colorObj) => colorObj.color === variantColor
    );
    return matchingColor ? matchingColor.displayColor : "";
  };

  const submitEdit = async (event) => {
    event.preventDefault();
    await setDoc(doc(db, "products", product.id), editProductData);
    setIsEditing(false);
  };

  return (
    <div className={styles.modal}>
      {!isEditing ? (
        <>
          <div className={styles.left}>
            <img src={product.image} alt={product.title} />
          </div>
          <div className={styles.right}>
            <h2>{product.title}</h2>
            <p>{product.name}</p>
            <p>ფასი {product.price}</p>
            {/* Display the selected color */}
            {/* <p>
              {getSelectedDisplayColor(
                editProductData.variants[selectedVariantId]?.color
              )}
            </p> */}
            <div className={styles.chooseVarint}>
              <p className={styles.chooseVarintText}>
                აირჩიეთ ვარინატი რომლის შეცვლაც გსურთ
              </p>
              <div className={styles.varintBoxes}>
                {/* Render variant boxes */}
                {editProductData.variants.map((variant, index) => {
                  // Generate a unique id for the variant if it doesn't have one
                  const variantId = variant.id || uniqid();
                  const variantColor = variant.color;
                  return (
                    <div key={variantId} className={styles.variantBox}>
                      <div>ზომა: {variant.size}</div>
                      {/* Display the selected color */}
                      <div>ფერი: {getSelectedDisplayColor(variantColor)}</div>
                      <div>რაოდენობა: {variant.quantity}</div>
                      <button
                        className={styles.updaeBtn}
                        onClick={() => {
                          // Set the selected variant id when the "Update" button is clicked
                          setSelectedVariantId(index);
                          // Also set the form data to the selected variant for editing
                          setEditProductData({
                            ...editProductData,
                            ...variant,
                          });
                          setIsEditing(true);
                        }}
                      >
                        შეცვლა
                      </button>
                      <div className={styles.btnContainer}>
                        <button className={styles.closebtn} onClick={onClose}>
                          <AiOutlineClose size={"1.5rem"} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <form className={styles.form} onSubmit={submitEdit}>
          <label className={styles.label}>
            სახელი:
            <input
              className={styles.input}
              type="text"
              name="title"
              value={editProductData.title}
              onChange={handleInputChange}
            />
          </label>

          <label className={styles.label}>
            რაოდენობა:
            <input
              className={styles.input}
              type="text"
              name="quantity"
              value={editProductData.quantity}
              onChange={handleInputChange}
            />
          </label>

          <label className={styles.label}>
            ფასი:
            <input
              className={styles.input}
              type="text"
              name="price"
              value={editProductData.price}
              onChange={handleInputChange}
            />
          </label>

          <label className={styles.label}>
            ზომა:
            <input
              className={styles.input}
              type="text"
              name="size"
              value={editProductData.variants[selectedVariantId]?.size || ""}
              onChange={handleInputChange}
            />
          </label>
          <label className={styles.colorlabel}>
            ფერი
            <select
              className={styles.select}
              onChange={(e) => {
                const selectedColor = e.target.value;
                // Update the selected variant's color with the new color value
                const updatedVariants = [...editProductData.variants];
                updatedVariants[selectedVariantId].color = selectedColor;
                setEditProductData({
                  ...editProductData,
                  variants: updatedVariants,
                });
              }}
              value={editProductData.variants[selectedVariantId]?.color || ""}
            >
              <option value="">აირჩიე ფერი</option>
              {colors.map((color, i) => (
                <option value={color.color} key={i}>
                  {color.displayColor}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.label}>
            რაოდენობა:
            <input
              className={styles.input}
              type="text"
              name="quantity"
              value={editProductData.quantity}
              onChange={handleInputChange}
            />
          </label>
          <div className={styles.formBtns}>
            <button type="submit" className={styles.save}>
              შენახვა
            </button>
            <button
              type="button"
              className={styles.cancel}
              onClick={() => setIsEditing(false)}
            >
              გაუქმება
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductModal;
