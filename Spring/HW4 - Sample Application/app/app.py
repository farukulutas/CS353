import os
from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_mysqldb import MySQL
from functools import wraps
import MySQLdb.cursors

app = Flask(__name__) 

app.secret_key = 'abcdefgh'
  
app.config['MYSQL_HOST'] = 'db'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'cs353hw4db'
  
mysql = MySQL(app)  

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'loggedin' not in session:
            flash('You need to be logged in to access this page.', 'danger')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')

@app.route('/login', methods =['GET', 'POST'])
def login():
    message = ''
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        username = request.form['username']
        password = request.form['password']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM User WHERE username = % s AND password = % s', (username, password, ))
        user = cursor.fetchone()
        if user:              
            session['loggedin'] = True
            session['userid'] = user['id']
            session['username'] = user['username']
            session['email'] = user['email']
            message = 'Logged in successfully!'
            return redirect(url_for('tasks'))
        else:
            message = 'Please enter correct email / password !'
    return render_template('login.html', message = message)


@app.route('/logout')
@login_required
def logout():
    session.pop('loggedin', None)
    session.pop('userid', None)
    session.pop('username', None)
    flash('You have been logged out.', 'success')
    return redirect(url_for('login'))


@app.route('/register', methods =['GET', 'POST'])
def register():
    message = ''
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form :
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM User WHERE username = % s', (username, ))
        account = cursor.fetchone()
        if account:
            message = 'Choose a different username!'
  
        elif not username or not password or not email:
            message = 'Please fill out the form!'

        else:
            cursor.execute('INSERT INTO User (id, username, email, password) VALUES (NULL, % s, % s, % s)', (username, email, password,))
            mysql.connection.commit()
            message = 'User successfully created!'

    elif request.method == 'POST':

        message = 'Please fill all the fields!'
    return render_template('register.html', message = message)

@app.route('/tasks', methods=['GET', 'POST'])
@login_required
def tasks():
    try:
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM Task WHERE user_id = %s ORDER BY deadline ASC', (session['userid'],))
        tasks = cursor.fetchall()

        cursor.execute('SELECT * FROM Task WHERE user_id = %s AND status = "Done" ORDER BY done_time ASC', (session['userid'],))
        completed_tasks = cursor.fetchall()

        if request.method == 'POST':
            if 'add_task' in request.form:
                task_title = request.form['title']
                task_description = request.form['description']
                task_deadline = request.form['deadline']
                task_type = request.form['task_type']
                cursor.execute('INSERT INTO Task (title, description, status, deadline, creation_time, user_id, task_type) VALUES (%s, %s, "Todo", %s, NOW(), %s, %s)', (task_title, task_description, task_deadline, session['userid'], task_type))
                mysql.connection.commit()
                return redirect(url_for('tasks'))

            elif 'delete_task' in request.form:
                task_id = request.form['task_id']
                cursor.execute('DELETE FROM Task WHERE id = %s', (task_id,))
                mysql.connection.commit()
                return redirect(url_for('tasks'))

            elif 'edit_task' in request.form:
                task_id = request.form['task_id']
                task_title = request.form['title']
                task_description = request.form['description']
                task_deadline = request.form['deadline']
                task_type = request.form['task_type']
                cursor.execute('UPDATE Task SET title = %s, description = %s, deadline = %s, task_type = %s WHERE id = %s', (task_title, task_description, task_deadline, task_type, task_id))
                mysql.connection.commit()
                return redirect(url_for('tasks'))

            elif 'mark_done' in request.form:
                task_id = request.form['task_id']
                cursor.execute('UPDATE Task SET status = "Done", done_time = NOW() WHERE id = %s', (task_id,))
                mysql.connection.commit()
                return redirect(url_for('tasks'))
    except Exception as e:
        print("excepted", e)
        mysql.connection.rollback()
        tasks = []
        completed_tasks = []

    return render_template('tasks.html', tasks=tasks, completed_tasks=completed_tasks)

def format_seconds_to_dynamic(seconds):
    days, remainder = divmod(seconds, 86400)
    years, days = divmod(days, 365)
    months, days = divmod(days, 30)
    hours, remainder = divmod(remainder, 3600)
    minutes, seconds = divmod(remainder, 60)

    result = []
    
    if years > 0:
        result.append(f"{years}y")
    if months > 0:
        result.append(f"{months}m")
    if days > 0:
        result.append(f"{days}d")
    result.append(f"{hours}h {minutes}m {seconds}s")
    
    return " ".join(result)

@app.route('/analysis', methods=['GET', 'POST'])
@login_required
def analysis():
    try:
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT title, TIMESTAMPDIFF(SECOND, deadline, done_time) AS latency FROM Task WHERE user_id = %s AND status = "Done" AND done_time > deadline', (session['userid'],))
        late_tasks = cursor.fetchall()

        cursor.execute('SELECT AVG(TIMESTAMPDIFF(SECOND, creation_time, done_time)) AS avg_completion_time FROM Task WHERE user_id = %s AND status = "Done"', (session['userid'],))
        avg_completion_time = cursor.fetchone()['avg_completion_time']

        cursor.execute('SELECT task_type, COUNT(*) as count FROM Task WHERE user_id = %s AND status = "Done" GROUP BY task_type ORDER BY count DESC', (session['userid'],))
        tasks_per_type = cursor.fetchall()

        cursor.execute('SELECT title, deadline FROM Task WHERE user_id = %s AND status = "Todo" ORDER BY deadline ASC', (session['userid'],))
        uncompleted_tasks = cursor.fetchall()

        cursor.execute('SELECT title, TIMESTAMPDIFF(SECOND, creation_time, done_time) AS completion_time FROM Task WHERE user_id = %s AND status = "Done" ORDER BY completion_time DESC LIMIT 2', (session['userid'],))
        top_2_longest_tasks = cursor.fetchall()
    except Exception as e:
        print("excepted", e)
        late_tasks = []
        avg_completion_time = None
        tasks_per_type = []
        uncompleted_tasks = []
        top_2_longest_tasks = []

    # Convert seconds to years, months, days, hours, minutes, and seconds
    for task in late_tasks:
        task['latency'] = format_seconds_to_dynamic(task['latency'])

    if avg_completion_time is not None:
        avg_completion_time = format_seconds_to_dynamic(avg_completion_time)

    for task in top_2_longest_tasks:
        task['completion_time'] = format_seconds_to_dynamic(task['completion_time'])

    return render_template('analysis.html', late_tasks=late_tasks, avg_completion_time=avg_completion_time, tasks_per_type=tasks_per_type, uncompleted_tasks=uncompleted_tasks, top_2_longest_tasks=top_2_longest_tasks)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
