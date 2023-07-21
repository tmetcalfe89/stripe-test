(async function () {
  const pk = await (await fetch("/api/stripe/pk")).text();
  const stripe = Stripe(pk);

  document.getElementById("pay").addEventListener("click", async () => {
    //gonna charge $5

    // Create PaymentIntent
    const piResponse = await fetch("/api/stripe/paymentintent", {
      method: "POST",
    });
    const paymentIntent = await piResponse.json();

    console.log(paymentIntent);

    const options = {
      clientSecret: paymentIntent.client_secret,
    };

    const elements = stripe.elements(options);
    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");

    const form = document.getElementById("payment-form");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const { error } = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: "http://localhost:3000?id=123",
        },
      });

      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        const messageContainer = document.querySelector("#error-message");
        messageContainer.textContent = error.message;
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    });
  });
})();
