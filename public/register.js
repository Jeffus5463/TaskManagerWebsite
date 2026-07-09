document.addEventListener('DOMContentLoaded', function() {
    // Get the registration form element
    const registerForm = document.getElementById('registerForm');
    
    // Add a submit event listener to the registration form
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Retreiving the value from the username and password fields
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Send a POST request to the /register endpoint with the username and the password
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {

            // Check if response is ok, if not, throw an error
            if (response.ok) {

                // Logs the success message
                console.log('User registered successfully');

                // Redirect to the login page
                window.location.href = '/index.html';
            } else {
                response.text().then(text => {

                    // Logs the error message
                    console.error('Failed to register user:', text);
                    document.getElementById('register-error-message').textContent = text;
                });
            }
        })

        // Handles networks error
        .catch(error => console.error('Error registering user:', error));
    });
});
