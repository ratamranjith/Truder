from flask import Flask, render_template, request

app = Flask(__name__)

import sqlite3

def initialize_database():
    conn = sqlite3.connect('management_system.db')
    cursor = conn.cursor()

    # Create a table for staff
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS staff (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    # Create a table for students
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            class TEXT NOT NULL,
            student_id TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    # Insert sample staff data
    cursor.execute("INSERT INTO staff (name, role, username, password) VALUES ('John Doe', 'Teacher', 'teacher2', 'password123')")

    # Insert sample student data
    cursor.execute("INSERT INTO students (name, class, student_id, password) VALUES ('Alice Smith', 'teacher1', 'student002', 'studentpass')")

    conn.commit()
    conn.close()

initialize_database()


# Routes for web application
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login_route():
    username = request.form.get('username')
    password = request.form.get('password')
    user_type = request.form.get('user_type')

    user = perform_login(username, password, user_type)

    if user:
        return f"Welcome, {user['name']}!"
    else:
        return "Invalid login credentials. Please try again."

def perform_login(username, password, user_type):
    conn = sqlite3.connect('management_system.db')
    cursor = conn.cursor()

    if user_type == 'staff':
        query = 'SELECT * FROM staff WHERE username=? AND password=?'
    elif user_type == 'student':
        query = 'SELECT * FROM students WHERE student_id=? AND password=?'
    else:
        print("Invalid user type.")
        return None

    cursor.execute(query, (username, password))
    user = cursor.fetchone()

    conn.close()

    # Check if the user exists
    if user:
        user_dict = {
            'id': user[0],
            'name': user[1],
            'role' if user_type == 'staff' else 'class': user[2],
            'username' if user_type == 'staff' else 'student_id': user[3],
        }
        return user_dict
    else:
        return None


if __name__ == '__main__':
    app.run(debug=True)
