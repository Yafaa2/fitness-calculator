"""authentecation endpoints and Backend"""
import json
from werkzeug.security import generate_password_hash
from flask import Blueprint, render_template,request,jsonify

auth = Blueprint('auth', __name__)

@auth.route('/sign_up', methods=['GET', 'POST'])
def signup_page():
    """Acquiring signup page"""
    if request.method == 'POST':
        return sign_up()
    return render_template('sign_up.html')

def sign_up():
    """Sign up authentication"""
    user_input = request.json
    email = user_input.get('email')
    password = user_input.get('password')

    # Load users from the JSON file
    try:
        with open('users.json', 'r', encoding="utf-8") as file:
            users = json.load(file)
    except FileNotFoundError:
        users = []  # Start with an empty list if the file doesn't exist
    except json.JSONDecodeError:
        return jsonify({"error": "Error reading user data."}), 500

    # Check if user already exists
    for user in users:
        if user['email'] == email:
            return jsonify({"error": "User already exists."}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Add new user to the list
    new_user = {"email": email, "password": hashed_password}
    users.append(new_user)

    # Save the updated users list back to the file
    with open('users.json', 'w', encoding="utf-8") as file:
        json.dump(users, file, indent=4)

    return jsonify({"message": "User signed up successfully!"}), 201

@auth.route('/login',mehthods = ['GET','POST'])
def login():
    """aquiring the login page"""
    return render_template('login.html')
