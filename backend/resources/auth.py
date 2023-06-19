from flask import request
from flask_jwt_extended import create_access_token
from flask_restful import Resource
from database.models import db, User
from database.schemas import register_schema, user_schema, users_schema
from marshmallow import ValidationError
import datetime


class RegisterResource(Resource):
    """ User Registration, creates new user """
    def post(self):
        form_data = request.get_json()
        try:
            new_user = register_schema.load(form_data)
            # new_user.hash_password()
            db.session.add(new_user)
            db.session.commit()
            return user_schema.dump(new_user), 201
        except ValidationError as err:
            return err.messages, 400



class LoginResource(Resource):
    """ User Login, responds with access token """
    def post(self):
        form_data = request.get_json()
        user = db.one_or_404(
            User.query.filter_by(username=form_data.get('username')),
            description=f"No user with that username."
        )
        authorized = user.pin == int(form_data.get('pin'))
        if not authorized:
            return {'error': 'Username or PIN invalid'}, 401
        expires = datetime.timedelta(days=7)
        additional_claims = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name
        }
        access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims, expires_delta=expires)
        return {'access': access_token}, 200

class getAllUsers(Resource):
    def get(self):
        all_users = User.query.all()
        return users_schema.dump(all_users)