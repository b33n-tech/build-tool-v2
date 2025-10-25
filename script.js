let editMode = false;

const toggleBtn = document.getElementById("toggleEdit");
const addBlockBtn = document.getElementById("addBlock");
const canvas = document.getElementById("canvas");

// Toggle mode édition
toggleBtn.addEventListener("click", () => {
    editMode = !editMode;
    addBlockBtn.classList.toggle("hidden", !editMode);
    toggleBtn.textContent = editMode ? "Passer en mode consultatif" : "Activer le mode édition";

    const blocks = document.querySelectorAll(".block");
    blocks.forEach(b => {
        if(editMode) b.classList.add("editable");
        else b.classList.remove("editable");
    });
});

// Ajouter un bloc
addBlockBtn.addEventListener("click", () => {
    createBlock("Nouveau bloc");
});

// Crée un bloc DOM
function createBlock(text){
    const block = document.createElement("div");
    block.classList.add("block");
    if(editMode) block.classList.add("editable");
    block.textContent = text;

    // Drag & Drop
    block.setAttribute("draggable", "true");

    block.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", null);
        block.classList.add("dragging");
    });

    block.addEventListener("dragend", () => {
        block.classList.remove("dragging");
    });

    canvas.appendChild(block);
    enableDragAndDrop();
}

// Drag & Drop sur canvas
function enableDragAndDrop(){
    const blocks = document.querySelectorAll(".block");

    blocks.forEach(block => {
        block.addEventListener("dragover", (e) => {
            e.preventDefault();
            const dragging = document.querySelector(".dragging");
            const bounding = block.getBoundingClientRect();
            const offset = e.clientY - bounding.top;
            if(offset > bounding.height / 2){
                block.after(dragging);
            } else {
                block.before(dragging);
            }
        });
    });
}

// Ajout initial de quelques blocs pour prototyper
createBlock("Bloc 1");
createBlock("Bloc 2");
createBlock("Bloc 3");
