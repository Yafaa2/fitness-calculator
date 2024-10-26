"""file for helper functions"""

from flask import jsonify,request

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
        self.default_activity_level = "sedentary"

    def calculate_bmr(self, age, height, weight, gender):
        """base basal metabolic rate calculation for male and female"""
        if gender.lower() == "male":
            return (10 * weight) + (6.25 * height) - (5 * age) + 5

        return (10 * weight) + (6.25 * height) - (5 * age) - 161

    def calculate_tdee(self, basal_metabolic_rate, activity_level = None):
        """calculate Total Daily Energy Expenditure based on activity level"""
        if activity_level is None:
            activity_level = self.default_activity_level

        activity_level_key = activity_level.lower().split(":")[0]
        return basal_metabolic_rate * self.activity_constants[activity_level_key]

def calories():
    """calories calculator formulas"""
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
    basal_metabolic_rate = gender_switch.calculate_bmr(age, height, weight, gender)

    # Calculate total daily energy expenditure based on activity level
    total_daily_energy_expenditure = gender_switch.calculate_tdee(basal_metabolic_rate, activity_level)

    to_lose_weight = total_daily_energy_expenditure - 500
    to_maintain_weight = total_daily_energy_expenditure
    to_gain_weight = total_daily_energy_expenditure + 500

    return jsonify({
        "To Lose Weight": round(to_lose_weight, 2),
        "To Maintain Weight": round(to_maintain_weight, 2),
        "To Gain Weight": round(to_gain_weight, 2)
    })

def bmi_calculator():
    """calories bmi formulas"""
    data = request.json
    height = data.get('height')
    weight = data.get('weight')
    if height is None or weight is None:
        return jsonify({"error": "Missing height or weight"}), 400


    bmi = weight / ((height / 100) ** 2)
    # returning classification based on range
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