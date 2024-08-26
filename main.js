let toDoList = [];

// Adding a new note to the list
function addNote(event) {
    event.preventDefault(); // Prevent form from submitting and page refreshing

    const noteBox = document.getElementById("noteBox");
    const timeBox = document.getElementById("timeBox");

    const note = noteBox.value;
    const time = timeBox.value;

    // Validation
    const noteError = document.getElementById("noteError");
    const timeError = document.getElementById("timeError");

    noteError.innerText = "";
    timeError.innerText = "";

    if (!note) {
        noteError.innerText = "Please enter a note.";
        noteBox.focus();
        return;
    }
    if (!time) {
        timeError.innerText = "Please enter due date & time.";
        timeBox.focus();
        return;
    }

    const selectedTime = new Date(time);
    const currentTime = new Date();

    if (selectedTime <= currentTime) {
        timeError.innerText = "Please select a future due date.";
        timeBox.focus();
        return;
    }

    // Clear inputs
    noteBox.value = "";
    timeBox.value = "";

    // Add item to the list
    const item = { note, time };
    toDoList.push(item);

    // Save and display
    saveToStorage();
    lastAddedNote = toDoList.length - 1;
    displayToDoList();
}

// Save to local storage
function saveToStorage() {
    const json = JSON.stringify(toDoList);
    localStorage.setItem("toDoList", json);
}

// Load from local storage
async function loadToStorage() {
    const json = localStorage.getItem("toDoList");
    if (json) {
        toDoList = JSON.parse(json);
    } else {
        toDoList = [];
    }
}

// Checking if last added note / page refreshed for fade-in
let lastAddedNote = null;
let isPageRefreshed = true;

// Display list
function displayToDoList() {
    const container = document.getElementById("container");
    let html = "";

    for (let i = 0; i < toDoList.length; i++) {
        const time = new Date(toDoList[i].time);

        // Fade-in effect when a single note is added
        const isLastAdded = i === lastAddedNote;
        const fadeInClass = isLastAdded ? "fadeIn" : "";

        html += `
            <div class="noteDiv ${fadeInClass}">
                <div>${toDoList[i].note}</div>
                <div class="dateTime">
                    ${time.toLocaleTimeString()}<br>
                    ${time.toLocaleDateString()}
                </div>
                <i class="bi-check-circle" onclick="deleteMe(${i})"></i>
            </div>
        `;
    }

    container.innerHTML = html;

    // Reset lastAddedNote / page refresh
    lastAddedNote = null;
    isPageRefreshed = false;
}

// Delete note
function deleteMe(index) {
    if (!confirm("Are you sure you want to delete this note?")) {
        return;
    }

    const wasLastDeleted = index === lastAddedNote;
    const noteDiv = document.querySelectorAll('.noteDiv')[index];
    noteDiv.classList.add('fadeOut');

    setTimeout(() => {
        // Delete note from array
        toDoList.splice(index, 1);

        saveToStorage();
        displayToDoList();

        if (wasLastDeleted && toDoList.length > 0) {
            lastAddedNote = toDoList.length - 1;
        }
    }, 1000);
}

// Load the list on page load
async function loadToDoList() {
    await loadToStorage();
    displayToDoList();
}

// Call loadToDoList when the page loads
document.addEventListener("DOMContentLoaded", loadToDoList);
