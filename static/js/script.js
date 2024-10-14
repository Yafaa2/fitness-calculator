//A function to fetch the response data from the backend

function calculateBMI() {
    let height = parseFloat(document.getElementById('bmiHeight').value);
    let weight = parseFloat(document.getElementById('bmiWeight').value);

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight.');
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
        document.getElementById('bmiResult').textContent = data.bmi;
        document.getElementById('bmiClassification').textContent = data.classification;
    })
    .catch(function(error) {
        console.error('Error:', error);  
    });
}

// Event listener for button click
document.getElementById('calculateBMI').addEventListener('click', calculateBMI);


//Switch Button Implementation
class Show {
    //implementing class for switching between calculators
    constructor(bmiDisplay, caloriesDisplay, switchButtonDisplay, currentCalculatorDisplay) {
        this.bmi = document.getElementById(bmiDisplay);
        this.calories = document.getElementById(caloriesDisplay);
        this.switchButton = document.getElementById(switchButtonDisplay);
        this.currentCalculator = document.getElementById(currentCalculatorDisplay);
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

function switchNow () {
    //conditioning to switch between calculators

    if (isBMICalculatorVisible){
        switchCalculators.showCalories();
    }else{
        switchCalculators.showBMI();
    }
    // Toggling the flag to remember the current state
    isBMICalculatorVisible = !isBMICalculatorVisible;  
}

document.getElementById('switchButton').addEventListener('click',switchNow)