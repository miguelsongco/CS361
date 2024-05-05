// Function to fetch user profile data based on user ID
async function fetchUserProfile(userId) {
    return fetch(`/api/user-profile?userId=${userId}`)
        .then(response => response.json())
        .catch(() => null);
}

// Function to load profile data and populate the form
async function loadProfileData() {
    const userId = 'someUserId'; // Replace with the actual user ID
    const profileData = await fetchUserProfile(userId);

    if (profileData) {
        // Ensure the fieldsets exist before populating
        const preferencesFieldset = document.getElementById('preferences-fieldset');
        if (preferencesFieldset) {
            profileData.workoutPreferences.forEach(pref => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.name = 'workout-preferences';
                input.value = pref.toLowerCase();
                input.checked = true; // Automatically checked based on profile data
                label.appendChild(input);
                label.appendChild(document.createTextNode(` ${pref}`));
                preferencesFieldset.appendChild(label);
            });
        }

        const daysFieldset = document.getElementById('days-fieldset');
        if (daysFieldset) {
            profileData.workoutDays.forEach(day => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.name = 'workout-days';
                input.value = day.toLowerCase();
                input.checked = true; // Automatically checked based on profile data
                label.appendChild(input);
                label.appendChild(document.createTextNode(` ${day}`));
                daysFieldset.appendChild(label);
            });
        }
    }
}

// Load profile data once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadProfileData);

function readPreferencesAndDays() {
    const preferencesText = document.getElementById('preferences').innerText;
    const workoutDaysText = document.getElementById('workout-days').innerText;

    // Convert comma-separated values to arrays
    const preferences = preferencesText ? preferencesText.split(',').map(pref => pref.trim().toLowerCase()) : [];
    const workoutDays = workoutDaysText ? workoutDaysText.split(',').map(day => day.trim().toLowerCase()) : [];

    return { preferences, workoutDays };
}

document.getElementById('workout-form').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submitted!');

    // Use the new function to read preferences and days
    const { preferences, workoutDays } = readPreferencesAndDays();
    console.log('Preferences:', preferences);
    console.log('Days:', workoutDays);

    const plan = generateWorkoutPlan(preferences, workoutDays);
    console.log('Generated Plan:', plan);

    document.getElementById('workout-suggestions').innerHTML = `<h3>Your Customized Workout Plan</h3>${plan}`;
});

// Function to generate workout plan
function generateWorkoutPlan(preferences, days) {
    const workoutData = {
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
    let plan = 'Your Workout Plan:<br>';

    preferences.forEach(pref => {
        const exercises = workoutData[pref.toLowerCase()] || [];
        exercises.forEach(exercise => {
            if (days.includes(exercise.day)) {
                plan += `${exercise.day}: ${exercise.exercise}, Sets: ${exercise.sets}, Reps: ${exercise.reps}<br>`;
            }
        });
    });

    return plan.length ? plan : 'No workout plan available for the selected preferences and days.';
}
