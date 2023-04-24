const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const { Telegraf } = require("telegraf");
const { db } = require("./firebase.js");
const port = 4000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const bot = new Telegraf(process.env.BOT_TOKEN);
let storeName;
let email;
let amount;
let newOrder;

app.post("/checkout", async (req, res) => {
  console.log("checkout");
  email = req.body.email;
  prods = req.body.cartItems;
  amount = req.body.amount;


  newOrder = prods.map((item) => {
    return {
      id: item.id,
      title: item.title,
      price: item.price,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      img: item.img,
      createdAt: Date.now(),
    };
  });

  const productsByStore = {};
  newOrder.forEach((product) => {
    const storeName = product.name;
    if (!productsByStore[storeName]) {
      productsByStore[storeName] = {
        products: [],
        totalAmount: 0,
      };
    }
    productsByStore[storeName].products.push(product);
    productsByStore[storeName].totalAmount += product.price * product.quantity;
  });
  console.log(productsByStore);
  const splitData = [];
  let storeAmount
  for (const [storeName, storeData] of Object.entries(productsByStore)) {
    const storeRef = db.collection("store");
    const snap = await storeRef.where("name", "==", storeName).get();

    snap.forEach((doc) => {
      let bankNumbers = doc.data().bankNumber;

      // Calculate the amount for each store
       storeAmount = storeData.totalAmount;
      let storeSellersMoney = storeAmount - storeAmount * 0.05;

      // Add a new split for each bank number
      splitData.push({
        iban: bankNumbers,
        amount: storeSellersMoney,
        payIn: 0,
        description: "Description for bank.",
      });
    });
  }
  

  const url = "https://payze.io/api/v1";
  const data = {
    method: "justPay",
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    data: {
      amount: req.body.amount,
      currency: "GEL",
      callback: "https://vertex-ecommerce.web.app",
      callbackError: "https://vertex-ecommerce.web.app/cart",
      preauthorize: false,
      lang: "EN",
      hookUrl: "https://vexter.onrender.com/cart",
      split: [
        {
          iban: "GE33TB0000000000350000",
          amount: storeAmount * 0.05,
          payIn: 0,
          description: "Description for bank.",
        },
        ...splitData,
      ],
      hookRefund: false,
    },
  };

  axios
    .post(url, data)
    .then(async (response) => {
      console.log("paymant");

      storeName = prods.map((item) => {
        return item.name;
      });

      res.json({
        transactionUrl: response.data.response,
        cartItems: newOrder,
      });
      console.log("succ from checkout");
    })

    .catch((error) => {
      console.error(error);
      res.status(500).send("Error processing payment.");
    });
});

app.post("/cart", async (req, res) => {
  //when transaction successfull decrement quantity  of product
  //and only in this ocassion make orders on account page

  console.log("cart");
  // console.log(req.body);
  console.log(req.body.finalAmount);
  console.log(req.body.status);
  console.log(email);
  // finalAmount:
  // status:
  if (req.body.status === "Committed") {
    const usersRef = db.collection("users");
    const snap = await usersRef.where("email", "==", email).get();

    snap.forEach((doc) => {
      let oldOrders = doc.data().order;

      let ord = {
        orderId: doc.id,
        orders: newOrder,
        sellers: storeName,
        buyer: email,
        purchaseTime: Date.now(),
        amount: req.body.finalAmount,
      };
      db.collection("users")
        .doc(doc.id)
        .update({
          order: [ord, ...oldOrders],
          // amount: req.body.amount,
        });
    });

    //this code is witten by chatgpt from here
    //ქვედა კოდი პროდუქტებს ამატებს შესაბამისი მაღაზიის დოკუმენტში

    const productsByStore = {};
    newOrder.forEach((product) => {
      const storeName = product.name;
      if (!productsByStore[storeName]) {
        productsByStore[storeName] = [];
      }
      productsByStore[storeName].push(product);
    });

    for (const [storeName, products] of Object.entries(productsByStore)) {
      const storeRef = db.collection("store");
      const snap = await storeRef.where("name", "==", storeName).get();

      snap.forEach((doc) => {
        let oldOrders = doc.data().order;
        let ord = {
          orderId: doc.id,
          orders: newOrder,
          buyer: email,
          purchaseTime: Date.now(),
          amount: req.body.amount,
        };
        // console.log([ord, ...oldOrders]);

        if (oldOrders) {
          db.collection("store")
            .doc(doc.id)
            .update({
              order: [ord, ...oldOrders],
            });
        } else {
          db.collection("store")
            .doc(doc.id)
            .update({
              order: [ord],
            });
        }
      });
    }

    // Update product quantities in the database
    //  ეს კოდი აკლებს 1-ს ყოველ გაყიდულ პროდუქტს
    newOrder.forEach(async (product) => {
      const productRef = db.collection("products").doc(product.id);
      const productDoc = await productRef.get();

      if (productDoc.exists) {
        const currentQuantity = productDoc.data().quantity;
        const updatedQuantity = Math.max(currentQuantity - 1, 0);

        await productRef.update({
          quantity: updatedQuantity,
        });
      }
    });

    // const storeRef = db.collection("store");
    // const ss = await storeRef.where("email", "==", email).get();

    // let telegramId;
    // ss.forEach((doc) => {
    //   let userData = doc.data();
    //   telegramId = userData.telegramId;
    //   console.log(userData.telegramId);
    // });
    // console.log(telegramId);
    // bot.telegram.sendMessage(
    //   telegramId,
    //   "თქვენი პროდუქტი წარმატევით გაიყყიდა ❤️"
    // );
    console.log("succ from checkout");
  }
  console.log("done");
  console.log("--------------------");
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
