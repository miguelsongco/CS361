# Assignment 8: "Microservice A" Implementation (Milestone #2)
 Communication Contract

# Part 1: Clear instructions for how to programmatically REQUEST data from the microservice you implemented. Include an example 
- User must import Flask, request, and json to operate the functions correctly. The file utilizes HTTP requests such as the POST method to send the data to the API.
- User must use the required URL to send data to the microservice: "http://localhost:2319/workout"
  
Required parameters:
 These parameters are needed to specify what workout plan you want:
  - data_source = "txt"    # can be either json or txt
  - experience_level = "Advanced"  # Specify the experience level: "Beginner," "Intermediate," "Advanced"
  - workout_type = "CrossFit" # Specify the type of workout: "Full Body," "CrossFit," etc.

 EXAMPLE CALL : 
- import requests
- url = "http://localhost:2319/workout"
workout = {
- "experience_level": "Beginner",
- "workout_type": "Full Body",
- "source": "json"
}
response = requests.post(url, json=workout)

if response.status_code == 200:
- print("Successfully retrieved workout plan:", response.json())
- else:
- print("Failed to retrieve workout plan. Status Code:", response.status_code)
- print("Response:", response.text)


# PART 2: Clear instructions for how to programmatically RECEIVE data from the microservice you implemented.
- Set up the environment: User needs to install pip install requests to handle import requests.
- Send request to microservice: for the user to successfully receive data, they must have the tools to send the HTTP request. Since I used Python, it's best to install the 'request' library, which you can install via pip. You then need to send an HTTP POST with all necessary data (explained within the example call) specified from the microservice. You must use the 'experience_level', 'workout_type', and 'data_source' (either json or txt), or you might have errors such as failing to retrieve the workout plan.
- To receive data: use the 'request.post()' with the variable 'workout' with specified parameters to allow a POST request to the microservice. This function operates as the URL and parameters as arguments to correctly receive the data (see example). 

# PART 3: UML Sequence Diagram

![Screenshot 2024-05-18 at 2 30 02 AM](https://github.com/miguelsongco/CS361/assets/126127866/60f82498-abfc-4b04-aeb0-92fc15fc059b)


 

