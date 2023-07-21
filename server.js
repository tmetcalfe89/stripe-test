require("dotenv").config();

const express = require("express");
const path = require("path");
const stripe = require("stripe");

const { STRIPE_API_KEY } = process.env;

const app = express();
const stripeClient = stripe(STRIPE_API_KEY);

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/stripe/paymentintent", async (req, res) => {
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: 500,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.send(paymentIntent);
});

app.listen(3000);