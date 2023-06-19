from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restful import Api
from flask_migrate import Migrate
from database.models import db
from database.schemas import ma
from resources.order import UserOrderResource, ManagementOrderResource, getCheckByUserID
from resources.auth import LoginResource, RegisterResource, getAllUsers
from resources.transaction import UserTransactionResource, ManagerTransactionResource
from resources.cars import AllCarResource, UserCarResource
from resources.order_items import ServerOrderItemResource,EditOrderResource, CheckResource, OrderItemsResource
from resources.menu_items import AllMenuItemsResource, ServerMenuResource, UserMenuResource
from resources.table import AllTableResource, UserTableResource, TableResource
from dotenv import load_dotenv
from os import environ


# Adds variables from .env file to environment
load_dotenv()

# Creates instances of additional libraries
bcrypt = Bcrypt()
jwt= JWTManager()
cors = CORS()
migrate = Migrate()

def create_app():
    """
    App factory that creates app instance
    """
    # Creates app instance
    app = Flask(__name__)

    # Loads config properties from .env file
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('SQLALCHEMY_DATABASE_URI')
    app.config['JWT_SECRET_KEY'] = environ.get('JWT_SECRET_KEY')

    # Registers all routes with API
    api = create_routes()

    # Registers Flask app with additional libraries created/imported above
    db.init_app(app)
    ma.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    api.init_app(app)
    migrate.init_app(app, db)

    return app


def create_routes():
    """
    Creates Flask Restful instance and registers all Resource routes
    """
    api = Api()
    api.add_resource(RegisterResource, '/api/auth/register')
    api.add_resource(LoginResource, '/api/auth/login')
    api.add_resource(AllCarResource, '/api/cars')
    api.add_resource(UserCarResource, '/api/user_cars')
    # TODO: Create files for your Resources in resources folder, add them here
    api.add_resource(AllTableResource, "/api/tables")
    api.add_resource(UserTableResource, "/api/user_tables")
    api.add_resource(TableResource, "/api/tables/<int:table_id>")
    api.add_resource(AllMenuItemsResource, "/api/menu_items")
    api.add_resource(ServerMenuResource, "/api/menu_items/<int:type_id>")
    api.add_resource(UserMenuResource, "/api/menu_items/<int:menu_item_id>")
    api.add_resource(UserOrderResource, "/api/orders")
    api.add_resource(ManagementOrderResource, "/api/orders/<int:order_id>")
    api.add_resource(ServerOrderItemResource, "/api/order_items")
    api.add_resource(CheckResource, "/api/order_items/<int:order_id>")
    api.add_resource(EditOrderResource, "/api/order_items/<int:order_item_id>")
    api.add_resource(UserTransactionResource, "/api/transactions")
    api.add_resource(ManagerTransactionResource, "/api/transactions/<int:transaction_id>")
    api.add_resource(getCheckByUserID, "/api/check/<int:user_id>")
    api.add_resource(OrderItemsResource, "/api/orders/<int:order_id>/items")
    api.add_resource(getAllUsers, "/api/employees")
    return api