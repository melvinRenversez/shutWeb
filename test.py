import subprocess

# Définir l'ID de processus que vous souhaitez identifier
pid = 11

# Commande PowerShell à exécuter
command = f"Get-Process -Id {pid} | Select-Object Id, ProcessName, MainWindowTitle | Format-List"

result = ""

# Exécuter la commande PowerShell depuis Python
try:
    result = subprocess.run(["powershell", "-Command", command], capture_output=True, text=True, check=True)
    # Afficher la sortie de la commande
    print(result.stdout)

    # Vérifier si la sortie contient des informations sur le processus
    if "Id" not in result.stdout:
        print(f"Aucun processus trouvé avec l'ID {pid}")
    else:
        x = result.stdout.split("\n")
        x = [line for line in x if line.strip() != ""]

        # Maintenant x ne contient que les lignes non vides
        for line in x:
            print(line)

        nom = x[1].split(":")[1].strip() if len(x) > 1 else "N/A"
        titre = x[2].split(":")[1].strip() if len(x) > 2 else "N/A"

        print(f"Nom du processus : {nom}, Titre de la fenêtre : {titre}")

except subprocess.CalledProcessError as e:
    print(f"Erreur lors de l'exécution de la commande PowerShell : {e}")
