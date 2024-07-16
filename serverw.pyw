from flask import Flask, render_template, jsonify
import os
import psutil
import pygetwindow as gw

app = Flask(__name__)

@app.route('/click', methods=['POST'])
def click_button():
    print("shutdown")
    os.system("shutdown /s /t 20")
    return "Le système va s'éteindre dans 20 secondes.", 200

@app.route('/')
def main_menu():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
