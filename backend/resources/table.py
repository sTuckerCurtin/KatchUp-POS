from flask import Flask
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_restful import Resource
from database.models import db, Table
from database.schemas import table_schema, tables_schema, UserSchema  

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
    

class AssignUserTableResource(Resource):

    @jwt_required()
    def put(self, table_id):
        user_id = get_jwt_identity()
        table = Table.query.get(table_id)
        if not table:
            return {"message": f"No table with id {table_id} found."}, 404
        if table.user_id is not None:
            return {"message": "Table already assigned."}, 409
        table.user_id = user_id
        db.session.commit()
        return {"message": f"Table {table_id} successfully assigned to user {user_id}."}
    
    
    @jwt_required()
    def delete(self, table_id):
        
        user_id = get_jwt_identity()
        table = Table.query.filter_by(id=table_id, user_id=user_id).first()
        if table is None:
            return {"message": "You are not currently assigned to this table."}, 401

        table.user_id = None
        db.session.commit()

        return {"message": f"You have been removed from table {table_id}."}
