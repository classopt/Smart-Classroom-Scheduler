from flask import Blueprint,request,jsonify
from flask_jwt_extended import create_access_token

from .. import db
from ..models.user import User

auth_bp = Blueprint('auth',__name__)

@auth_bp.route('/register',methods=['POST'])
def register():
    data =request.get_json()

    # Create new_user object of User Class
    new_user = User(
        username = data.get('username'),
        email = data.get('email'),
    )

     # Using Security methods
    new_user.set_password(data.get('password'))

    # Save data in database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully!'})


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # 1. Search for user by email (using .first() is critical!)
    user = User.query.filter_by(email=data.get('email')).first()

    if not user:
        return jsonify({'message': 'User with this email does not exist!'}), 404

    # 2. Check the password
    if not user.check_password(data.get('password')):
        return jsonify({'message': 'Incorrect password!'}), 401

    # 3. Create the token using the email as the identity
    token = create_access_token(identity=user.email)

    return jsonify({
        'access_token': token,
        'user': {
            'username': user.username,
            'email': user.email
        }
    }), 200
