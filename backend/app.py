from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import bcrypt

app = Flask(__name__)
CORS(app, origins=["http://localhost:8081"])  # Allow only this origin


# Database Connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="123456",
    database="flux"
)
cursor = db.cursor(dictionary=True)  # Return results as dictionaries

try:
    db.ping(reconnect=True)
    print("Connected to the database.")
except mysql.connector.Error as err:
    print("Error connecting to MySQL:", err)


# Home Route
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to Flux Ride"})


# Register Route
@app.route('/register', methods=['POST'])
def register():
    data = request.json

    try:
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(data['password'].encode(), salt).decode()  # Convert to string

        cursor.execute(""" 
            INSERT INTO users (student_id, name, gender, email_id, password, mobile_no)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (data['student_id'], data['name'], data['gender'], data['email_id'], hashed_password, data.get('mobile_no', None)))

        db.commit()
        return jsonify({"message": "Registration Successful"}), 201

    except mysql.connector.Error as e:
        return jsonify({"message": "User already exists or invalid data"}), 400


# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    try:
        db.ping(reconnect=True)  # Ensure DB connection is active
        cursor.execute("SELECT * FROM users WHERE student_id=%s", (data['student_id'],))
        user = cursor.fetchone()

        if user:
            stored_hashed_password = user['password']

            if bcrypt.checkpw(data['password'].encode(), stored_hashed_password.encode()):  # Decode for bcrypt
                # Remove password before sending response
                del user['password']

                return jsonify({
                    "message": "Login Successful",
                    "user": user  # Send full user profile data
                }), 200
            else:
                return jsonify({"message": "Invalid Student ID or Password"}), 401
        else:
            return jsonify({"message": "User not found"}), 404

    except Exception as e:
        print("Login error:", str(e))  # Log the exact error
        return jsonify({"message": "An error occurred during login"}), 500


# Update Profile Route
@app.route('/profile/<int:student_id>', methods=['PUT'])
def update_profile(student_id):
    data = request.json

    try:
        cursor.execute("SELECT * FROM users WHERE student_id = %s", (student_id,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "User not found"}), 404

        query = """
            UPDATE users 
            SET name = %s, gender = %s, email_id = %s, mobile_no = %s 
            WHERE student_id = %s
        """
        values = (data['name'], data['gender'], data['email_id'], data['mobile_no'], student_id)

        cursor.execute(query, values)
        db.commit()

        return jsonify({"message": "Profile updated successfully"}), 200

    except Exception as e:
        print("Error updating profile:", str(e))
        return jsonify({"message": "An error occurred while updating profile"}), 500


# Create Ride Route
@app.route('/create-ride', methods=['POST'])
def create_ride():
    data = request.json

    try:
        
        cursor.execute("SELECT * FROM users WHERE student_id = %s", (data['student_id'],))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "User not found"}), 404

       
        cursor.execute("""
    INSERT INTO ride_bookings (student_id, price, available_seats, ride_date, ride_time, destination)
    VALUES (%s, %s, %s, %s, %s, %s)
""", (data['student_id'], data['price'], data['available_seats'], data['ride_date'], data['ride_time'], data['destination']))


        db.commit()

        return jsonify({"message": "Ride created successfully"}), 201

    except mysql.connector.Error as e:
        print("Error creating ride:", str(e))
        return jsonify({"message": "An error occurred while creating the ride"}), 500



@app.route('/get_rides', methods=['GET'])
def get_rides():
    student_id = request.args.get('student_id')

    try:
        cursor.execute("SELECT * FROM ride_bookings WHERE student_id = %s", (student_id,))
        rides = cursor.fetchall()

        if not rides:
            return jsonify({"message": "No rides found for this student."}), 404

        return jsonify(rides), 200

    except mysql.connector.Error as e:
        print("Error fetching rides:", str(e))
        return jsonify({"message": "An error occurred while fetching the rides"}), 500


if __name__ == '__main__':
    app.run(debug=True)
