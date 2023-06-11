from flask import Flask
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_restful import Resource
from database.models import db, Transaction
from database.schemas import transaction_schema, transactions_schema


class UserTransactionResource(Resource):
    def get(self):
        transaction=Transaction.query.all()
        return transaction_schema.dump(transaction)
    
    @jwt_required()
    def post(self):
        form_data = request.get_json()

        payment_id = form_data.get('payment_id')
        created_at = form_data.get('created_at')
        amount = form_data.get('amount')
        order_id = form_data.get('order_id')

        if not payment_id or not created_at or not amount or not order_id:
            return {"error": "Missing required fields"}, 400

        new_transaction = Transaction(
            payment_id=payment_id,
            created_at=created_at,
            amount=amount,
            order_id=order_id
        )

        db.session.add(new_transaction)
        db.session.commit()

        result = transaction_schema.dump(new_transaction)
        return result, 201