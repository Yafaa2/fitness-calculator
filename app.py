"""main-page endpoints"""
from flask import Flask, request,render_template,session,redirect,url_for
from helper import calories,bmi_calculator
from auth import auth
from user import user

app = Flask(__name__)

app.register_blueprint(auth)
app.register_blueprint(user)
app.secret_key = 'K_hedr333'

@app.route("/", methods=['GET', 'POST'])
def main_page():
    """aquiring the main page"""
    if request.method == 'POST':
        return bmi_calculator()
    user_logged_in = 'user' in session
    return render_template('main_page.html', user_logged_in=user_logged_in)

@app.route('/calculate-calories', methods=['GET', 'POST'])
def calculate_calories():
    """Calories calculator endpoint"""
    if request.method == 'POST':
        return calories()
    return redirect(url_for('main_page'))


if __name__ == '__main__':
    app.run(debug=True)
