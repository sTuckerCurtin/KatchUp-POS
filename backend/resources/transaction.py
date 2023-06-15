from flask import Flask
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_restful import Resource
from database.models import db, Transaction, Order
from database.schemas import transaction_schema, transactions_schema


class UserTransactionResource(Resource):
    def get(self):
        transaction=Transaction.query.all()
        return transaction_schema.dump(transaction)
    
    @jwt_required()
    def post(self):
        form_data = request.get_json()
        new_transaction = Transaction(
            payment_id=form_data["payment_id"],
            created_at=form_data["created_at"],
            amount=form_data['amount'],
            order_id = form_data["order_id"])
        order = Order.query.get_or_404(form_data["order_id"])
        order.is_completed = True

        db.session.add(new_transaction)
        db.session.commit()
        return transaction_schema.dump(new_transaction)
    

class ManagerTransactionResource(Resource):
    @jwt_required()
    def put(self,transaction_id):
        user_id=get_jwt_identity()
        edit_transaction = Transaction.query_or_404(transaction_id)
        if "payment_id" in request.json:
            edit_transaction.payment_id=request.json["payment_id"]
        if "created_at" in request.json:
            edit_transaction.created_at=request.json["created_at"]
        if "amount" in request.json:
            edit_transaction.amount=request.json["amount"]
        if "order_id" in request.json:
            edit_transaction.order_id=request.json["order_id"]
        db.session.commit()
        return transaction_schema.dump(edit_transaction), 200
    
    @jwt_required()
    def delete(self, transaction_id):
        user_id = get_jwt_identity()
        deleted_transaction = Transaction.query.get_or_404(transaction_id)
        db.session.delete(deleted_transaction)
        db.session.commit()
        return f"removed {deleted_transaction} from db"