"""Profile page endpoints and Backend"""
import json
from datetime import datetime
from flask import Blueprint,render_template,session,redirect,request,jsonify

user = Blueprint('user',__name__)

@user.route('/profile', methods=['GET', 'POST'])
def profile():
    """Profile page for logged-in users."""
    if 'user' not in session:
        return redirect('/login')

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
    """Save BMI or Calories results for the logged-in user"""
    if 'user' not in session:
        return redirect('/sign_up')

    current_user = session['user']
    result_data = request.get_json()

    try:
        with open('users.json', 'r+', encoding='utf-8') as file:
            users = json.load(file)

            user_data = None
            for user in users:
                if user['email'] == current_user:
                    user_data = user
                    break

            if user_data is None:
                return jsonify({'error': 'User not found'}), 404
            if 'bmi' not in user_data:
                user_data['bmi'] = []
            if 'calories' not in user_data:
                user_data['calories'] = []

            current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            save_title = "Untitled"

            if result_data['type'] == 'bmi':
                bmi_value = result_data['value']
                if bmi_value['bmi'] and bmi_value['classification'] != 'N/A':
                    bmi_value['date'] = current_date
                    bmi_value['title'] = save_title
                    user_data['bmi'].append(bmi_value)
                else:
                    return jsonify({'error': 'Invalid BMI result'}), 400
            elif result_data['type'] == 'calories':
                calories_value = result_data['value']

                if (calories_value.get('loseWeight') and
                    calories_value.get('maintainWeight') and
                    calories_value.get('gainWeight')):

                    calories_value['date'] = current_date
                    calories_value['title'] = save_title
                    user_data['calories'].append(calories_value)
                else:
                    return jsonify({'error': 'Please calculate your calories before saving.'}), 400

            file.seek(0)
            json.dump(users, file, indent=4)
            file.truncate()

        return jsonify({'message': 'Saved successfully!'}), 200

    except ImportError as e:
        return jsonify({'error': str(e)}), 500


@user.route('/edit', methods=['POST'])
def edit():
    """editing the title of the save"""
    if 'user' not in session:
        return redirect('/sign_up')

    current_user = session['user']
    user_edit = request.json
    edit_type = user_edit.get('type')
    new_title = user_edit.get('title')
    edit_date = user_edit.get('date')

    try:
        with open('users.json', 'r+', encoding='utf-8') as file:
            users = json.load(file)

            user_data = next((user for user in users if user['email'] == current_user), None)
            if user_data is None:
                return jsonify({'error': 'User not found'}), 404

            if edit_type == 'bmi':
                for data in user_data.get('bmi'):
                    if data.get('date') == edit_date:
                        data['title'] = new_title
                        break
                else:
                    return jsonify({'error': 'No BMI entry found for the specified date.'}), 404

            elif edit_type == 'calories':
                for data in user_data.get('calories'):
                    if data.get('date') == edit_date:
                        data['title'] = new_title
                        break
                else:
                    return jsonify({'error': 'No calories entry found for the specified date.'}), 404

            file.seek(0)
            json.dump(users, file, indent=4)
            file.truncate()

        return jsonify({'message': 'Title updated successfully'}), 200

    except ImportError as e:
        return jsonify({'error': str(e)}), 500

@user.route('/delete_account', methods=['POST'])
def delete_account():
    """Deleting the account of the user completely"""
    if 'user' not in session:
        return redirect('/sign_up')

    current_user_email = session['user']

    try:
        with open('users.json', 'r+', encoding='utf-8') as file:
            users = json.load(file)

            if not any(user['email'] == current_user_email for user in users):
                return jsonify({'error': 'No account found for this email.'}), 404

            updated_users = [user for user in users if user['email'] != current_user_email]

            
            file.seek(0)
            json.dump(updated_users, file, indent=4)
            file.truncate()

        session.pop('user', None)
        return jsonify({'message': 'Account deleted successfully'}), 200

    except ImportError as e:
        return jsonify({'error': str(e)}), 500
