// export const colors = ["Red", "Blue", "Green", "Yellow", "Black", "White"];
export const shoeSize = ["39", "40", "41", "42", "43", "44"];
export const clotheSize = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL"];

export const brands = [
  "Nike",
  "Adidas",
  "New Balance",
  "Fila",
  "Puma",
  "Reebok",
  "Vans",
  "Converse",
  "Under Armour",
  "Skechers",
  "ASICS",
  "Jordan",
  "Timberland",
  "DC Shoes",
  "Lacoste",
  "Tommy Hilfiger",
  "Calvin Klein",
  "Levi's",
  "H&M",
  "Zara",
  "Forever 21",
  "Topshop",
  "Mango",
  "Guess",
  "Diesel",
  "Wrangler",
  "Lee",
  "Quiksilver",
  "Roxy",
  "Hurley",
  "Billabong",
  "Volcom",
  "Ralph Lauren",
  "Tommy Bahama",
  "Hollister",
  "Abercrombie & Fitch",
  "American Eagle",
  "Banana Republic",
  "Old Navy",
  "Gap",
  "Express",
  "Victoria's Secret",
  "Hanes",
  "Champion",
  "Fruit of the Loom",
  "Gildan",
  "Hugo Boss",
];


export const colors = [
  {
    color: "Red",
    displayColor: "წითელი",
  },
  {
    color: "Blue",
    displayColor: "ლურჯი",
  },
  {
    color: "Green",
    displayColor: "მწვანე",
  },
  {
    color: "Yellow",
    displayColor: "ყვითელი",
  },
  {
    color: "Black",
    displayColor: "შავი",
  },
  {
    color: "White",
    displayColor: "თეთრი",
  },
];

export const nav_link = [
  {
    path: "man",
    display: "კაცი",
  },
  {
    path: "woman",
    display: "ქალი",
  },
  {
    path: "kids",
    display: "ბავშვი",
  },
];

export const apparelTypesArray = (path) => [
  {
    path: `${path}/clothe`,
    display: "ტანსაცმელი",
    subMenu: [
      {
        title: "მაისური",
        path: "t-shirt",
      },
      {
        title: "პერანგი",
        path: "shirt",
      },
      {
        title: "ჯინსი",
        path: "jeans",
      },
      {
        title: "შორტები",
        path: "shorts",
      },
      {
        title: "სვიტრი",
        path: "sweater",
      },
      {
        title: "ჰუდი",
        path: "hoodies",
      },
      {
        title: "ჟაკეტი",
        path: "jackets",
      },
      {
        title: "შარვალი",
        path: "trousers",
      },
      {
        title: "ქურტუკი",
        path: "coat",
      },
      {
        title: "ჯემპრი",
        path: "sweatshirts",
      },
    ],
  },
  {
    path: `${path}/shoe`,
    display: "ფეხსაცმელი",
    subMenu: [
      {
        title: "სპორტული/კედი",
        path: "sneakers",
      },
      {
        title: "ბათინკი",
        path: "boots",
      },
      {
        title: "კლასიკური",
        path: "clasicShoes",
      },
      {
        title: "ყოველდღიური",
        path: "dailyShoes",
      },
      {
        title: "სანდალი/ჩუსტი",
        path: "loafers",
      },
    ],
  },
  {
    path: `${path}/sport`,
    display: "სპორტული",
    subMenu: [
      {
        title: "სპორტული მაისური",
        path: "sportsShirts",
      },
      {
        title: "სპორტული შარვალი",
        path: "sportsTrousers",
      },
      {
        title: "სპორტული ჟაკეტი",
        path: "sportsJacket",
      },
      {
        title: "სპორტული ფეხსაცმელი",
        path: "sportsShoes",
      },
    ],
  },
  {
    path: `${path}/accessories`,
    display: "აქსესუარები",
    subMenu: [
      {
        title: "ჩანთა",
        path: "bag",
      },
      {
        title: "შარფი",
        path: "scarf",
      },
      {
        title: "წინდები",
        path: "socks",
      },
      {
        title: "ხელთათმანი",
        path: "xeltatmani",
      },
      {
        title: "სამაჯური",
        path: "bracelete",
      },
      {
        title: "ქუდი",
        path: "hat",
      },
      {
        title: "ქამარი",
        path: "belt",
      },
    ],
  },
];
