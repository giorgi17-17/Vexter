// const sdk = require("api")("@payze/v1.0#393a6dmpll2ka4sgp");
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();

const port = 4000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
// Define a route

app.post("/checkout", (req, res) => {
  // Call the justPay function from the API module
  console.log('checkout')
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
      hookUrl: "https://vexter.onrender.com/test",
      hookRefund: false,  
    },
  };

  axios
    .post(url, data)
    .then((response) => {
      console.log('paymant')
      let prods = req.body.cartItems;
      let result = prods.map((item) => {
        return { itemId: item.id, itemQuantity: item.quantity - 1 };
      });

      res.json({
        transactionUrl: response.data.response,
        cartItems: result,
        transactionId: response.data.transactionId 
      });
      // console.log(response.data.response);
      if (response.data.status === "Committed") {
        console.log("succ from checkout");
      }
      // res.json(req.body.cartItems)
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error processing payment.");
    });
});


app.post("/test", (req, res) => {
  console.log('test')
} )

app.post("/cart", (req, res) => {
  console.log('cart')
  const transactionData = {
    method: "getTransactionInfo",
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    data: { transactionId: req.body.transactionId },
  };

  axios
    .post("https://payze.io/api/v1", transactionData)
    .then((response) => {
      // console.log(response.data.)
      console.log('transaction')
      console.log(req.body.transactionId);
      console.log(response.data.response.status)
      res.json({
       status: response.data.response.status
      })
      // console.log(req.body.data);
      if (response.data.response.status === "Committed") {
        console.log("succ");
        // res.send("working")
      }
    })
    .catch((error) => {
      console.error("transaction not finished");
      res.status(500).send("transaction not finished 500");
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
