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
import {
  colors,
  shoeSize,
  clotheSize,
  apparelTypesArray,
  brands,
} from "./assets";
import BrandSelector from "./BrandSelector";

const AddProduct = () => {
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  // const [quantity, setQuantity] = useState("");
  const [subType, setSubType] = useState("");
  const [imageUpload, setImageUpload] = useState("");
  // const [selectedBrand, setSelectedBrand] = useState("");

  // const [selectedSizes, setSelectedSizes] = useState([]);
  // const [isExpanded, setIsExpanded] = useState(false);
  // const [isColorExpanded, setIsColorExpanded] = useState(false);
  // const [selectedColors, setSelectedColors] = useState([]);
  const [variants, setVariants] = useState([
    { size: "", color: "", quantity: 0,  id: uniqid(), },
  ]);
  // const [clickedItem, setClickedItem] = useState(null);
  const imageInputRef = useRef();

  const { user } = UserAuth();
  const { getStoreLocation } = ShoppingCart();
  const genderFromLocalStorage = localStorage.getItem("gender");
  if (genderFromLocalStorage) {
    //'splited' make gender to array and removes first and last charaqter
    const splited = genderFromLocalStorage.split("").slice(1, -1);
    //'path' joins array items into string
    var path = splited.join("");
  }
  const apparelTypes = apparelTypesArray(path);

  // const toggleExpansion = () => {
  //   setIsExpanded(!isExpanded);
  // };

  const handleBrandSelect = (brand) => {
    setBrand(brand);
  };

  const addVariant = () => {
    setVariants((oldVariants) => [
      ...oldVariants,
      { size: "", color: "", quantity: 0,id: uniqid(), },
    ]);
  };

  const removeVariant = (indexToRemove) => {
    setVariants((oldVariants) =>
      oldVariants.filter((_, index) => index !== indexToRemove)
    );
  };

  const updateVariantSize = (index, newSize) => {
    setVariants((oldVariants) => {
      const newVariants = [...oldVariants];
      newVariants[index].size = newSize;
      return newVariants;
    });
  };

  const updateVariantColor = (index, newColor) => {
    setVariants((oldVariants) => {
      const newVariants = [...oldVariants];
      newVariants[index].color = newColor;
      return newVariants;
    });
  };

  const updateVariantQuantity = (index, newQuantity) => {
    setVariants((oldVariants) => {
      const newVariants = [...oldVariants];
      newVariants[index].quantity = newQuantity;
      return newVariants;
    });
  };

  // console.log(variants);

  // const handleItemClick = (event, itemValue) => {
  //   if (selectedSizes.includes(itemValue)) {
  //     setSelectedSizes(
  //       selectedSizes.filter((selectedItem) => selectedItem !== itemValue)
  //     );
  //   } else {
  //     setSelectedSizes((prevSelectedItems) => [
  //       ...prevSelectedItems,
  //       itemValue,
  //     ]);
  //   }
  // };
  // const handleColorClick = (event, colorValue) => {
  //   if (selectedColors.includes(colorValue)) {
  //     setSelectedColors(
  //       selectedColors.filter((selectedColor) => selectedColor !== colorValue)
  //     );
  //   } else {
  //     setSelectedColors((prevSelectedColors) => [
  //       ...prevSelectedColors,
  //       colorValue,
  //     ]);
  //   }
  // };

  // const toggleColorExpansion = () => {
  //   setIsColorExpanded(!isColorExpanded);
  // };

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
      // quantity: Number(quantity),
      category: {
        type,
        // color: selectedColors,
        brand,
        gender,
        // size: selectedSizes,
        subType,
        sizes: variants.map((variant) => variant.size),
        colors: variants.map((variant) => variant.color),
        quantities: variants.map((variant) => variant.quantity),
      },
      createdAt: serverTimestamp(),
      location: getStoreLocation,
      variants,
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
      // setSelectedColors([]);
      setGender("");
      setTitle("");
      setPrice("");
      // setQuantity("");
      setSubType("");
      // setSelectedSizes([]);

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
          {/* ----------- */}

          {type ? (
            <select
              onChange={(e) => {
                setSubType(e.target.value);
              }}
            >
              <option value="">ქვე კატეგორია</option>
              {apparelTypes.map((subtype) =>
                subtype.path === `${path}/${type}` &&
                subtype.subMenu &&
                subtype.subMenu.length > 0
                  ? subtype.subMenu.map((subMenuOption) => {
                      return (
                        <option
                          key={subMenuOption.path}
                          value={subMenuOption.path}
                        >
                          {subMenuOption.title}
                        </option>
                      );
                    })
                  : null
              )}
            </select>
          ) : (
            <select>
              <option value="">ქვე კატეგორია</option>
            </select>
          )}
          <BrandSelector brands={brands}  onSelect={handleBrandSelect} />

      

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
          
          <div className={styles.variants}>
            {variants.map((variant, index) => (
              <div className={styles.variantsCont} key={index}>
                <div className={styles.size}>
                  <label>ზომა</label>

                  <select
                    onChange={(e) => updateVariantSize(index, e.target.value)}
                    value={variant.size}
                  >
                    <option value=""></option>

                    {type === "shoe" ? (
                      <>
                        {shoeSize.map((sizeItem, i) => (
                          <option key={i}> {sizeItem}</option>
                        ))}
                      </>
                    ) : (
                      <>
                        {clotheSize.map((sizeItem, i) => (
                          <option key={i}> {sizeItem}</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
                <div className={styles.color}>
                  <label>ფერი</label>

                  <select
                    onChange={(e) => updateVariantColor(index, e.target.value)}
                    value={variant.color}
                  >
                    <option value=""></option>
                    {colors.map((color, i) => (
                      <option value={color.color} key={i}>
                        {color.displayColor}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.quantity}>
                  <label>რაოდენობა</label>
                  <input
                    type="number"
                    placeholder="რაოდენობა"
                    onChange={(e) =>
                      updateVariantQuantity(index, Number(e.target.value))
                    }
                    value={variant.quantity || ""}
                  />
                </div>

                <button
                  className={styles.removebtn}
                  onClick={() => removeVariant(index)}
                >
                  წაშლა
                </button>
              </div>
            ))}
            <button className={styles.addVariantbtn} onClick={addVariant}>
              ახალი ვარიანტი
            </button>
          </div>
        </div>
        <div className={styles.btn}>
          <button onClick={addProduct}>პროდუქტის დამატება</button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
