from flask import Flask
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_restful import Resource
from database.models import db, Order, User, Table
from database.schemas import order_schema, orders_schema

class UserOrderResource(Resource):
    def get(self):
        orders=Order.query.all()
        return orders_schema.dump(orders)
    

    @jwt_required()
    def post(self):
     
        form_data = request.get_json()
        table_id = form_data['table_id']
        user_id = get_jwt_identity()  

       
        order = Order(table_id=table_id, user_id=user_id)
        db.session.add(order)
        db.session.commit()

        return {"order_id":order.id,
                "table_id": table_id,
                "user_id": user_id}, 201
    
class ManagementOrderResource(Resource):
    @jwt_required()
    def put(self, order_id):
        user_id = get_jwt_identity()
        edit_order = Table.query.get_or_404(order_id)
        if "table_id" in request.json:
            edit_order.table_id=request.json["table_id"]
        if "user_id" in request.json:
            edit_order.user_id=request.json["user_id"]
        db.session.commit()
        return order_schema.dump(edit_order), 200
    
    @jwt_required()
    def delete(self, order_id):
        user_id= get_jwt_identity()
        deleted_order = Order.query.get_or_404(order_id)
        db.session.delete(deleted_order)
        db.session.commit()
        return f"removed {deleted_order} from DB", 204

    
    @jwt_required()
    def get(self, order_id):
        user_id = get_jwt_identity()
        order = Order.query.get(order_id)
        if not order:
            return {'message': 'Order not found'}, 404
        return order_schema.dump(order), 200

