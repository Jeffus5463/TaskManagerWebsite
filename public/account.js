document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    const username = sessionStorage.getItem('username');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const changePasswordError = document.getElementById('change-password-error');
    const changePasswordSuccess = document.getElementById('change-password-success');

    // Displays the username
    document.getElementById('username').textContent = username;

    // When user clicks logout in the sidebar
    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();

        // Destroy the session on the server, then redirect
        fetch('/logout', { method: 'POST' })
            .catch(error => console.error('Error logging out:', error))
            .finally(() => {
                sessionStorage.removeItem('username');
                window.location.href = 'index.html';
            });
    });

    // When user clicks on change password button
    changePasswordForm.addEventListener('submit', function(event) {
        console.log("Test")
        event.preventDefault();

        // Retrieves the values inside the current password and new password fields
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;

        // Send post request to change the password
        fetch('/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
        })
        .then(response => {

            // Parse the JSON and get status
            return response.json().then(data => ({
                status: response.status,
                body: data
            }));
        })
        .then(({ status, body }) => {

            // Handles success or error response
            if (status === 200) {
                changePasswordError.textContent = '';
                changePasswordSuccess.textContent = body.message;
            } else {
                changePasswordSuccess.textContent = '';
                changePasswordError.textContent = body.error;
            }
        })
        .catch(error => {

            // Handles fetch error
            changePasswordSuccess.textContent = '';
            changePasswordError.textContent = 'Error changing password. Please try again later.';
        });
    });
});