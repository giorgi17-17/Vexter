// const sdk = require("api")("@payze/v1.0#393a6dmpll2ka4sgp");
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
// const http = require("http");
// const { Server } = require("socket.io");
const { db } = require("./firebase.js");
// const { updateDoc, doc } = require("firebase-admin/firestore");
const port = 4000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });
// Define a route
let transactionId;

// io.on("connection", (socket) => {
//   console.log(`user ${socket.id}`)
//   socket.on("send_message", (data) => {
//     console.log(data)
//   });
//   socket.emit("recieveData", {info: "sdsdsd"})
// })

app.post("/checkout", (req, res) => {
  // Call the justPay function from the API module
  console.log("checkout");
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
      let prods = req.body.cartItems;
      let newOrder = prods.map((item) => {
        return {
          id: item.id,
          quantity: item.quantity,
          title: item.title,
          img: item.img,
          price: item.price,
          name: item.name,
          size: item.size,
        };
      });

      transactionId = response.data.response.transactionId;

      res.json({
        transactionUrl: response.data.response,
        cartItems: newOrder,
        transactionId: response.data.transactionId,
      });
     
      // console.log(response.data.response);
      if (response.data.status === "Committed") {
        console.log("succ from checkout");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error processing payment.");
    });
});

app.post("/cart", async (req, res) => {
  //when transaction successfull decrement quantity of product

  console.log("cart");
  console.log(`id: ${transactionId}`);
  console.log(req.body);
  console.log('--------------------')
  console.log(req.body.email);
  const citiesRef = db.collection("users");
  const snap = await citiesRef.where("email", "==", req.body.email).get();

  snap.forEach((doc) => {
    let userData = doc.data();
    // console.log(userData.order);
    // console.log('-----------------------')
    let orders = userData.order;
    let arraysToSpread = [...newOrder,...orders];
    console.log(arraysToSpread);
    db.collection("users").doc(doc.id).update({
      order: arraysToSpread,
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
