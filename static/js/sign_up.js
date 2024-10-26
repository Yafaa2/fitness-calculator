// a function to get element by id as to prevent repetition
function get(id) {
    return document.getElementById(id)
}


class SignUpValidation {
    //handling the cases of signup validation
    constructor() {
        this.email = get('email');
        this.emailError = get('emailError');
        this.password = get('password');
        this.passwordError = get('passwordError');
        this.confirmPassword = get('confirm_password');
        this.confirmPasswordError = get('confirmPasswordError');
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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
        if (passwordValue.length < 8) {
            return 'Password must be at least 8 characters';
        }
        if (!this.passwordRegex.test(passwordValue)){
            return "Weak Password! Your password must contain at least: 8 characters,One uppercase letter,One lowercase letter,One number,One special character (e.g., @$!%*?&)"
        }
        return "";
    }

    checkConfirmPassword() {
        const passwordValue = this.password.value.trim();
        const confirmPasswordValue = this.confirmPassword.value.trim();

        if (!confirmPasswordValue) {
            return 'Please enter the confirm password';
        }
        if (confirmPasswordValue !== passwordValue) {
            return "Confirm password doesn't match";
        }
        return "";
    }

    showError(element, message) {
        //showing the error messages if exists
        element.textContent = message;
    }

    clearErrors() {
        //clearing any past errors
        this.showError(this.emailError, "");
        this.showError(this.passwordError, "");
        this.showError(this.confirmPasswordError, "");
    }
}


function sign_up() {
    const email = get('email').value;
    const password = get('password').value;

    fetch('/sign_up', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    }).then(function (response) {

        if (response.ok) {
            return response.json().then(function (data) {
                alert(data.message);
                window.location.href = '/login';
            });
        } else {
            return response.json().then(function (data) {
                if (data.error) {
                    alert(data.error);
                }
            });
        }
    }).catch(function (error) {
        console.error('Error:', error);
    });
}




const validation = new SignUpValidation();

get("signUpButton").addEventListener("click", function (event) {
    event.preventDefault();

    validation.clearErrors();

    const emailError = validation.checkEmail();
    const passwordError = validation.checkPassword();
    const confirmPasswordError = validation.checkConfirmPassword();

    validation.showError(validation.emailError, emailError);
    validation.showError(validation.passwordError, passwordError);
    validation.showError(validation.confirmPasswordError, confirmPasswordError);

    if (!emailError && !passwordError && !confirmPasswordError) {
        sign_up()
    }
});

