from flask_marshmallow import Marshmallow
from marshmallow import post_load, fields
from database.models import User, Car, Table, ItemType, MenuItem, Transaction, Order, OrderItems

ma = Marshmallow()

# Auth Schemas
class RegisterSchema(ma.Schema):
    """
    Schema used for registration, includes password and pins
    """
    id = fields.Integer(primary_key=True)
    username = fields.String(required=True)
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    email = fields.String(required=True)
    pin = fields.Integer(required=True)
    is_manager = fields.Boolean(missing=False)
    
    class Meta:
        fields = ("id", "username",  "password", "first_name", "last_name", "email", "pin", "is_manager")

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
    pin = fields.Integer(required=True)
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



class ItemType_Schema(ma.Schema):
    id = fields.Integer(primary_key=True)
    type = fields.String(required=True)

    class Meta:
        fields = ("id", "type")

    @post_load
    def create_Item(self, data, **kwargs):
        return ItemType(**data)
    
categorized_dish_schema = ItemType_Schema()
categorized_dishes_schema = ItemType_Schema(many=True)


class MenuItems_Schema(ma.Schema):
    id = fields.Integer(primary_key=True)
    name = fields.String(required=True)
    price = fields.Float(required=True)
    type_id = fields.Integer(required=True)
    type = ma.Nested(ItemType_Schema, many=False)
    
    class Meta:
        fields= ('id', "name", "price", "type_id", "type")

    @post_load
    def create_menu_item(self, data, **kwargs):
        return MenuItem(**data)
    
menu_item_schema= MenuItems_Schema()
menu_items_schema = MenuItems_Schema(many=True)




class TableSchema(ma.Schema):
    id = fields.Integer(primary_key=True)
    name = fields.String(required=True)
    seats = fields.Integer()
    user_id = fields.Integer()
    user = ma.Nested(UserSchema, many=False)
    orders= ma.Nested("OrderSchema", many=True)
    
    class Meta:
        fields = ("id", "name", "seats", "user_id", "user", "orders")

    @post_load
    def create_table(self, data, **kwargs):
        return Table(**data)
    
table_schema = TableSchema()
tables_schema = TableSchema(many=True)


class OrderSchema(ma.Schema):
    id = fields.Integer(primary_key=True)
    table_id = fields.Integer(required=True)
    user_id = fields.Integer(required=True)
    user = ma.Nested(UserSchema, many=False)
    items = ma.Nested("OrderItems_Schema", many=True)
    is_completed = fields.Boolean()

    class Meta:
        fields = ("id", "table_id",  "user_id", "user", "items", "is_completed")

    @post_load
    def create_order(self, data, **kwargs):
        return Order(**data)

order_schema = OrderSchema()
orders_schema = OrderSchema(many=False)





class TransactionSchema(ma.Schema):
    id = fields.Integer(primary_key=True)
    payment_id = fields.String(required=True)
    created_at = fields.Date(required=True)
    amount = fields.Float(required=True)
    order_id = fields.Integer(required=True)

    order = ma.Nested(OrderSchema, many=False)
   
    


    class Meta:
        fields = ('id', "payment_id", "created_at", "amount", "order_id", "order")
        
    @post_load
    def create_transaction(self, data, **kwargs):
        return Transaction(**data)

transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)



class OrderItems_Schema(ma.Schema):
    id = fields.Integer(primary_key=True)
    quantity = fields.Integer(required=True, many=True)
    order_id = fields.Integer(required=True, many=True)
    order = ma.Nested(OrderSchema, many=False)
    menu_item_id = fields.Integer(required=True, many=True)
    menu_item = ma.Nested(MenuItems_Schema)

    class Meta:
        fields = ("id", "quantity", "order_id", "menu_item_id", "menu_item")

    @post_load
    def create_ordered_items(self, data, **kwargs):
        return OrderItems(**data)
    
order_item_scehma = OrderItems_Schema()
orders_items_schema = OrderItems_Schema(many=True)
