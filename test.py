import subprocess

try:
    data = ['powershell', '-Command', 'Get-Process | Where-Object {$_.MainWindowTitle -ne ""} | Select-Object Id, ProcessName, MainWindowTitle']
    answers = subprocess.run(data, capture_output=True, text=True, shell=True)
    answers = answers.stdout.encode('utf8')
    print(answers)
except:
    answers = "error__"