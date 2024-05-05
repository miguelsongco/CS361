// this function to fetch user profile data based on user ID
function fetchUserProfile(userId) {
    return fetch(`/api/user-profile?userId=${userId}`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching user profile:', error);
            return null; // Return null in case of an error
        });
}

// function to populate the profile data form
function loadProfileData() {
    const userId = 'someUserId';
    fetchUserProfile(userId)
        .then(profileData => {
            if (profileData) {
                populateFieldset('preferences-fieldset', profileData.workoutPreferences, 'workout-preferences');
                populateFieldset('days-fieldset', profileData.workoutDays, 'workout-days');
            }
        });
}

// function to fill in checkboxes based on profile data
function populateFieldset(fieldsetId, data, name) {
    const fieldset = document.getElementById(fieldsetId);
    if (fieldset) {
        for (const item of data) {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = name;
            input.value = item.toLowerCase();
            input.checked = true;
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${item}`));
            fieldset.appendChild(label);
        }
    }
}

// extract workout preferences and days from the HTML page
function readPreferencesAndDays() {
    const preferencesText = document.getElementById('preferences').innerText;
    const workoutDaysText = document.getElementById('workout-days').innerText;

    return {
        preferences: preferencesText ? preferencesText.split(',').map(pref => pref.trim().toLowerCase()) : [],
        workoutDays: workoutDaysText ? workoutDaysText.split(',').map(day => day.trim().toLowerCase()) : []
    };
}

// Function to generate workout plan
function generateWorkoutPlan(preferences, days) {
    const workoutData = getWorkoutData();
    let plan = 'Your Workout Plan:<br>';

    preferences.forEach(pref => {
        const exercises = workoutData[pref] || [];
        exercises.forEach(exercise => {
            if (days.includes(exercise.day)) {
                plan += `${exercise.day}: ${exercise.exercise}, Sets: ${exercise.sets}, Reps: ${exercise.reps}<br>`;
            }
        });
    });

    return plan.length ? plan : 'No workout plan available for the selected preferences and days.';
}

// this function generates the workout data
function getWorkoutData() {
    return  {
        cardio: [
            { day: 'monday', exercise: 'Running', sets: 1, reps: '30 mins' },
            { day: 'tuesday', exercise: 'Sprints', sets: 4, reps: '5 mins' },
            { day: 'wednesday', exercise: 'Cycling', sets: 1, reps: '45 mins' },
            { day: 'thursday', exercise: 'rowing', sets: 3, reps: '10 mins' },
            { day: 'friday', exercise: 'Swimming', sets: 2, reps: '40 mins' }
        ],
        powerlifting: [
            { day: 'monday', exercise: 'Bench Press', sets: 3, reps: 5 },
            { day: 'tuesday', exercise: 'Shoulder Press', sets: 3, reps: 5 },
            { day: 'wednesday', exercise: 'Deadlift', sets: 3, reps: 8 },
            { day: 'thursday', exercise: 'Incline Bench Press', sets: 3, reps: 10 },
            { day: 'friday', exercise: 'Squats', sets: 3, reps: 8 }
        ],
        flexibility: [
            { day: 'monday', excercise: 'Hamstring Stretch', sets: 3, reps: '30 secs'},
            { day: 'tuesday', exercise: 'Butterfly Stretch', sets: 4, reps: '15 secs' },
            { day: 'wednesday', exercise: 'Dynamic Lunges', sets: 5, reps: 10 },
            { day: 'thursday', exercise: 'Seat Stretch', sets: 4, reps: '15 secs' },
            { day: 'friday', exercise: 'Hip Flexor Stretch', sets: 5, reps: '15 secs' }
        ],
        weightlifting: [
            { day: 'monday', exercise: 'Clean and Jerk', sets: 4, reps:6 },
            { day: 'tuesday', exercise: 'Snatch', sets: 4, reps: 5 },
            { day: 'wednesday', exercise: 'Power Clean', sets: 3, reps: 4 },
            { day: 'thursday', exercise: 'Clean Pull', sets: 2, reps: 3 },
            { day: 'friday', exercise: 'Hang Clean', sets: 5, reps: 10 }

        ]
    };
}
// This function handles saving the workout plan
function saveWorkoutPlan(name, plan) {
    return fetch('/api/save-workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, plan })
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error saving workout plan:', error);
    });
}

// This function handles the workout form submission
function handleWorkoutFormSubmit(event) {
    event.preventDefault();
    const { preferences, workoutDays } = readPreferencesAndDays();
    const plan = generateWorkoutPlan(preferences, workoutDays);
    const name = 'defaultUser'; // Replace with a method to get the current user's name
    saveWorkoutPlan(name, plan)
        .then(() => {
            document.getElementById('workout-suggestions').innerHTML = `<h3>Your Customized Workout Plan</h3>${plan}`;
        });
}

// Load profile data and set up the form event listener
document.addEventListener('DOMContentLoaded', loadProfileData);
document.getElementById('workout-form').addEventListener('submit', handleWorkoutFormSubmit);

