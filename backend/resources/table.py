from flask import Flask
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_restful import Resource
from database.models import db, Table, Order
from database.schemas import table_schema, tables_schema, order_schema

class AllTableResource(Resource):
    def get(self):
        tables = Table.query.all()
        return tables_schema.dump(tables), 200
    def post(self):
        form_data=request.json
        new_table = Table(name=form_data["name"],
                          seats=form_data["seats"])
        result = table_schema.dump(new_table)
        db.session.add(new_table)
        db.session.commit()
        return {"message": f"{result} was created"}


class UserTableResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user_table = Table.query.filter_by(user_id=user_id)
        return tables_schema.dump(user_table), 200
    

class TableResource(Resource):
    @jwt_required()
    def get(self, table_id):
        table = Table.query.get_or_404(table_id)
        return table_schema.dump(table)

    @jwt_required()
    def put(self, table_id ):
        table = Table.query.get_or_404(table_id)

        if table.user_id == get_jwt_identity():
            return {"message": "User already assigned"}, 400

        if "user_id" in request.json:
            user_id = request.json["user_id"]
            table.user_id = user_id
            if table.user_id is not None:
                new_order = Order(table_id=table_id, user_id=user_id)
                db.session.add(new_order)
        db.session.commit()
        return table_schema.dump(table)
    
    
    @jwt_required()
    def delete(self, table_id):
        
        user_id = get_jwt_identity()
        table = Table.query.filter_by(id=table_id, user_id=user_id).first()
        if table is None:
            return {"message": "You are not currently assigned to this table."}, 401

        table.user_id = None
        db.session.commit()

        return {"message": f"You have been removed from table {table_id}."}
