let editMode = false;

const toggleBtn = document.getElementById("toggleEdit");
const displayText = document.getElementById("displayText");
const editText = document.getElementById("editText");

toggleBtn.addEventListener("click", () => {
    editMode = !editMode;

    if(editMode){
        // Passer en mode édition
        editText.value = displayText.textContent.trim();
        displayText.classList.add("hidden");
        editText.classList.remove("hidden");
        toggleBtn.textContent = "Passer en mode consultatif";
    } else {
        // Passer en mode consultatif
        displayText.textContent = editText.value;
        editText.classList.add("hidden");
        displayText.classList.remove("hidden");
        toggleBtn.textContent = "Activer le mode édition";
    }
});
