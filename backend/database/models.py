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
    table_name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    user = db.relationship("User")


class Categorized_dishes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dish_type = db.Column(db.String(255), nullable=False)

class Menu_items(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dish_name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    dish_type_id = db.Column(db.Integer, db.ForeignKey("categorized_dishes.id"))

    dish_type = db.relationship("Categorized_dishes")

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    total = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    payment_id = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(100), nullable=False)
    amount_paid = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)

    user = db.relationship("User")
    menu_item = db.relationship("Menu_items")
