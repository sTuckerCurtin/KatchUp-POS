from flask_marshmallow import Marshmallow
from marshmallow import post_load, fields
from database.models import User, Car

ma = Marshmallow()

# Auth Schemas
class RegisterSchema(ma.Schema):
    """
    Schema used for registration, includes password and pins
    """
    id = fields.Integer(primary_key=True)
    username = fields.String(required=True)
    password = fields.String(required=True)
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    email = fields.String(required=True)
    pin = fields.List(fields.Integer(), required=True)
    is_manager = fields.Boolean(missing=False)
    
    class Meta:
        fields = ("id", "username",  "password", "first_name", "last_name", "email", "pins", "is_manager")

    @post_load
    def create_user(self, data, **kwargs):
        return User(**data)

class UserSchema(ma.Schema):
    """
    Schema used for displaying users, does NOT include password or pins
    """
    id = fields.Integer(primary_key=True)
    username = fields.String(required=True)
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    email = fields.String(required=True)
    
    class Meta:
        fields = ("id", "username", "first_name", "last_name", "email")

register_schema = RegisterSchema()
user_schema = UserSchema()
users_schema = UserSchema(many=True)



# Car Schemas
class CarSchema(ma.Schema):
    id = fields.Integer(primary_key=True)
    make = fields.String(required=True)
    model = fields.String(required=True)
    year = fields.Integer()
    user_id = fields.Integer()
    user = ma.Nested(UserSchema, many=False)
    class Meta:
        fields = ("id", "make", "model", "year", "user_id", "user")
    
    @post_load
    def create_car(self, data, **kwargs):
        return Car(**data)

car_schema = CarSchema()
cars_schema = CarSchema(many=True)


# TODO: Add your schemas below

# class TableSchema(ma.Schema):
#     id = fields.Integer(primary_key=True)
#     name = fields.String(required=True)
#     user_id= fields.Integer()
#     user = ma.Nested(UserSchema, many=False)
#     class Meta:
#         fields = ("id", "table_name", "user_id", "user")

#     @post_load
#     def create_table(self, data, **kwargs):
#         return Table(**data)
    
# table_schema = TableSchema()
# tables_schema = TableSchema(many=True)

# class Categorized_dishes_Schema(ma.Schema):
#     id = fields.Integer(primary_key=True)
#     dish_type = fields.String(required=True)

#     class Meta:
#         fields = ("id", "dish_type")

#     @post_load
#     def create_cat_dish(self, data, **kwargs):
#         return Categorized_dishes(**data)
    
# categorized_dish_schema = Categorized_dishes_Schema()
# categorized_dishes_schema = Categorized_dishes_Schema(many=True)


# class Menu_items_Schema(ma.Schema):
#     id = fields.Integer(primary_key=True)
#     dish_name = fields.String(required=True)
#     price = fields.Float(required=True)
#     dish_type_id = fields.Integer(required=True)
#     dish_type = ma.Nested(Categorized_dishes_Schema, many=False)
    
#     class Meta:
#         fields= ('id', "dish_name", "price", "dish_type_id", "dish_type")

#     @post_load
#     def create_menu_item(self, data, **kwargs):
#         return Menu_items(**data)
    
# menu_item_schema= Menu_items_Schema()
# menu_items_schema = Menu_items_Schema(many=True)


# class TransactionSchema(ma.Schema):
#     id = fields.Integer(primary_key=True)
#     total = fields.Float(required=True)
#     date = fields.Date(required=True)
#     menu_item_id = fields.Integer(required=True)
#     menu_item = ma.Nested(Menu_items_Schema)
#     user_id = fields.Integer(required=True)
#     user = ma.Nested(UserSchema, many=False)
#     payment_id = fields.Integer(required=True)
#     status = fields.String()
#     amount_paid= fields.Float()
#     currency = fields.String()
#     payment_method = fields.String(required=True)

#     class Meta:
#         fields = ('id', 'total', 'date', 'menu_item_id', 'menu_item',
#                   'user_id', 'user', 'payment_id', 'status', 'amount_paid',
#                   'currency', 'payment_method')
        
#     @post_load
#     def create_transaction(self, data, **kwargs):
#         return Transaction(**data)

# transaction_schema = TransactionSchema()
# transactions_schema = TransactionSchema(many=True)



