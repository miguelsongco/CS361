# Author: Miguel Songco
# CS 361: Software Engineering
# Microservice A
# Description: This microservice, implemented using Flask, is designed to handle workout generation requests. 
# It supports POST, PUT, and GET methods to manage workout plans based on user inputs such as experience level and workout
# type. The microservice can fetch workout data from a JSON file or a TXT file as specified by the 'source' parameter in the request.

from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route("/workout", methods=['POST'])
def handle_workout():
    # Extract parameters directly from the request JSON
    data = request.get_json()  # Get the entire JSON body
    received_experience = data.get("experience_level")
    workout_type = data.get("workout_type")
    data_source = data.get("source")

    # Validate the inputs
    if not all([received_experience, workout_type, data_source]):
        return jsonify({"message": "Missing required parameters"}), 400

    # Call the appropriate function based on the data source
    if data_source == "json":
        return fetch_from_json(received_experience, workout_type)
    elif data_source == "txt":
        return fetch_from_txt(received_experience, workout_type)
    else:
        return jsonify({"message": "Invalid data source."}), 400


# fetch data from json file
def fetch_from_json(experience, workout_type):
    try:
        with open("workouts.json", 'r') as file:
            data = json.load(file)
            for workout in data['workouts']:
                if workout['experience_level'] == experience and workout['workout_type'] == workout_type:
                    # Print the found workout details
                    print("Found workout details (JSON):", workout)
                    return jsonify(workout)
        return jsonify({'message': 'Workout plan not found.'}), 404
    except FileNotFoundError:
        return jsonify({'message': 'File not found.'}), 404
    except json.JSONDecodeError:
        return jsonify({'message': 'Error processing JSON data.'}), 500


# fetch data from txt file (acts as a backup for teammates who prefer to communicate through txt files)
def fetch_from_txt(experience, workout_type):
    try:
        with open("workouts.txt", 'r') as file:
            lines = file.readlines()
            for i, line in enumerate(lines):
                if f"Experience Level: {experience}" in line and f"Workout Type: {workout_type}" in lines[i+1]:
                    workout_details = lines[i+2:i+5]

                    # Print the found workout details
                    print("Found workout details (TXT):", workout_details)

                    # Create a structured response
                    exercises = []
                    for detail in workout_details:
                        parts = detail.strip().split(', ')
                        exercise = {part.split(': ')[0]: part.split(': ')[1] for part in parts}
                        exercises.append(exercise)
                    
                    response = {
                        "experience_level": experience,
                        "workout_type": workout_type,
                        "exercises": exercises
                    }
                    
                    # Print the structured response
                    print(response)
                    return jsonify(response)
    except FileNotFoundError:
        return jsonify({'error: workout not found'}), 404

if __name__ == "__main__":
    app.run(debug=True, port=2319)