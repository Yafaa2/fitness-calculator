// a function to get element by id as to prevent repetition
function get(id){
    return document.getElementById(id)
}

class LoginValidation {
    constructor() {
        this.email = get('loginEmail');
        this.emailError = get('loginEmailError');
        this.password = get('loginPassword');
        this.passwordError = get('loginPasswordError');
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    }

    checkEmail() {
        const emailValue = this.email.value.trim();  
        if (!emailValue) {
            return 'Please enter your email';
        }
        if (!this.emailRegex.test(emailValue)) {
            return 'Invalid email format';
        }
        return "";
    }

    checkPassword() {
        const passwordValue = this.password.value.trim();  
        if (!passwordValue) {
            return 'Please enter your password';
        }
        if (passwordValue.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return "";
    }

    showError(element, message) {
        element.textContent = message;
    }

    clearErrors() {
        this.showError(this.emailError, "");
        this.showError(this.passwordError, "");
    }
}

function login() {
    const email = get('loginEmail').value;
    const password = get('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, password: password})  
    }).then(function(response) {
        return response.json().then(function(data) {
            if (response.ok) {
                localStorage.setItem('userEmail', email);
                alert(data.message);  
                handlePendingSaveData(); 
                window.location.href = '/';  
            } else {
                if (data.error) {
                    alert(data.error);  
                }
            }
        });
    }).catch(function(error) {
        console.error('Error:', error);
    });
}

function handlePendingSaveData() {
    const pendingData = localStorage.getItem('pendingSaveData');
    if (pendingData) {
        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: pendingData 
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Welcome. " + data.message);
                localStorage.removeItem('pendingSaveData'); 
            } else if (data.error) {
                alert("Error saving pending data: " + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

const LogInValidation = new LoginValidation();

get("loginButton").addEventListener("click", function(event) {
    event.preventDefault();  

    LogInValidation.clearErrors();  

    const emailError = LogInValidation.checkEmail();
    const passwordError = LogInValidation.checkPassword();

    LogInValidation.showError(LogInValidation.emailError, emailError);
    LogInValidation.showError(LogInValidation.passwordError, passwordError);

    if (!emailError && !passwordError) {
        login();
    }
});