document.addEventListener('DOMContentLoaded', function() {
    // Get the login form element
    const loginForm = document.getElementById('loginForm');

    // Add a submit event listener to the login form
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Retrieve the values from the username and password fields
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Send a POST request to the /login endpoint with the username and password
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {

            // Check if response is ok, if not, throw an error
            if (response.ok) {

                // Parse the JSON response
                return response.json();
            } else {
                return response.text().then(text => { throw new Error(text); });
            }
        })
        .then(data => {

            // Logs the success message
            console.log(data.message);

            // Save the username in session storage
            sessionStorage.setItem('username', username);

            // Redirect to main page
            window.location.href = `/main-page.html`;
        })
        .catch(error => {
            
            // Logs the error message
            console.error('Error:', error.message);
            document.getElementById('login-error-message').textContent = error.message;
        });
    });
});