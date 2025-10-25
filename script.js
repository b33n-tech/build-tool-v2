let editMode = false;

const toggleBtn = document.getElementById("toggleEdit");
const uploadSection = document.getElementById("uploadSection");
const fileInput = document.getElementById("fileInput");
const dataTable = document.getElementById("dataTable");

// Toggle édition / consultatif
toggleBtn.addEventListener("click", () => {
    editMode = !editMode;
    uploadSection.classList.toggle("hidden", !editMode);
    toggleBtn.textContent = editMode ? "Passer en mode consultatif" : "Activer le mode édition";
    if(editMode){
        makeTableEditable();
    } else {
        makeTableReadOnly();
    }
});

// Gestion des fichiers
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    if(file.name.endsWith(".csv")){
        reader.onload = function(evt){
            const text = evt.target.result;
            displayArray(csvToArray(text));
        };
        reader.readAsText(file);
    } else if(file.name.endsWith(".xlsx")) {
        reader.onload = function(evt){
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, {type:"array"});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, {header:1});
            displayArray(json);
        };
        reader.readAsArrayBuffer(file);
    }
});

// Convert CSV en tableau
function csvToArray(text){
    return text.trim().split("\n").map(row => row.split(","));
}

// Affichage du tableau
function displayArray(rows){
    const thead = dataTable.querySelector("thead");
    const tbody = dataTable.querySelector("tbody");
    thead.innerHTML = "";
    tbody.innerHTML = "";

    if(rows.length > 0){
        const headerRow = document.createElement("tr");
        rows[0].forEach(cell => {
            const th = document.createElement("th");
            th.textContent = cell;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        rows.slice(1).forEach(r => {
            const tr = document.createElement("tr");
            r.forEach(cell => {
                const td = document.createElement("td");
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    if(editMode) makeTableEditable();
}

// Mode édition
function makeTableEditable(){
    const tds = dataTable.querySelectorAll("tbody td");
    tds.forEach(td => {
        td.contentEditable = "true";
        td.classList.add("editable");
    });
}

// Mode consultatif
function makeTableReadOnly(){
    const tds = dataTable.querySelectorAll("tbody td");
    tds.forEach(td => {
        td.contentEditable = "false";
        td.classList.remove("editable");
    });
}
