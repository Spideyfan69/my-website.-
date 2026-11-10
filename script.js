// Load saved students from browser storage
let students = JSON.parse(localStorage.getItem("students")) || [
    { id: 1, name: "Ana", email: "ana@gmail.com", program: "BSIT" },
    { id: 2, name: "Almeya", email: "alm@yahoo.com", program: "BSIS" },
    { id: 3, name: "Ian", email: "ian@gmail.com", program: "BSIS" }
];
let editingId = null;

const studentForm = document.getElementById("studentForm");
const studentNameInput = document.getElementById("studentName");
const studentEmailInput = document.getElementById("studentEmail");
const studentProgramInput = document.getElementById("studentProgram");
const studentTableBody = document.getElementById("studentTableBody");
const successMessage = document.getElementById("successMessage");
const submitBtn = document.getElementById("submitBtn");

// Save students to browser storage
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Render table rows
function renderTable() {
    studentTableBody.innerHTML = "";

    if (students.length === 0) {
        studentTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-500">No students found.</td></tr>`;
        return;
    }

    students.forEach((student) => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50";
        tr.innerHTML = `
            <td class="py-3 px-4">${student.name}</td>
            <td class="py-3 px-4">${student.email}</td>
            <td class="py-3 px-4">${student.program}</td>
            <td class="py-3 px-4 space-x-2">
                <button onclick="editStudent(${student.id})" class="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition">Edit</button>
                <button onclick="deleteStudent(${student.id})" class="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition">Delete</button>
            </td>
        `;
        studentTableBody.appendChild(tr);
    });
}

// Show alert message function
function showMessage(text) {
    successMessage.textContent = text;
    successMessage.classList.remove("hidden");
    setTimeout(() => {
        successMessage.classList.add("hidden");
    }, 3000);
}

// Handle Form Submit (Add or Update)
studentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = studentNameInput.value.trim();
    const email = studentEmailInput.value.trim();
    const program = studentProgramInput.value;

    if (!name || !email || !program) return;

    if (editingId !== null) {
        // Update existing student
        students = students.map(s => s.id === editingId ? { ...s, name, email, program } : s);
        showMessage("Student updated successfully.");
        editingId = null;
        submitBtn.textContent = "Add Student";
        submitBtn.classList.replace("bg-amber-600", "bg-blue-600");
        submitBtn.classList.replace("hover:bg-amber-700", "hover:bg-blue-700");
    } else {
        // Add new student
        const newStudent = {
            id: Date.now(),
            name,
            email,
            program
        };
        students.push(newStudent);
        showMessage("Student added successfully.");
    }

    saveStudents();
    renderTable();
    studentForm.reset();
});

// Edit Student
window.editStudent = function (id) {
    const student = students.find(s => s.id === id);
    if (student) {
        studentNameInput.value = student.name;
        studentEmailInput.value = student.email;
        studentProgramInput.value = student.program;
        editingId = id;
        submitBtn.textContent = "Update Student";
        submitBtn.classList.replace("bg-blue-600", "bg-amber-600");
        submitBtn.classList.replace("hover:bg-blue-700", "hover:bg-amber-700");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Delete Student
window.deleteStudent = function (id) {
    if (confirm("Are you sure you want to delete this student?")) {
        students = students.filter(s => s.id !== id);
        saveStudents();
        renderTable();
        showMessage("Student deleted successfully.");
    }
};

// Initial render on page load
renderTable();
