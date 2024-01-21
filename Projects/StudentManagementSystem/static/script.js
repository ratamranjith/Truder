document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        
        fetch('/login', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(message => alert(message))
        .catch(error => console.error('Error:', error));
    });
});
