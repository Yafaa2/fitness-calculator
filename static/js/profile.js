//saving user's email in the local storage to display it 

let userEmail = localStorage.getItem('userEmail');

if (userEmail) {
        document.getElementById('userEmail').textContent = userEmail;
} else {
        document.getElementById('userEmail').textContent = 'Email not found';
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        fetch('/delete_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            if (data.message) {
                alert(data.message);
                window.location.href = '/';  
            } else if (data.error) {
                alert(data.error);
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
    }
}

document.getElementById('deleteAccountButton').addEventListener('click', deleteAccount);
