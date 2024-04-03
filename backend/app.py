from flask import Flask, request, jsonify
from firebase_auth import auth
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)


#user passwords are all 123456
# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    try:
        print("HERE")
        email = request.json.get('email')
        password = request.json.get('password')
        print(email, password)
        user = auth.create_user_with_email_and_password(email, password)

        # find way to print out user id, then store ids in doc
        return jsonify({'message': 'Signup successful'})
    except Exception as e:
        print(str(e))
        print(request.data.decode())
        return jsonify({'error': str(e)}), 400

# Login route
@app.route('/login', methods=['POST'])
def login():
    print("HERE")
    email = request.form['email']
    password = request.form['password']
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        return jsonify({'message': 'Login successful'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Dummy data route
@app.route('/data')
def get_time():
    # Returning dummy data
    return {
        'Name': "geek",
        "Age": "22",
        "Date": 'x',
        "programming": "python"
    }

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
