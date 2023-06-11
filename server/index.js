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

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

app.post("/checkout", async (req, res) => {
  console.log("succ from checkout");
  

  // console.log("checkout");
  email = req.body.email;
  // console.log(email);
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

  const productsBySellers = {};
  newOrder.forEach((product) => {
    const storeName = product.name;
    if (!productsBySellers[storeName]) {
      productsBySellers[storeName] = {
        products: [],
        totalAmount: 0,
      };
    }
    productsBySellers[storeName].products.push(product);
    productsBySellers[storeName].totalAmount +=
      product.price * product.quantity;
  });

  // console.log(productsBySellers);
  const splitData = [];
  let storeAmount;
  for (const [storeName, storeData] of Object.entries(productsBySellers)) {
    const storeRef = db.collection("store");
    const snap = await storeRef.where("name", "==", storeName).get();
    snap.forEach((doc) => {
      let bankNumbers = doc.data().bankNumber;

      // Calculate the amount for each store
      //
      storeAmount = storeData.totalAmount; // მთლიანი თანხა
      let storeSellersMoney = storeAmount - storeAmount * 0.08;

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
      callback: "https://vexter.ge",
      callbackError: "https://vexter.ge/cart",
      preauthorize: false,
      lang: "EN",
      hookUrl: `https://vexter.onrender.com/cart`,
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
      // console.log("paymant");

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
  // console.log(email);
  // console.log(req.body.finalAmount);
  // console.log(req.body.status);
  // console.log(`in cart ${email}`);
 
  if (req.body.status === "Committed") {
    console.log(`in commited ${email}`);

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

      if (oldOrders) {
        db.collection("users")
          .doc(doc.id)
          .update({
            order: [ord, ...oldOrders],
          });
      } else {
        db.collection("users")
          .doc(doc.id)
          .update({
            order: [ord],
          });
      }
    });

    //this code is witten by chatgpt from here
    //ქვედა კოდი პროდუქტებს ამატებს შესაბამისი მაღაზიის დოკუმენტში

    const productsByStores = {};
    newOrder.forEach((product) => {
      const storeName = product.name;
      if (!productsByStores[storeName]) {
        productsByStores[storeName] = [];
      }
      productsByStores[storeName].push(product);
    });

    for (const [storeName, products] of Object.entries(productsByStores)) {
      const storeRef = db.collection("store");
      const snap = await storeRef.where("name", "==", storeName).get();

      snap.forEach((doc) => {
        let oldOrders = doc.data().order;
        let phoneNUmber = doc.data().number;
        let telegramId = doc.data().telegramId;
        // console.log(oldOrders);
        let ord = {
          orderId: doc.id,
          orders: newOrder,
          buyer: email,
          purchaseTime: Date.now(),
          amount: req.body.amount,
        };

        //  onsole.log(telegramId);
          bot.telegram.sendMessage(
            telegramId,
            "თქვენი პროდუქტი წარმატევით გაიყიდა ❤️"
          ).catch(error => {
            console.error('Error sending message:', error);
          }); 

        // twilio sms

        // client.messages
        //   .create({
        //     body: "თქვენი პროდუქტი წარმატებით გაიყიდა ❤️",
        //     from: "+13203346949",
        //     to: phoneNUmber,
        //   })
        //   .then((message) => console.log(message.sid));

        // twilio sms

        if (oldOrders) {
          db.collection("store")
            .doc(doc.id)
            .update({
              order: [ord, ...oldOrders],
            });
        } else if (oldOrders === null) {
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

    console.log("succ from checkout");
  }
  console.log("done");
  // console.log("--------------------");
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
