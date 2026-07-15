// Import required modules
<<<<<<< HEAD
require('dotenv').config();
const sqlite3 = require('sqlite3');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

// Number of salt rounds used when hashing passwords
const SALT_ROUNDS = 10;
=======
const sqlite3 = require('sqlite3');
const express = require('express');
const session = require('express-session');
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a

// Creates an express application
const app = express();

// Port number for server
<<<<<<< HEAD
const port = process.env.PORT || 3000;
=======
const port = 3000;
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a

// Create a new SQLite database connection
const db = new sqlite3.Database('sampleDatabase.db');

<<<<<<< HEAD
// Migrate any legacy plaintext passwords to bcrypt hashes on startup.
// Bcrypt hashes always start with one of these prefixes, so anything
// that doesn't match is assumed to be an old plaintext password.
function migratePlaintextPasswords() {
    db.all('SELECT id, password FROM users', [], (err, rows) => {
        if (err) {
            console.error('Error reading users for password migration:', err);
            return;
        }
        rows.forEach(row => {
            const looksHashed = /^\$2[aby]\$/.test(row.password);
            if (!looksHashed) {
                bcrypt.hash(row.password, SALT_ROUNDS, (hashErr, hash) => {
                    if (hashErr) {
                        console.error(`Error hashing password for user ${row.id}:`, hashErr);
                        return;
                    }
                    db.run('UPDATE users SET password = ? WHERE id = ?', [hash, row.id], updateErr => {
                        if (updateErr) {
                            console.error(`Error saving hashed password for user ${row.id}:`, updateErr);
                        } else {
                            console.log(`Migrated plaintext password for user ${row.id} to bcrypt.`);
                        }
                    });
                });
            }
        });
    });
}
migratePlaintextPasswords();

if (!process.env.SESSION_SECRET) {
    console.warn('WARNING: SESSION_SECRET is not set in the environment. Using an insecure default for local development only. Set SESSION_SECRET in a .env file before deploying.');
}

=======
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
// Middleware to parse JSON request
app.use(express.json());

// Middleware to serve static files from the directory 'public'
app.use(express.static('public'));

// Middleware for session management
app.use(session({
<<<<<<< HEAD
    secret: process.env.SESSION_SECRET || 'dev_only_insecure_secret',
=======
    secret: 'your_secret_key',
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
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
<<<<<<< HEAD
            console.error('Error fetching tasks:', err);
            res.status(500).json({ error: 'Internal Server Error' });
=======
            res.status(500).send(err);
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
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
<<<<<<< HEAD
            res.status(500).json({ error: 'Internal Server Error' });
=======
            res.status(500).send(err);
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
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
<<<<<<< HEAD
            res.status(500).json({ error: 'Internal Server Error' });
=======
            res.status(500).send(err);
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
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
<<<<<<< HEAD
            res.status(500).json({ error: 'Internal Server Error' });
=======
            res.status(500).send(err);
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
        } else {
            console.log('Task deleted successfully');
            res.status(200).send('Task deleted successfully');
        }
    });
});

// POST endpoint to register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;

<<<<<<< HEAD
    // Basic server-side validation (client-side checks can be bypassed)
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    if (password.length < 8) {
        return res.status(400).send('Password must be at least 8 characters long');
    }

=======
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
    // CHeck if username already exists in the database
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Error checking username:', err);
            return res.status(500).send('Internal Server Error');
<<<<<<< HEAD
        }
=======
        } 
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
        if (row) {
            return res.status(400).send('Username already exists');
        }

<<<<<<< HEAD
        // Hash the password before storing it - never store plaintext passwords
        bcrypt.hash(password, SALT_ROUNDS, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Error hashing password:', hashErr);
                return res.status(500).send('Internal Server Error');
            }

            // Insert the new user into the database
            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
                if (err) {
                    console.error('Error registering user:', err);
                    return res.status(500).send('Internal Server Error');
                }
                console.log('User registered successfully');
                return res.status(200).send('User registered successfully');
            });
=======
        // Insert the new user into the database
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).send('Internal Server Error');
            } 
            console.log('User registered successfully');
            return res.status(200).send('User registered successfully');
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
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
<<<<<<< HEAD
        if (!row) {
            return res.status(401).send('Invalid username or password');
        }

        // Compare the submitted password against the stored bcrypt hash
        bcrypt.compare(password || '', row.password, (compareErr, matches) => {
            if (compareErr) {
                console.error('Error verifying password:', compareErr);
                return res.status(500).send('Internal Server Error');
            }
            if (!matches) {
                return res.status(401).send('Invalid username or password');
            }

            // This stores the user ID in session
            req.session.userId = row.id;
            req.session.username = row.username;
            console.log('User authenticated successfully');
            return res.status(200).json({ message: 'User authenticated successfully', userId: row.id, username: row.username });
        });
    });
});

// POST endpoint to log out the current user
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully' });
=======
        if (!row || row.password !== password) {
            return res.status(401).send('Invalid username or password');
        }

        // This stores the user ID in session
        req.session.userId = row.id;
        console.log('User authenticated successfully');
        return res.status(200).json({ message: 'User authenticated successfully', userId: row.id });
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
    });
});

// POST endpoint to change password
app.post('/change-password', isAuthenticated, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.userId;

<<<<<<< HEAD
    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

=======
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
    // Check if the current password matches the password in the database for the user
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
<<<<<<< HEAD
        if (!row) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Compare the submitted current password against the stored bcrypt hash
        bcrypt.compare(currentPassword || '', row.password, (compareErr, matches) => {
            if (compareErr) {
                console.error('Error verifying password:', compareErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (!matches) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }

            // Hash the new password before storing it
            bcrypt.hash(newPassword, SALT_ROUNDS, (hashErr, hashedPassword) => {
                if (hashErr) {
                    console.error('Error hashing new password:', hashErr);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], function(updateErr) {
                    if (updateErr) {
                        console.error('Error updating password:', updateErr);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    console.log('Password changed successfully');
                    return res.status(200).json({ message: 'Password changed successfully' });
                });
            });
=======

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
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
        });
    });
});

// Logs the port of the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});