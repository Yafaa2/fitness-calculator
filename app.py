"""app Backend"""


from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def main_page():
    """aquiring the main page"""
    if request.method == 'POST':
        return calculate_bmi()
    return render_template('main_page.html')

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

if __name__ == '__main__':
    app.run(debug=True)
