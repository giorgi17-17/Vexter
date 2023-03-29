import { useState } from "react";
import { UserAuth } from "../Context/AuthContext";
import styles from "./css/account.module.css";
import { db } from "../firebase/firebase";
import uniqid from "uniqid";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ShoppingCart } from "../Context/CartContext";
import { storage } from "../firebase/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useRef } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [gender, setGender] = useState("");
  const [title, setTitle] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [subType, setSubType] = useState("");
  const [imageUpload, setImageUpload] = useState("");
  // const [progress, setProgress] = useState(0);

  const imageInputRef = useRef();

  const { user } = UserAuth();
  const { getStoreLocation } = ShoppingCart();

  var productId;
  const addProduct = async () => {
    const collRef = collection(db, "products");
    const imageUrl = [];

    const newItem = await addDoc(collRef, {
      title,
      image: imageUrl,
      price: Number(price),
      name: user.displayName,
      id: uniqid(),
      quantity: Number(quantity),
      category: { type, color, brand, gender, size, subType },
      createdAt: serverTimestamp(),
      location: getStoreLocation,
    });
    productId = newItem.id;

    const updateDocId = doc(db, "products", productId);
    await updateDoc(updateDocId, {
      id: productId,
    });

    try {
      setTitle("");
      setPrice("");
      setType("");
      setBrand("");
      setColor("");
      setGender("");
      setTitle("");
      setSize("");
      setPrice("");
      setQuantity("");
      setSubType("");

      if (imageUpload.length > 0) {
        for (let i = 0; i < imageUpload.length; i++) {
          const name = imageUpload[i].name + Date.now();
          const storageRef = ref(storage, `img/${name}`);
          const uploadTask = uploadBytesResumable(storageRef, imageUpload[i]);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 1000
                ) / 10;
              // setProgress(progress);
              console.log(`Upload #${i + 1} is ${progress}% done`);
            },
            (error) => {
              console.log("error", error);
              toast.error("Something went wrong");
            },
            () => {
              // console.log(`Upload #${i + 1} is complete, fetching URL...`);
              getDownloadURL(uploadTask.snapshot.ref)
                .then(async (url) => {
                  // console.log(`Upload #${i + 1} is now available at ${url}.`);
                  imageUrl.push(url);

                  await updateDoc(updateDocId, {
                    image: imageUrl,
                  });
                })

                .catch((error) => {
                  console.log(error);
                });
            }
          );
        }
        toast.success("პროდუქტი დამატებულია");
      } else {
        toast.error("ფოტო არ არის შერჩეული");
      }

      //try
    } catch (error) {
      console.log("catch", error.message);
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        limit={10}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        // pauseOnFocusLoss
        draggable
        // pauseOnHover
        theme="dark"
        transition={Slide}
      />
      <div className={styles.inputs}>
        <label>დასახელება</label>
        <input
          type="text"
          placeholder="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
        />
        <label>სურათის ატვირთვა</label>
        <input
          onChange={(event) => {
            setImageUpload(event.target.files);
          }}
          type="file"
          accept="image/png, image/jpeg, image/webp "
          ref={imageInputRef}
          multiple
        />

        <label>ფასი</label>
        <input
          type="number"
          placeholder="price"
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          value={price}
        />
        <label>რაოდენობა</label>
        <input
          type="number"
          placeholder="quantity"
          onChange={(e) => {
            setQuantity(e.target.value);
          }}
          value={quantity}
        />
        <label>კატეგორიები</label>
        <div className={styles.categoriesContainer}>
          <select
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <option value="type">კატეგორია</option>
            <option value="clothe">ტანსაცმელი</option>
            <option value="shoe">ფეხსაცმელი</option>
            <option value="bags">ჩანთა</option>
            <option value="accessories">აქსესუარები</option>
          </select>
          {type === "shoe" ? (
            <select
              onChange={(e) => {
                setSubType(e.target.value);
              }}
            >
              <option value="subType">ქვე კატეგორია</option>
              <option value="sneakers">Sneakers</option>
              <option value="boots">Boots</option>
              <option value="loafers">Loafers</option>
            </select>
          ) : type === "clothe" ? (
            <select
              onChange={(e) => {
                setSubType(e.target.value);
              }}
            >
              <option value="subType">ქვე კატეგორია</option>
              <option value="shirt">Shirt</option>
              <option value="sweater">Sweater</option>
              <option value="jeans">Jeans</option>
            </select>
          ) : type === "bags" ? (
            <select
              onChange={(e) => {
                setSubType(e.target.value);
              }}
            >
              <option value="subType">ქვე კატეგორია</option>
              <option value="handMade">ხელნაკეთი</option>
              <option value="Zara">Zara</option>
              <option value="Nike">Nike</option>
            </select>
          ) : (
            <select
              onChange={(e) => {
                setSubType(e.target.value);
              }}
            >
              <option value="subType">ქვე კატეგორია</option>
            </select>
          )}
          <select
            onChange={(e) => {
              setBrand(e.target.value);
            }}
          >
            <option value="brand">ბრენდი</option>
            <option value="nike">Nike</option>
            <option value="addidas">Adiddas</option>
            <option value="puma">Puma</option>
            <option value="hand-made">ხელნაკეთი</option>
            <option value="New Balance">New Balance</option>
          </select>
          <select
            onChange={(e) => {
              setColor(e.target.value);
            }}
          >
            <option value="color">ფერი</option>
            <option value="white">თეთრი</option>
            <option value="red">წითელი</option>
            <option value="blue">ლურჯი</option>
            <option value="black">შავი</option>
            <option value="yellow">ყვითელი</option>
            <option value="orange">ნარინჯისფერი</option>
            <option value="green">მწვანე</option>
          </select>
          <select
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            <option value="gender">სქესი</option>
            <option value="man">კაცი</option>
            <option value="woman">ქალი</option>
            <option value="kids">ბავშვი</option>
          </select>

          

          {type !== "shoe" ? (
            <select
              onChange={(e) => {
                setSize(e.target.value);
              }}
            >
              <option value="size">Size</option>
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
            </select>
          ) : (
            <select
              onChange={(e) => {
                setSize(e.target.value);
              }}
            >
              <option value="size">Size</option>
              <option value="40">40</option>
              <option value="41">41</option>
              <option value="42">42</option>
            </select>
          )}
        </div>
        <div className={styles.btn}>
          <button onClick={addProduct}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
