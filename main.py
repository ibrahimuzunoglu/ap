# client = MongoClient("mongodb://localhost:27017/")  # Veritabanı bilgileri
# db = client["database"]  # Veritabanı adı
# collection = db["deneme"]  # Koleksiyon adı


from flask import Flask, render_template, request, redirect, session
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "super_secret_key"

app.config["MONGO_URI"] = "mongodb://localhost:27017/database"
mongo = PyMongo(app)
users_collection = mongo.db.users

@app.route('/')
def index():
    if "username" in session:
        return f"Hoşgeldin, {session['username']}!"
    return redirect('/login')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hashed_password = generate_password_hash(password)

        if users_collection.find_one({"username": username}):
            return "Bu kullanıcı adı zaten alınmış!"
        
        users_collection.insert_one({
            "username": username,
            "password": hashed_password
        })
        return redirect('/login')

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = users_collection.find_one({"username": username})
        
        if user and check_password_hash(user['password'], password):
            session['username'] = username
            return redirect('/')
        else:
            return "Kullanıcı adı veya şifre yanlış!"

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/login')

if __name__ == '__main__':
    app.run(debug=True)
