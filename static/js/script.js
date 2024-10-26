// a function to get element by id as to prevent repetition
function get(id) {
    return document.getElementById(id)
}

//fetching the BMI response data from the backend
function calculateBMI() {
  let height = parseFloat(get('bmiHeight').value);
    let weight = parseFloat(get('bmiWeight').value);

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight.');
        return;
    }

    if (height > 250 || height < 60 ) {
        alert('Heigth can not be under 60 or above 250');
        return;
    }

    if ( weight > 500 || weight < 30  ) {
        alert('Weigth can not be under 30 or above 500');
        return;
    }

    fetch('/', { 
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ height: height, weight: weight }) 
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        get('bmiResult').textContent = data.bmi;
        get('bmiClassification').textContent = data.classification;
    })
    .catch(function(error) {
        console.error('Error:', error);  
    });
}
get('calculateBMI').addEventListener('click', calculateBMI);

//fetching the Calories response data from the backend
function calculateCalories() {
    let age = get('caloriesAge').value.trim();
    let gender = document.querySelector('input[name="gender"]:checked');
    let height = get('caloriesHeight').value.trim();
    let weight = get('caloriesWeight').value.trim();
    let activityLevel = get('activityLevel').value;


    if (!age || !height || !weight || !gender) {
        alert('Please enter valid inputs for age, height, weight, and select gender and activity');
        return;
    }


    age = parseFloat(age);
    height = parseFloat(height);
    weight = parseFloat(weight);


    if ([age, height, weight].some(item => isNaN(item))) {
        alert('Please enter valid numerical inputs');
        return;
    }

    if (height > 250 || height < 60 ) {
        alert('Heigth can not be under 60 or above 250');
        return;
    }

    if ( weight > 500 || weight < 30  ) {
        alert('Weigth can not be under 30 or above 500');
        return;
    }
    if (age > 120) {
        alert('Age can not above 120');
        return;
    }

    fetch('/calculate-calories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age: age, gender: gender.value, height: height, weight: weight, activityLevel: activityLevel })
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (user_data) {
            get('caloriesLoseWeight').textContent = user_data["To Lose Weight"] + ' Calories';
            get('caloriesMaintainWeight').textContent = user_data["To Maintain Weight"] + ' Calories';
            get('caloriesGainWeight').textContent = user_data["To Gain Weight"] + ' Calories';
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

get('calculateCalories').addEventListener('click', calculateCalories);


//Switch Button Implementation
class Show {
    //implementing class for switching between calculators
    constructor(bmiDisplay, caloriesDisplay, switchButtonDisplay, currentCalculatorDisplay) {
        this.bmi = get(bmiDisplay);
        this.calories = get(caloriesDisplay);
        this.switchButton = get(switchButtonDisplay);
        this.currentCalculator = get(currentCalculatorDisplay);
    }

    showCalories() {

        this.bmi.style.display = 'none';
        this.calories.style.display = 'block';
        this.switchButton.textContent = 'Switch to BMI Calculator';
        this.currentCalculator.textContent = 'Calories';
    }

    showBMI() {

        this.bmi.style.display = 'block';
        this.calories.style.display = 'none';
        this.switchButton.textContent = 'Switch to Calories Calculator';
        this.currentCalculator.textContent = 'BMI';
    }
}

const switchCalculators = new Show('bmiCalculator', 'caloriesCalculator', 'switchButton', 'currentCalculator');

let isBMICalculatorVisible = true;

function switchNow() {
    //conditioning to switch between calculators

    if (isBMICalculatorVisible) {
        switchCalculators.showCalories();
    } else {
        switchCalculators.showBMI();
    }
    //flag to remember the current state
    isBMICalculatorVisible = !isBMICalculatorVisible;
}

get('switchButton').addEventListener('click', switchNow)

//clear button implementation

function clearBMI() {
    //clear bmi text fields
    get('bmiHeight').value = '';
    get('bmiWeight').value = '';
    get('bmiResult').innerText = '0';
    get('bmiClassification').innerText = '';
}

get('clearBMI').addEventListener('click', clearBMI)

function clearCalories() {
    //clear calories text fields
    get('caloriesAge').value = '';
    get('caloriesHeight').value = '';
    get('caloriesWeight').value = '';
    get('activityLevel').selectedIndex = 0;
    get('caloriesLoseWeight').innerText = '';
    get('caloriesMaintainWeight').innerText = '';
    get('caloriesGainWeight').innerText = '';

    const Radios = document.getElementsByName('gender');
    for (let i = 0; i < Radios.length; i++) {
        Radios[i].checked = false;
    }
}
get('clearCalories').addEventListener('click', clearCalories)


function save(calculatorType) {
    //handling save resopnse related to each calculator
    let resultData = {};

    if (calculatorType === 'bmi') {
        let bmiValue = get("bmiResult").innerText.trim();
        let bmiClassification = get("bmiClassification").innerText.trim();

        if (!bmiValue || bmiValue === "0" || !bmiClassification || bmiClassification === "N/A") {
            alert('Please calculate your BMI before saving.');
            return;
        }

        resultData = {
            type: 'bmi',
            value: {
                bmi: bmiValue,
                classification: bmiClassification
            }
        };
    } else if (calculatorType === 'calories') {
        let caloriesLoseWeight = get("caloriesLoseWeight").innerText.trim();
        let caloriesMaintainWeight = get("caloriesMaintainWeight").innerText.trim();
        let caloriesGainWeight = get("caloriesGainWeight").innerText.trim();

        if (!caloriesLoseWeight || caloriesLoseWeight === "Calories" ||
            !caloriesMaintainWeight || caloriesMaintainWeight === "Calories" ||
            !caloriesGainWeight || caloriesGainWeight === "Calories") {
            alert('Please calculate your calories before saving.');
            return;
        }

        resultData = {
            type: 'calories',
            value: {
                loseWeight: caloriesLoseWeight,
                maintainWeight: caloriesMaintainWeight,
                gainWeight: caloriesGainWeight
            }
        };
    }

    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resultData)
    })
    .then(response => {
        if (response.redirected) {
            localStorage.setItem('pendingSaveData', JSON.stringify(resultData)); //saving the results in the local storage if redirected to the sign up to save it after
            window.location.href = '/sign_up';
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

get('saveBmiButton').addEventListener('click', function () {
    save('bmi');
});

get('saveCaloriesButton').addEventListener('click', function () {
    save('calories');
});

