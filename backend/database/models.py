from flask_bcrypt import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False, unique=True)
    pin = db.Column(db.Integer, nullable=False, unique=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    is_manager = db.Column(db.Boolean, default=False)

    def hash_pin(self):
        self.pin = generate_password_hash(str(self.pin)).decode('utf8')

    def check_pin(self, pin):
        return check_password_hash(self.pin, str(pin))

    def __repr__(self):
        return self.username


class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(255), nullable=False)
    model = db.Column(db.String(255), nullable=False)
    year = db.Column(db.Integer)
    # Adds user_id as an Integer column on the car table which references the id column on user table
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # Establishes object relation between car-user so we can grab values like car.user.username
    user = db.relationship("User")

# TODO: Add your models below, remember to add a new migration and upgrade database

class Table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    seats = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    user = db.relationship("User")


class ItemType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(255), nullable=False)

class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey("item_type.id"))

    type = db.relationship("ItemType")

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    payment_id = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable=False)

    order = db.relationship("Order")
  

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    table_id = db.Column(db.Integer, db.ForeignKey("table.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    user = db.relationship("User")
    table = db.relationship("Table")

class OrderItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, default=1)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey("menu_item.id"), nullable=False)

    order = db.relationship("Order")
    menu_item = db.relationship("MenuItem")


