"""Profile page endpoints and Backend"""
import json
from flask import Blueprint,render_template,session,redirect,request,jsonify

user = Blueprint('user',__name__)

@user.route('/profile',methods=['GET','POST'])
def profile():
    """Profile page for logged-in users"""
    if 'user' in session:
        return render_template('profile.html', user = session['user'])
    return redirect('/login')

@user.route('/logout')
def logout():
    """Logout and clear session"""
    session.pop('user', None)
    return redirect('/')

@user.route('/save', methods=['GET', 'POST'])
def save():
    """Saving user calculations"""
    if 'user' not in session:
        return jsonify({"error": "User not logged in"}), 401

    result_data = request.json
    result_type = result_data['type']  
    result_value = result_data['value']  
    current_user = session['user']

    try:
        with open('users.json', 'r', encoding="utf-8") as file:
            users = json.load(file)
    except FileNotFoundError:
        return jsonify({"error": "User data not found."}), 500
    except json.JSONDecodeError:
        return jsonify({"error": "Error reading user data."}), 500

    user_found = False
    for user in users:
        if user['email'] == current_user:
            user_found = True
            if result_type == 'bmi':
                if 'bmi' not in user:
                    user['bmi'] = []
                user['bmi'].append(result_value)  
            elif result_type == 'calories':
                if 'calories' not in user:
                    user['calories'] = []
                user['calories'].append(result_value)
            else:
                return jsonify({"error": "Invalid result type."}), 400
            
            with open('users.json', 'w', encoding="utf-8") as file:
                json.dump(users, file, indent=4)
            return jsonify({"message": f"{result_type.capitalize()} result saved successfully!"}), 200

    if not user_found:
        return jsonify({"error": "User not found"}), 404
