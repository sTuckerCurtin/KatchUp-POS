import React, { useState } from 'react';
import axios from 'axios';

const API_TOKEN = 'EAAAELTRYTEuv7a3yrWmfnsAckrSaB8M-8NlPdEKoDVjTjqZpI7a4ltGIVeWM5Kp';

function Transaction({ order_id, totalPrice }) {
  const [amount, setAmount] = useState(0);

  const handleAmountChange = (event) => {
    setAmount(Number(event.target.value));
  };

  const submitTransaction = async () => {
    const requestData = {
      amount_money: {
        amount: totalPrice,
        currency: 'USD',
      },
      idempotency_key: '19bd7633-f4b8-46b2-b819-a7e1cdc26d7b',
      source_id: 'cnon:card-nonce-ok',
    };

    try {
      const response = await axios.post(
        'https://connect.squareupsandbox.com/v2/payments',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      
      console.log(response.data);
    } catch (error) {
      console.error(error.response);
    }
  };

  return (
    <div>
      <h1>Complete Transaction</h1>

      <div>Total Price: {totalPrice}</div>

      <button onClick={submitTransaction}>Submit</button>
    </div>
  );
}

export default Transaction;
