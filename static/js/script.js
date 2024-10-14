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
