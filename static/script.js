ip = "192.168.0.24"

const wir_window = document.getElementById('wir_window');
const shutdown_window = document.getElementById('shutdown_window');
const wir_button = document.getElementById('wir');
const shutdown_button = document.getElementById('shutdown');
const taskkill_window = document.getElementById('taskkill_window');
const taskkill_button = document.getElementById('taskkill');
const taskkill_input = document.getElementById('taskkill_input');
const taskkill_name = document.getElementById('taskkill-name');
const taskkill_title = document.getElementById('taskkill-title');
const taskkill_close_app_button = document.getElementById("taskkill_close_app_button")
windows = []

var taskkill_window_open = false

windows.push(wir_window)
windows.push(shutdown_window)
windows.push(taskkill_window)

taskkill_close_app_button.disabled = true


wir_window.style.display = 'none';
shutdown_window.style.display = 'none';
taskkill_window.style.display = 'none';

function close_all_windows() {
    taskkill_window_open = false
    windows.forEach(window=>{
        window.style.display = 'none';
    })
}

wir_button.addEventListener('click', ()=>{
    close_all_windows();
    wir_window.style.display = 'block';
});


shutdown_button.addEventListener('click', ()=>{
    close_all_windows()
    shutdown_window.style.display = 'block';
});

taskkill_button.addEventListener('click', ()=>{
    close_all_windows()
    taskkill_window_open = true
    taskkill_window.style.display = 'block';
});


// ------------LOOP------------------


function loop() {
    if (taskkill_window_open) {
        let pid = taskkill_input.value.trim(); // Récupérer la valeur du PID et enlever les espaces
    
        if (Number.isInteger(parseFloat(pid))) {
            console.log(pid);
    
            fetch(`http://${ip}:5000/get_pid?pid=${pid}`, { method: 'POST' })
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                })
                .then(data => {
                    console.log(data);
                    if (data !== undefined) {
                        let nom = data[0]["nom"];
                        let titre = data[1]["titre"];
                        
                        taskkill_name.innerHTML = nom;
                        taskkill_title.innerHTML = titre;
    
                        taskkill_close_app_button.disabled = false
                    }else{
                        taskkill_name.innerHTML = "PID invalide";
                        taskkill_title.innerHTML = "PID invalide";
                        taskkill_close_app_button.disabled = true
                    }
    
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    taskkill_name.innerHTML = "PID invalide";
                    taskkill_title.innerHTML = "PID invalide";
                    taskkill_close_app_button.disabled = true
                });
        } else {
            console.log("seul les chifre sont autorise");
            taskkill_name.innerHTML = "seul les chifre sont autorise";
            taskkill_title.innerHTML = "seul les chifre sont autorise";
            taskkill_close_app_button.disabled = true
        }
    }

}

setInterval(loop, 1000);
// ------------LOOP FIN------------------

// ------------SERVER------------------

function shutdown(self) {
    self.children[2].style.right = '0';
    fetch(`http://${ip}:5000/shutdown`, { method: "POST" })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            return response.text();
        })
        .then(data => {
            console.log(data); // Afficher la réponse du serveur dans la console
            alert("Le système va s'éteindre.");
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById("wir").addEventListener("click", function() {
fetch(`http://${ip}:5000/wir`, { method: "POST" })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur réseau');
        }
        return response.json();
    })
    .then(data => {
        const processList = document.getElementById("processList");
        processList.innerHTML = "";
        data.forEach(process => {
            const listItem = document.createElement("li");

            // Création de la div pour PID
            const pidDiv = document.createElement("div");
            pidDiv.classList.add("PID");
            
            const pidHeading = document.createElement("h2");
            pidHeading.textContent = "PID";
            pidDiv.appendChild(pidHeading);
            
            const pidValue = document.createElement("p");
            pidValue.textContent = process.Id;
            pidDiv.appendChild(pidValue);

            // Création de la div pour Nom
            const nameDiv = document.createElement("div");
            nameDiv.classList.add("Nom");

            const nameHeading = document.createElement("h2");
            nameHeading.textContent = "Nom";
            nameDiv.appendChild(nameHeading);

            const nameValue = document.createElement("p");
            nameValue.textContent = process.ProcessName;
            nameDiv.appendChild(nameValue);

            // Création de la div pour Titre
            const titleDiv = document.createElement("div");
            titleDiv.classList.add("Titre");

            const titleHeading = document.createElement("h2");
            titleHeading.textContent = "Titre";
            titleDiv.appendChild(titleHeading);

            const titleValue = document.createElement("p");
            titleValue.textContent = process.MainWindowTitle;
            titleDiv.appendChild(titleValue);

            // Ajout des divs à l'élément <li>
            listItem.appendChild(nameDiv);
            listItem.appendChild(titleDiv);
            listItem.appendChild(pidDiv);

            listItem.addEventListener("click", function() {
                copy_PID(this); // Passer 'this' comme paramètre à la fonction copy_PID
            });

            // Ajout de l'élément <li> à la liste <ul>
            processList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error:', error));
});

// ------------SERVER FIN------------------

function copyTextToClipboard(text) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = text;
    messageDiv.style.position = 'absolute';
    messageDiv.style.left = '-9999px'; // Déplace l'élément hors de la vue
    document.body.appendChild(messageDiv);

    const range = document.createRange();
    range.selectNodeContents(messageDiv);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    // Exécuter la commande de copie
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    // Supprimer l'élément temporaire après un court délai
    setTimeout(function() {
        messageDiv.remove();
    }, 2000); // Supprime le message après 2 secondes

    return true; // Retourne true pour indiquer que la copie a réussi
}

function showPopup(message) {
    const popupDiv = document.createElement("div");
    popupDiv.textContent = message;
    popupDiv.classList.add("popup");
    document.body.appendChild(popupDiv);

    setTimeout(function() {
        popupDiv.remove();
    }, 2000); // Supprime la popup après 2 secondes
}



function copy_PID(self){
    pid = self.children[2].children[1].textContent;
    copyTextToClipboard(pid);
    let text = `PID ${pid} copié dans le presse-papiers`
    showPopup(text);
}

function closeApp(self){
    pid = self.parentElement.children[0].children[1].children[0].value
    console.log(pid);
    fetch(`http://${ip}:5000/close_app?pid=${pid}`, { method: "POST" })
    .catch(error => console.error('Error:', error));
    taskkill_input.value = "";
    taskkill_name.innerHTML = "";
    taskkill_title.innerHTML = "";
    showPopup("application fermer avec success!");
}