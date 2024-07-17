from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import subprocess

import os

os.system('cls')

app = Flask(__name__)
CORS(app)

@app.route('/shutdown', methods=['POST'])
def click_button():
    print("shutdown")
    subprocess.run(["shutdown", "/s", "/t", "20000"])
    return "Le système va s'éteindre.", 200


@app.route('/wir', methods=['POST'])
def wir():
    print("wir")
    cmd = ['powershell', '-Command', 'Get-Process | Where-Object {$_.MainWindowTitle -ne ""} | Select-Object Id, ProcessName, MainWindowTitle']
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        output_lines = result.stdout.strip().split('\n')
        process_list = []
        for line in output_lines[2:]:  # Skip the headers and process details
            # Split by multiple spaces to handle variable spaces between columns
            parts = line.split(None, 2)
            if len(parts) == 3:
                pid, name, title = parts
                process_list.append({
                    'Id': pid.strip(),
                    'ProcessName': name.strip(),
                    'MainWindowTitle': title.strip()
                })
            else:
                app.logger.error(f"Unexpected output format: {line}")
        return jsonify(process_list), 200
    else:
        return jsonify({'error': 'Failed to retrieve process list'}), 500

@app.route('/get_pid', methods=['POST'])
def get_pid():
    pid = request.args.get('pid')
    if pid:
        command = f"Get-Process -Id {pid} | Select-Object Id, ProcessName, MainWindowTitle | Format-List"

        try:
            result = subprocess.run(["powershell", "-Command", command], capture_output=True, text=True, check=True)
            x = result.stdout.split("\n")
            x = [line for line in x if line.strip() != ""]

            nom = x[1].split(":")[1]
            titre = x[2].split(":")[1]

            return jsonify({"nom" :nom},{"titre": titre}), 200
        
        except subprocess.CalledProcessError as e:

            return "Error", 404


    else:
        return "Aucun PID reçu", 400
    
@app.route('/close_app', methods=['POST'])
def close_app():
    pid = request.args.get('pid')
    print(f"____________________{pid}____________________")

    if pid:
        try:
            subprocess.run(["taskkill", "/F", "/PID", pid], check=True)
            return "Application fermée avec succès", 200
        except subprocess.CalledProcessError as e:
            return f"Erreur lors de la fermeture de l'application : {e}", 500
    else:
        return "Aucun PID reçu", 400

@app.route('/')
def main_menu():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
