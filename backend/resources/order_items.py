from flask import Flask
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_restful import Resource
from database.models import db, OrderItems
from database.schemas import order_item_scehma, orders_items_schema


class ServerOrderItemResource(Resource):
    def get(self):
        order_items= OrderItems.query.all()
        return orders_items_schema.dump(order_items)
    

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
