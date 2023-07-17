from flask import Flask
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_restful import Resource
from database.models import db, MenuItem
from database.schemas import menu_item_schema, menu_items_schema, UserSchema  

class AllMenuItemsResource(Resource):
    def get(self):
        items = MenuItem.query.all()
        return menu_items_schema.dump(items), 200
    
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        form_data = request.get_json()
        new_item = MenuItem(name=form_data["name"], 
                            type_id=form_data["type_id"], 
                            price=form_data["price"])
        result = menu_item_schema.dump(new_item)
        db.session.add(new_item)
        db.session.commit()
        return {"message": f"{result} was successfully created"}, 201
    

class ServerMenuResource(Resource):
    @jwt_required()
    def get(self, type_id):
        items = MenuItem.query.filter_by(type_id=type_id).all()
        item_data= menu_items_schema.dump(items)
        return item_data
    
class UserMenuResource(Resource):
    @jwt_required()
    def delete(self, menu_item_id):
        user_id = get_jwt_identity()
        deleted_item = MenuItem.query.get_or_404(menu_item_id)
        db.session.delete(deleted_item)
        db.session.commit()
        return f"Removed {deleted_item} from DB", 204
    

    @jwt_required()
    def put(self, menu_item_id):
        user_id = get_jwt_identity()
        edit_item = MenuItem.query.get_or_404(menu_item_id)
        if "name" in request.json:
            edit_item.name = request.json["name"]
        if "price" in request.json:
            edit_item.price = request.json["price"]
        if "type_id" in request.json:
            edit_item.type_id = request.json["type_id"]
        db.session.commit()
        return menu_item_schema.dump(edit_item), 200 



        

    




        
    


