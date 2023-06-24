import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { AiOutlineClose } from "react-icons/ai";
import { db } from "../firebase/firebase";
import styles from "./css/productModal.module.css";
import { colors } from "./assets";

const ProductModal = ({ product, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editProductData, setEditProductData] = useState({ ...product });
  const [selectedColors, setSelectedColors] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (event) => {
    if (event.target.name === "size" || event.target.name === "color") {
      setEditProductData({
        ...editProductData,
        category: {
          ...editProductData.category,
          [event.target.name]: event.target.value.split(","),
        },
      });
    } else {
      setEditProductData({
        ...editProductData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleColorClick = (event, itemValue) => {
    if (selectedColors.includes(itemValue)) {
      setSelectedColors(
        selectedColors.filter((selectedItem) => selectedItem !== itemValue)
      );
    } else {
      setSelectedColors((prevSelectedItems) => [
        ...prevSelectedItems,
        itemValue,
      ]);
    }
  };

  const submitEdit = async (event) => {
    event.preventDefault();
    await setDoc(doc(db, "products", product.id), editProductData);
    setIsEditing(false);
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
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
            <p>რაოდენობა {product.quantity}</p>
            <p>ფასი {product.price}</p>
            <p>ზომები {product.category.size}</p>
            <p>ფერი {product.category.color}</p>
          </div>
          <div className={styles.btnContainer}>
            <button className={styles.closebtn} onClick={onClose}>
              <AiOutlineClose size={"1.5rem"} />
            </button>
            <button
              className={styles.editbtn}
              onClick={() => setIsEditing(true)}
            >
              შეცვლა
            </button>
          </div>
        </>
      ) : (
        <form className="form" onSubmit={submitEdit}>
          <label className="label">
            სახელი:
            <input
              type="text"
              name="title"
              value={editProductData.title}
              onChange={handleInputChange}
            />
          </label>

          <label className="label">
            რაოდენობა:
            <input
              type="text"
              name="quantity"
              value={editProductData.quantity}
              onChange={handleInputChange}
            />
          </label>

          <label className="label">
            ფასი:
            <input
              type="text"
              name="price"
              value={editProductData.price}
              onChange={handleInputChange}
            />
          </label>

          <label className="label">
            ზომა:
            <input
              type="text"
              name="size"
              value={editProductData.category.size.join(",")}
              onChange={handleInputChange}
            />
            <p style={{ color: "red" }}>
              ზომები შეიყვანეთ მძიმის დაშორებით. მაგ(41,42,43 ან s,l,m).
            </p>
          </label>

          <div className={styles.multiplecont}>
            <div className={styles.selectbtn} onClick={toggleExpansion}>
              <span className={styles.btnText}>ფერი</span>
            </div>
            {isExpanded && (
              <ul className={styles.listItems}>
                {colors.map((colorItem) => (
                  <li
                    className={styles.item}
                    onClick={(event) => handleColorClick(event, colorItem)}
                    value={colorItem}
                    key={colorItem}
                  >
                    <span
                      className={`${styles.itemText} ${
                        selectedColors.includes(colorItem)
                          ? styles.selected
                          : ""
                      }`}
                    >
                      {colorItem}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductModal;
