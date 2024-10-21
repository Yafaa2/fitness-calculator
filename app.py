"""main-page endpoints and Backend"""
from flask import Flask, request, jsonify, render_template,session
from auth import auth
from user import user

app = Flask(__name__)

app.register_blueprint(auth)
app.register_blueprint(user)
app.secret_key = 'K_hedr333'


class GenderSwitch:
    """to calculate calories based on gender"""

    def __init__(self):
        self.activity_constants = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "super active": 1.9
        }

    def calculate_bmr(self, age, height, weight, gender):
        """base BMR calculation for male and female"""
        if gender.lower() == "male":
            return (10 * weight) + (6.25 * height) - (5 * age) + 5

        return (10 * weight) + (6.25 * height) - (5 * age) - 161

    def calculate_tdee(self, bmr, activity_level):
        """calculate Total Daily Energy Expenditure based on activity level"""
        activity_level_key = activity_level.lower().split(":")[0]
        return bmr * self.activity_constants.get(activity_level_key, 1.2)

@app.route("/", methods=['GET', 'POST'])
def main_page():
    """aquiring the main page"""
    if request.method == 'POST':
        return calculate_bmi()
    user_logged_in = 'user' in session
    return render_template('main_page.html', user_logged_in=user_logged_in)

def calculate_bmi():
    """BMI Calculator Endpoint"""
    data = request.json
    height = data.get('height')
    weight = data.get('weight')
    if height is None or weight is None:
        return jsonify({"error": "Missing height or weight"}), 400

    # Calculate BMI
    bmi = weight / ((height / 100) ** 2)

    if bmi < 18.5:
        classification = "Underweight"
    elif 18.5 <= bmi < 25:
        classification = "Normal weight"
    elif 25 <= bmi < 30:
        classification = "Overweight"
    else:
        classification = "Obese"

    return jsonify({
        "bmi": round(bmi, 2),
        "classification": classification
    })


@app.route('/calculate-calories', methods=['GET', 'POST'])
def calculate_calories():
    """calories Calculator endpoint"""
    main_page()
    user_data = request.json
    age = user_data['age']
    gender = user_data['gender']
    height = user_data['height']
    weight = user_data['weight']
    activity_level = user_data['activityLevel']

    if None in [age, gender, height, weight, activity_level]:
        return jsonify({"error": "Missing age, gender, height, weight, or activity level"}), 400

    gender_switch = GenderSwitch()

    # Calculate BMR based on gender
    bmr = gender_switch.calculate_bmr(age, height, weight, gender)

    # Calculate TDEE based on activity level
    tdee = gender_switch.calculate_tdee(bmr, activity_level)

    to_lose_weight = tdee - 500
    to_maintain_weight = tdee
    to_gain_weight = tdee + 500

    return jsonify({
        "To Lose Weight": round(to_lose_weight, 2),
        "To Maintain Weight": round(to_maintain_weight, 2),
        "To Gain Weight": round(to_gain_weight, 2)
    })



if __name__ == '__main__':
    app.run(debug=True)
