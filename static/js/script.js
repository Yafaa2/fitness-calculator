// a function to get element by id as to prevent repetition
function get(id){
    return document.getElementById(id)
}

//a function to fetch the response data from the backend
function calculateBMI() {
    let height = parseFloat(get('bmiHeight').value);
    let weight = parseFloat(get('bmiWeight').value);

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
        get('bmiResult').textContent = data.bmi;
        get('bmiClassification').textContent = data.classification;
    })
    .catch(function(error) {
        console.error('Error:', error);  
    });
}

get('calculateBMI').addEventListener('click', calculateBMI);


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

get('switchButton').addEventListener('click',switchNow)

//clear button implementation
function clearBMI (){
    get('bmiHeight').value = '';
    get('bmiWeight').value = '';
    get('bmiResult').innerText = '0';
    get('bmiClassification').innerText= '';
}

get('clearBMI').addEventListener('click',clearBMI)

function clearCalories (){

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
get('clearCalories').addEventListener('click',clearCalories)