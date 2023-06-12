from flask import Flask
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_restful import Resource
from database.models import db, OrderItems, Order, Transaction
from database.schemas import order_item_scehma, orders_items_schema


class ServerOrderItemResource(Resource):
    def get(self):
        order_items= OrderItems.query.all()
        return orders_items_schema.dump(order_items)
    

    @jwt_required()
    def post(self):
        form_data = request.get_json()

        order_items = orders_items_schema.load(form_data)
        if isinstance(order_items, list):
            new_order_items = []
            for order_item in order_items:
                order_id = order_item.order_id
                menu_item_id = order_item.menu_item_id

                if not order_id or not menu_item_id:
                    return {"error": "Missing order_id or menu_item_id"}, 400

                new_order_item = OrderItems(order_id=order_id, menu_item_id=menu_item_id)
                db.session.add(new_order_item)  # Adding new order item to the database
                new_order_items.append(new_order_item)

            db.session.commit()

            result = orders_items_schema.dump(new_order_items)
            return result, 201

        return {"error": "Invalid order item data"}, 400

    
class EditOrderResource(Resource):
    @jwt_required()
    def put(self, order_item_id):
        user_id=get_jwt_identity()
        edit_order_items= OrderItems.query.get_or_404(order_item_id)
        if "quantity" in request.json:
            edit_order_items.quantity=request.json["quantity"]
        if "order_id" in request.json:
            edit_order_items.order_id=request.json["order_id"]
        if "menu_item_id" in request.json:
            edit_order_items.menu_item_id=request.json["menu_item_id"]
        db.session.commit()
        return order_item_scehma.dump(edit_order_items), 200
    
    @jwt_required()
    def delete(self, order_item_id):
        user_id=get_jwt_identity()
        delete_order_item = OrderItems.query.get_or_404(order_item_id)
        db.session.delete(delete_order_item)
        db.session.commit()
        return f"removed{delete_order_item} from db", 204