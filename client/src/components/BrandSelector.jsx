import React, { useState, useEffect, useRef } from "react";
import styles from "../components/css/brandSelector.module.css";

const BrandSelector = ({ brands, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBrands, setFilteredBrands] = useState(brands);
  const [selectedBrand, setSelectedBrand] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = brands.filter((brand) =>
      brand.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBrands(filtered);
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setIsOpen(false);
    onSelect(brand); // Invoke the onSelect callback with the selected brand value
  };

  return (
    <div ref={wrapperRef} className={styles.brandSelectorWrapper}>
      <div className={styles.brandSelectorHeader} onClick={handleToggle}>
        {selectedBrand || "ბრენდი"}
      </div>
      {isOpen && (
        <div className={styles.brandSelectorDropdown}>
          <input
            type="text"
            placeholder="მოძებნე ბრენდები"
            value={searchTerm}
            onChange={handleSearch}
            className={styles.brandSelectorInput}
          />
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand, index) => (
              <div
                key={index}
                onClick={() => handleBrandClick(brand)}
                className={styles.brandSelectorOption}
              >
                {brand}
              </div>
            ))
          ) : (
            <div className={styles.brandSelectorOption}>
              მსგავსი ბრენდი არ მოიძებნა
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandSelector;
