import requests
# Example of how you could call the microservice
# Microservice endpoint
url = "http://localhost:2319/workout"

# Data payload containing the required parameters
workout = {
    "experience_level": "Beginner",
    "workout_type": "Full Body",
    "source": "json"
}

# Send POST request to the microservice
response = requests.post(url, json=workout)

# Check response status and print the result
if response.status_code == 200:
    print("Successfully retrieved workout plan:", response.json())
else:
    print("Failed to retrieve workout plan. Status Code:", response.status_code)
    print("Response:", response.text)
