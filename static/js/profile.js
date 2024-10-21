let userEmail = localStorage.getItem('userEmail');

if (userEmail) {
        document.getElementById('userEmail').textContent = userEmail;
} else {
        document.getElementById('userEmail').textContent = 'Email not found';
}