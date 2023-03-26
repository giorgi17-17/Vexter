// import express from "express";
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config();

const port = 4000;

app.use(express.json());
app.use(cors())
app.use(bodyParser.json())
// Define a route

app.post("/checkout", (req, res) => {
  // Call the justPay function from the API module

  const url = "https://payze.io/api/v1";
  const data = {
    method: "justPay",
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    data: {
      amount: req.body.item,
      currency: "USD",
      callback: "https://corp.com/success_callback",
      callbackError: "https://corp.com/fail_url",
      preauthorize: false,
      lang: "EN",
      hookUrl: "https://corp.com/payze_hook?authorization_token=token",
      hookRefund: false,
    },
  };

  axios
    .post(url, data)
    .then((response) => {
      res.json(response.data.response)
      console.log(response.data)
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error processing payment.");
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
