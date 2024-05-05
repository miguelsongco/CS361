const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

const profileData = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html')); // Adjust the file name as needed
});

// Serve the profile.html when accessing root
app.post('/submit-profile', (req, res) => {
    // Extract user data from the request
    const { 'first-name': firstName, 'last-name': lastName, age, weight, height, gender, goal } = req.body;
    const workoutPreferences = req.body['preferences'] || [];
    const workoutDays = req.body['workout-days'] || [];

    profileData[firstName] = {
        'first-name': firstName,
        'last-name': lastName,
        age,
        weight,
        height,
        gender,
        goal,
        workoutPreferences: Array.isArray(workoutPreferences) ? workoutPreferences : [workoutPreferences],
        workoutDays: Array.isArray(workoutDays) ? workoutDays : [workoutDays]
    };

    res.redirect(`/confirmation.html?name=${encodeURIComponent(firstName)}`);
});

app.post('/update-profile', (req, res) => {
    const { 'first-name': firstName, 'last-name': lastName, age, weight, height, gender, goal } = req.body;
    const workoutPreferences = req.body['preferences'] || [];
    const workoutDays = req.body['workout-days'] || [];

    // Update the existing profile data
    profileData[firstName] = {
        'first-name': firstName,
        'last-name': lastName,
        age,
        weight,
        height,
        gender,
        goal,
        workoutPreferences: Array.isArray(workoutPreferences) ? workoutPreferences : [workoutPreferences],
        workoutDays: Array.isArray(workoutDays) ? workoutDays : [workoutDays]
    };
    // Redirect to the confirmation page with the updated profile
    res.redirect(`/confirmation.html?name=${encodeURIComponent(firstName)}`);
});

// Provide user data to the dashboard
app.get('/api/user-data', (req, res) => {
    const name = req.query.name || Object.keys(profileData)[0]; // Default to first user if no query parameter
    const user = profileData[name];
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});