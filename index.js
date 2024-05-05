const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Store profile and workout data in memory
const profileData = {};
const workoutPlans = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// welcome page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// Function to save or update profile data
function saveOrUpdateProfile(req, res, redirectPage) {
    const {
        'first-name': firstName,
        'last-name': lastName,
        age, weight, height, gender, goal,
        'preferences': workoutPreferences = [],
        'workout-days': workoutDays = []
    } = req.body;

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

    res.redirect(`${redirectPage}?name=${encodeURIComponent(firstName)}`);
}

// Handle profile submission
app.post('/submit-profile', (req, res) => {
    saveOrUpdateProfile(req, res, '/confirmation.html');
});

// Handle profile updates
app.post('/update-profile', (req, res) => {
    saveOrUpdateProfile(req, res, '/confirmation.html');
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

// Save workout plan
app.post('/api/save-workout-plan', (req, res) => {
    const { name, plan } = req.body;
    workoutPlans[name] = plan;
    res.status(201).json({ message: 'Workout plan saved successfully' });
});

// Fetch workout plan for a specific user
app.get('/api/get-workout-plan', (req, res) => {
    const name = req.query.name;
    const plan = workoutPlans[name];

    if (plan) {
        res.json({ plan });
    } else {
        res.status(404).json({ error: 'Workout plan not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});