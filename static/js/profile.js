// a function to get element by id as to prevent repetition
function get(id) {
    return document.getElementById(id)
}

//saving user's email in the local storage to display it 
let userEmail = localStorage.getItem('userEmail');

if (userEmail) {
        get('userEmail').textContent = userEmail;
} else {
        get('userEmail').textContent = 'Email not found';
}

function deleteAccount() {
    //handilng delete account resopnse 
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

get('deleteAccountButton').addEventListener('click', deleteAccount);


function edit (){
    const newTitle = prompt("Edit title:", get('result-title').textContent.trim());
    if (newTitle) {
        
        const editType = this.getAttribute('data-type');
        const editDate = this.getAttribute('data-date');

        fetch('/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle,
                type: editType,
                date: editDate
            })
        })
        .then(response => {
            if (response.redirected){
                window.location.href = '/sign_up';
            }
            return response.json();
        })
        .then(data => {
            alert(data.message); 
            location.reload(); 
        })
        .catch(error => console.error('Error:', error));
    }
    
}

document.querySelectorAll('.edit-icon').forEach(icon => {
    icon.addEventListener('click', edit);
});
