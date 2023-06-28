from flask import Flask
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_restful import Resource
import stripe


class CreatePaymentIntentResource(Resource):
    def post(self):
        # Retrieve the required data from the request
        amount = request.json.get('amount')
        currency = request.json.get('currency')

        # Create the PaymentIntent using the Stripe Python library
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency
        )

        # Return the PaymentIntent's client secret
        return {'client_secret': payment_intent.client_secret}
