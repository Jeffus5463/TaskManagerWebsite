// Import required modules
const sqlite3 = require('sqlite3');
const express = require('express');
const session = require('express-session');

// Creates an express application
const app = express();

// Port number for server
const port = 3000;

// Create a new SQLite database connection
const db = new sqlite3.Database('sampleDatabase.db');

// Middleware to parse JSON request
app.use(express.json());

// Middleware to serve static files from the directory 'public'
app.use(express.static('public'));

// Middleware for session management
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/index.html');
    }
}

// GET endpoint to fetch all tasks for the authenticated user
app.get('/tasks', isAuthenticated, (req, res) => {

    // Determine the sort order based on the query parameter
    const sortOrder = req.query.sort === 'asc' ? 'ASC' : 'DESC';

    // Get the user ID from the session
    const userId = req.session.userId;
    const sql = `SELECT * FROM tasks WHERE user_id = ? ORDER BY date ${sortOrder}`;

    // Execute the SQL query
    db.all(sql, [userId], (err, rows) => {
        if (err) {

            // Send internal server error if query fails
            res.status(500).send(err);
        } else {

            // Sends result as JSON
            res.json(rows);
        }
    });
});

// GET endpoint to fetch a specific task by ID
app.get('/tasks/:id', isAuthenticated, (req, res) => {
    const taskId = req.params.id;
    const userId = req.session.userId;

    // Fetch the task from the database based on task ID and user ID
    db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], (err, row) => {
        if (err) {
            console.error('Error fetching task details:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (row) {
                
                // Send the task details as JSON
                res.json(row);
            } else {

                // Send task not found error
                res.status(404).json({ error: 'Task not found' });
            }
        }
    });
});

// POST endpoint to add a new task
app.post('/add-task', isAuthenticated, (req, res) => {
    const { name, course, date, urgent } = req.body;
    const userId = req.session.userId;

    // Insert the new task into the database
    db.run('INSERT INTO tasks (name, course, date, urgent, user_id) VALUES (?, ?, ?, ?, ?)', [name, course, date, urgent, userId], function(err) {
        if (err) {
            console.error('Error adding task to database:', err);
            res.status(500).send(err);
        } else {
            console.log('Task added successfully');
            res.status(200).send('Task added successfully');
        }
    });
});

// PUT endpoint to modify a task by ID
app.put('/tasks/:id', isAuthenticated, (req, res) => {
    const taskId = req.params.id;
    const { name, course, urgent, date } = req.body;
    const userId = req.session.userId;

    // Update the task in the database based on task ID and user ID
    db.run('UPDATE tasks SET name = ?, course = ?, date = ?, urgent = ? WHERE id = ? AND user_id = ?', 
    [name, course, date, urgent, taskId, userId], function(err) {
        if (err) {
            console.error('Error updating task:', err);
            res.status(500).send(err);
        } else {
            console.log('Task updated successfully');
            res.status(200).send('Task updated successfully');
        }
    });
});

// DELETE endpoint to delete a task by ID
app.delete('/tasks/:id', isAuthenticated, (req, res) => {
    const taskId = req.params.id;
    const userId = req.session.userId;

    // Delete the task from the database based on task ID and user ID
    db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], function(err) {
        if (err) {
            console.error('Error deleting task:', err);
            res.status(500).send(err);
        } else {
            console.log('Task deleted successfully');
            res.status(200).send('Task deleted successfully');
        }
    });
});

// POST endpoint to register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // CHeck if username already exists in the database
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Error checking username:', err);
            return res.status(500).send('Internal Server Error');
        } 
        if (row) {
            return res.status(400).send('Username already exists');
        }

        // Insert the new user into the database
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).send('Internal Server Error');
            } 
            console.log('User registered successfully');
            return res.status(200).send('User registered successfully');
        });
    });
});

// POST endpoint to authenticate a user
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password match with a user in the database
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Error checking username:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (!row || row.password !== password) {
            return res.status(401).send('Invalid username or password');
        }

        // This stores the user ID in session
        req.session.userId = row.id;
        console.log('User authenticated successfully');
        return res.status(200).json({ message: 'User authenticated successfully', userId: row.id });
    });
});

// POST endpoint to change password
app.post('/change-password', isAuthenticated, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.userId;

    // Check if the current password matches the password in the database for the user
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // If password is not match
        if (!row || row.password !== currentPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // If password is match
        db.run('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId], function(err) {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            } 
            console.log('Password changed successfully');
            return res.status(200).json({ message: 'Password changed successfully' });
        });
    });
});

// Logs the port of the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});