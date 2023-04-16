// const sdk = require("api")("@payze/v1.0#393a6dmpll2ka4sgp");
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const { Firestore } = require("firebase-admin/firestore");
const { Telegraf } = require("telegraf");
// const http = require("http");
// const { Server } = require("socket.io");
const { db } = require("./firebase.js");
const admin = require("firebase-admin");
// const { updateDoc, doc } = require("firebase-admin/firestore");
const port = 4000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const bot = new Telegraf(process.env.BOT_TOKEN);
let storeName;
let email;
// let newOrder

app.post("/checkout", (req, res) => {
  console.log("checkout");

  email = req.body.email;
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
      hookRefund: false,
    },
  };

  axios
    .post(url, data)
    .then(async (response) => {
      console.log("paymant");
      prods = req.body.cartItems;

      storeName = prods.map((item) => {
        return item.name;
      });

      newOrder = prods.map((item) => {
        // storeName = item.name
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

      transactionId = response.data.response.transactionId;

      res.json({
        transactionUrl: response.data.response,
        cartItems: newOrder,
        transactionId: response.data.transactionId,
      });
      let ord = {
        orderId: "sdfdsf",
        orders: newOrder,
        sellers: storeName,
        buyer: email,
        purchaseTime: Date.now(),
      };

      // console.log(ord);

      // const usersRef = db.collection("users");
      // const snap = await usersRef.where("email", "==", email).get();

      // snap.forEach((doc) => {
      //   let oldOrders = doc.data().order;

      //   let ord = {
      //     orderId: doc.id,
      //     orders: newOrder,
      //     sellers: storeName,
      //     buyer: email,
      //     purchaseTime: Date.now(),
      //     amount: req.body.amount,
      //   };
      //   db.collection("users")
      //     .doc(doc.id)
      //     .update({
      //       order: [ord, ...oldOrders],
      //       // amount: req.body.amount,
      //     });
      // });

      //this code is witten by chatgpt from here
      //ქვედა კოდი პროდუქტებს ამატებს შესაბამისი მაღაზიის დოკუმენტში

      // const productsByStore = {};
      // newOrder.forEach((product) => {
      //   const storeName = product.name;
      //   if (!productsByStore[storeName]) {
      //     productsByStore[storeName] = [];
      //   }
      //   productsByStore[storeName].push(product);
      // });

      // for (const [storeName, products] of Object.entries(productsByStore)) {
      //   const storeRef = db.collection("store");
      //   const snap = await storeRef.where("name", "==", storeName).get();

      //   snap.forEach((doc) => {
      //     let oldOrders = doc.data().order;
      //     let ord = {
      //       orderId: doc.id,
      //       orders: newOrder,
      //       buyer: email,
      //       purchaseTime: Date.now(),
      //       amount: req.body.amount,
      //     };
      //     // console.log([ord, ...oldOrders]);

      //     if (oldOrders) {
      //       db.collection("store")
      //         .doc(doc.id)
      //         .update({
      //           order: [ord, ...oldOrders],
      //         });
      //     } else {
      //       db.collection("store")
      //         .doc(doc.id)
      //         .update({
      //           order: [ord],
      //         });
      //     }
      //   });
      // }

      console.log("succ from checkout");
    })

    .catch((error) => {
      console.error(error);
      res.status(500).send("Error processing payment.");
    });
});

app.post("/test", async (req, res) => {
  console.log(`test email ${email}`);
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
