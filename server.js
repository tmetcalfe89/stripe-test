require("dotenv").config();

const express = require("express");
const path = require("path");
const stripe = require("stripe");

const { STRIPE_API_KEY, STRIPE_PK } = process.env;

const app = express();
const stripeClient = stripe(STRIPE_API_KEY);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/stripe/pk", async (req, res) => {
  res.send(STRIPE_PK);
});

app.post("/api/stripe/paymentintent", async (req, res) => {
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: 500,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.send(paymentIntent);
});

app.post("/api/stripe/paymentreceived", async (req, res) => {
  const { paymentIntent } = req.body;
  console.log(paymentIntent);
  res.sendStatus(200);
});

app.listen(3001);
