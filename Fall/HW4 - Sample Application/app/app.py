import re  
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
        cursor.execute('SELECT * FROM student WHERE sname = %s AND sid = %s', (username, password))
        user = cursor.fetchone()
        if user:              
            session['loggedin'] = True
            session['userid'] = user['sid']
            session['username'] = user['sname']
            message = 'Logged in successfully!'
            return redirect(url_for('home'))
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


@app.route('/register', methods=['GET', 'POST'])
def register():
    message = ''
    if request.method == 'POST':
        sid = request.form.get('sid')
        sname = request.form.get('sname')
        bdate = request.form.get('bdate')
        dept = request.form.get('dept')
        year = request.form.get('year')
        gpa = request.form.get('gpa')

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM student WHERE sid = %s', [sid])
        account = cursor.fetchone()

        if account:
            message = 'Student ID already exists!'
        elif not sid or not sname or not bdate or not dept or not year or not gpa:
            message = 'Please fill out the form!'
        else:
            cursor.execute('INSERT INTO student VALUES (%s, %s, %s, %s, %s, %s)', (sid, sname, bdate, dept, year, float(gpa)))
            mysql.connection.commit()
            message = 'User successfully registered!'

    return render_template('register.html', message=message)

    
@app.route('/home')
@login_required
def home():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM apply JOIN company ON apply.cid = company.cid WHERE apply.sid = %s', [session['userid']])
    companies = cursor.fetchall()
    print('companies', companies)
    return render_template('home.html', companies=companies)


@app.route('/cancel_message', methods=['GET'])
@login_required
def cancel_message():
    return render_template('cancel_message.html')


@app.route('/cancel/<cid>', methods=['GET'])
@login_required
def cancel_application(cid):
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('DELETE FROM apply WHERE sid = %s AND cid = %s', (session['userid'], cid))
    rows_deleted = cursor.rowcount
    mysql.connection.commit()

    if rows_deleted > 0:
        flash('Successfully cancelled the application.', 'success')
    else:
        flash('Could not cancel the application. Maybe you did not apply for this internship?', 'danger')

    return redirect(url_for('cancel_message'))


@app.route('/apply_success', methods=['GET'])
@login_required
def apply_success():
    return render_template('apply_success.html')


@app.route('/apply', methods=['GET', 'POST'])
@login_required
def apply():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute('SELECT COUNT(*) as count FROM apply WHERE sid = %s', [session['userid']])
    count = cursor.fetchone()['count']

    if count >= 3:
        flash('You have already applied for 3 companies.', 'danger')
        return redirect(url_for('home'))

    cursor.execute('SELECT gpa FROM student WHERE sid = %s', [session['userid']])
    student_gpa = cursor.fetchone()['gpa']

    cursor.execute(
        'SELECT * FROM company '
        'WHERE cid NOT IN (SELECT cid FROM apply WHERE sid = %s) '
        'AND quota > (SELECT COUNT(*) FROM apply WHERE cid = company.cid) '
        'AND gpa_threshold <= %s',
        [session['userid'], student_gpa]
    )
    companies = cursor.fetchall()

    if request.method == 'POST':
        cid_to_apply = request.form['cid_to_apply']

        cursor.execute('SELECT * FROM apply WHERE sid = %s AND cid = %s', (session['userid'], cid_to_apply))
        existing_application = cursor.fetchone()
        
        if existing_application:
            flash('You have already applied to this company.', 'danger')
            return redirect(url_for('apply_success'))

        cursor.execute('SELECT * FROM company WHERE cid = %s', [cid_to_apply])
        company = cursor.fetchone()

        if company and company['quota'] > 0 and company['gpa_threshold'] <= student_gpa:
            cursor.execute('INSERT INTO apply (sid, cid) VALUES (%s, %s)', (session['userid'], cid_to_apply))
            mysql.connection.commit()
            flash('Successfully applied for the internship!', 'success')
            return redirect(url_for('apply_success'))
        else:
            flash('Invalid company ID or you do not meet the requirements.', 'danger')
            return redirect(url_for('apply_success'))

    return render_template('apply.html', companies=companies)


@app.route('/application_summary', methods=['GET'])
@login_required
def application_summary():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute(
        'SELECT company.cname, company.quota, company.gpa_threshold FROM apply '
        'JOIN company ON apply.cid = company.cid '
        'WHERE apply.sid = %s '
        'ORDER BY company.quota DESC', [session['userid']]
    )
    companies = cursor.fetchall()

    cursor.execute(
        'SELECT MAX(company.gpa_threshold) as max_gpa_threshold, MIN(company.gpa_threshold) as min_gpa_threshold FROM apply '
        'JOIN company ON apply.cid = company.cid '
        'WHERE apply.sid = %s', [session['userid']]
    )
    gpa_thresholds = cursor.fetchone()

    cursor.execute(
        'SELECT company.city, COUNT(*) as application_count FROM apply '
        'JOIN company ON apply.cid = company.cid '
        'WHERE apply.sid = %s '
        'GROUP BY company.city', [session['userid']]
    )
    city_counts = cursor.fetchall()

    cursor.execute(
        'SELECT MAX(company.quota) as max_quota, MIN(company.quota) as min_quota FROM apply '
        'JOIN company ON apply.cid = company.cid '
        'WHERE apply.sid = %s', [session['userid']]
    )
    quotas = cursor.fetchone()

    cursor.execute(
        'SELECT company.cname FROM apply '
        'JOIN company ON apply.cid = company.cid '
        'WHERE apply.sid = %s AND company.quota = %s', [session['userid'], quotas['max_quota']]
    )
    company_with_max_quota = cursor.fetchone()

    cursor.execute(
        'SELECT company.cname FROM apply '
        'JOIN company ON apply.cid = company.cid '
        'WHERE apply.sid = %s AND company.quota = %s', [session['userid'], quotas['min_quota']]
    )
    company_with_min_quota = cursor.fetchone()

    return render_template(
        'application_summary.html',
        companies=companies,
        gpa_thresholds=gpa_thresholds,
        city_counts=city_counts,
        company_with_max_quota=company_with_max_quota,
        company_with_min_quota=company_with_min_quota
    )


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
