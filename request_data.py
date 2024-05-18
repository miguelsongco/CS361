# Author: Miguel Songco
# CS 361: Software Engineering
# Microservice A
# Description: This is a programmed test to validate the workoutgenerator microservice for both txt and json file workouts and correctly displays the workouts and returns


import requests

# The URL of the Flask microservice endpoint where we send our requests
workout_plan_request_url = "http://localhost:2319/workout"


# specify what kind of workout plan we are looking for, essentially how to call specific data from the microservice
data_source = "txt"    # can be either json or txt
experience_level = "Advanced"  # Specify the experience level: "Beginner", "Intermediate", "Advanced"
workout_type = "CrossFit"  # Specify the type of workout: "Full Body", "CrossFit", etc.


# Package the data into a dictionary to send as either txt or json
request_data = {
    "experience_level": experience_level,
    "workout_type": workout_type,
    "source": data_source 
}

try:
    # Send POST request to the server with the specified request data
    workout_data = requests.post(workout_plan_request_url, json=request_data)
    
    # Check the status code of the response to determine if the request was successful
    if workout_data.status_code == 200:
        # If the response status code is 200, it means the request was successful
        print(workout_data.json())
    else:
        # If the status code is not 200, print the error status
        print(f"Failed to get data: {workout_data.status_code} {workout_data.text}")

except requests.exceptions.RequestException as e:
    # If an error occurs during the request, print an error message
    print(f"An error occurred: {e}")