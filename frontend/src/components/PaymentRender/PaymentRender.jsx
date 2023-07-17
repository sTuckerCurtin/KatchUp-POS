import axios from "axios";
import React, { useEffect, useState } from "react";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import useAuth from "../../hooks/useAuth";
import { loadStripe } from "@stripe/stripe-js";

function PaymentRender({ totalPrice, order, onCloseOrder }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [user, token, config] = useAuth();
  const stripePromise = loadStripe(
    "pk_test_51NL7X3IQQKESwEBogccRxc6CJwBUzFfY1ucZcPkgKzcXks04Lru7tdvlqRg5wRPYAZQVIfbTcTbQU0UpZc0iBMKP002bG8lm4D"
  );

  const createPayment = async () => {
    const formData = {
      amount: 500,
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
      console.log(response.data)
      setClientSecret({'clientSecret':response.data.client_secret});
    } catch (error) {
      console.log(error.response);
    }
  };
 

  const updateOrderTableId = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/orders/${order.id}`,
        { table_id: 7 },
        config
      );
      console.log("Order table_id updated successfully.", response.data);
    } catch (error) {
      console.error("Failed to update order table_id:", error.response);
    }
  };

  const [paymentId, setPaymentId] = useState(user.first_name);
  const [createdAt, setCreatedAt] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [amount, setAmount] = useState(totalPrice);
  const [orderId, setOrderId] = useState(order.id);

  const handleSubmit = (e) => {
    e.preventDefault();

    const transactionData = {
      payment_id: paymentId,
      created_at: createdAt,
      amount: parseFloat(amount),
      order_id: orderId,
    };

    handleTransaction(transactionData);

    setPaymentId("");
    setAmount("");
    setOrderId("");
  };

  const handleTransaction = async (transactionData) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/transactions",
        transactionData,
        config
      );

      console.log(response.data);
      onCloseOrder(); 
    } catch (error) {
      console.error(error.response);
    }
  };

  useEffect(() => {
    createPayment();
  }, []);

  return (
     clientSecret ?<Elements stripe={stripePromise} options={clientSecret}>
    <CheckoutForm />
  </Elements>:<h1>test</h1>
  )
    
    // <div className="container">
    //   <div className="row">
    //     <div className="col">
    //       <form onSubmit={handleSubmit}>
    //         <div className="form-group">
    //           <input
    //             type="text"
    //             className="form-control"
    //             placeholder="Payment ID"
    //             value={paymentId}
    //             onChange={(e) => setPaymentId(e.target.value)}
    //             required
    //           />
    //         </div>
  
    //         <div className="form-group">
    //           <input
    //             type="text"
    //             className="form-control"
    //             placeholder="Created At"
    //             value={createdAt}
    //             onChange={(e) => setCreatedAt(e.target.value)}
    //             required
    //             readOnly
    //           />
    //         </div>
  
    //         <div className="form-group">
    //           <input
    //             type="number"
    //             className="form-control"
    //             placeholder="Amount"
    //             value={amount}
    //             onChange={(e) => setAmount(e.target.value)}
    //             required
    //           />
    //         </div>
  
    //         <div className="form-group">
    //           <input
    //             type="text"
    //             className="form-control"
    //             placeholder="Order ID"
    //             value={orderId}
    //             onChange={(e) => setOrderId(e.target.value)}
    //             required
    //           />
    //         </div>
  
    //         <button type="submit" className=" btn-primary">Submit</button>
    //       </form>
  
    //       <div className="form-group">
    //         <input
    //           type="text"
    //           className="form-control"
    //           placeholder="Credit Card Number"
    //           // handle the value and onChange as per your requirement
    //         />
    //       </div>
    //     </div>
    //   </div>
  
    //   <div className="row">
    //     <div className="col">
    //       <button onClick={updateOrderTableId} className="btn btn-secondary">Close Check</button>
    //     </div>
    //   </div>
    // </div>
    
  
  
  
}

export default PaymentRender;
