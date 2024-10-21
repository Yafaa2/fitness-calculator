"""Profile page endpoints and Backend"""
import json
from flask import Blueprint,render_template,session,redirect,request,jsonify

user = Blueprint('user',__name__)

@user.route('/profile', methods=['GET', 'POST'])
def profile():
    """Profile page for logged-in users."""
    if 'user' not in session:
        return redirect('/login')  # Redirect to login page if user is not logged in.

    current_user = session['user']

    try:
        with open('users.json', 'r', encoding="utf-8") as file:
            users = json.load(file)
    except FileNotFoundError:
        return "No users found", 404

    user_data = next((user for user in users if user['email'] == current_user), None)

    if not user_data:
        return "User not found", 404

    bmi_results = user_data.get('bmi', [])
    calories_results = user_data.get('calories', [])

    return render_template('profile.html', user=current_user, bmi_results=bmi_results, calories_results=calories_results)

@user.route('/logout')
def logout():
    """Logout and clear session"""
    session.pop('user', None)
    return redirect('/')

@user.route('/save', methods=['GET', 'POST'])
def save():
    """Save BMI or Calories results for the logged-in user."""
    if 'user' not in session:
        return redirect('/sign_up')  # Redirect to sign-up page if user is not logged in.

    current_user = session['user']
    result_data = request.get_json()

    try:
        with open('users.json', 'r+', encoding='utf-8') as file:
            users = json.load(file)

            user_data = next((user for user in users if user['email'] == current_user), None)

            if user_data is None:
                return jsonify({'error': 'User not found'}), 404

            # Ensure 'bmi' and 'calories' keys exist for the user
            user_data.setdefault('bmi', [])  # Initialize bmi as an empty list if it doesn't exist
            user_data.setdefault('calories', [])  # Initialize calories as an empty list if it doesn't exist

            # Validate and save BMI data
            if result_data['type'] == 'bmi':
                bmi_value = result_data['value']
                if bmi_value['bmi'] and bmi_value['classification'] != 'N/A':
                    user_data['bmi'].append(bmi_value)
                else:
                    return jsonify({'error': 'Please calculate your BMI before saving.'}), 400

            # Validate and save Calories data
            elif result_data['type'] == 'calories':
                calories_value = result_data['value']
                if (
                    calories_value['loseWeight'] not in (None,0,'', '0', 'N/A') and
                    calories_value['maintainWeight'] not in (None, 0, '', '0', 'N/A') and
                    calories_value['gainWeight'] not in (None, 0, '', '0', 'N/A')
                ):
                    user_data['calories'].append(calories_value)
                else:
                    return jsonify({'error': 'Invalid or empty Calories result'}), 400

            file.seek(0)
            json.dump(users, file, indent=4)
            file.truncate()

        return jsonify({'message': 'Results saved successfully'}), 200

    except ImportError as e:
        return jsonify({'error': str(e)}), 500
    

