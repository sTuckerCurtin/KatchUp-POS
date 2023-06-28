import axios from "axios";
import React, { useEffect, useState } from "react";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import useAuth from "../../hooks/useAuth";
import { loadStripe } from "@stripe/stripe-js";

function PaymentRender({ totalPrice }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [user, token, config] = useAuth();
  const stripePromise = loadStripe(
    "pk_test_51NL7X3IQQKESwEBogccRxc6CJwBUzFfY1ucZcPkgKzcXks04Lru7tdvlqRg5wRPYAZQVIfbTcTbQU0UpZc0iBMKP002bG8lm4D"
  );

  const createPayment = async () => {
    const formData = {
      amount: 50,
      source: "tok visa",
      code: "1111111111111111",
      currency: "USD",
    };
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/payment-intent",
        formData,
        config
      );
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    createPayment();
  }, []);

  return (
    <div>
      {clientSecret && (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            totalPrice={totalPrice}
            clientSecret={clientSecret} 
          />
        </Elements>
      )}
    </div>
  );
}

export default PaymentRender;
