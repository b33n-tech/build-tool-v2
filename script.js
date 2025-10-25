let editMode = false;

const toggleBtn = document.getElementById("toggleEdit");
const uploadSection = document.getElementById("uploadSection");
const fileInput = document.getElementById("fileInput");
const dataTable = document.getElementById("dataTable");

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

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            const text = evt.target.result;
            displayCSV(text);
        };
        reader.readAsText(file);
    }
});

function displayCSV(text){
    const rows = text.split("\n").map(r => r.split(","));
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

function makeTableEditable(){
    const tds = dataTable.querySelectorAll("tbody td");
    tds.forEach(td => {
        td.contentEditable = "true";
        td.classList.add("editable");
    });
}

function makeTableReadOnly(){
    const tds = dataTable.querySelectorAll("tbody td");
    tds.forEach(td => {
        td.contentEditable = "false";
        td.classList.remove("editable");
    });
}
