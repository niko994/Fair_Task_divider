document.getElementById('divideButton').addEventListener('click', divideTasks);

function divideTasks() {
    let employeeInput = document.getElementById('employeeNames').value.trim();
    let taskInput = document.getElementById('taskInput').value.trim();
    let employeeError = document.getElementById('employeeError');
    let taskError = document.getElementById('taskError');
    
    employeeError.style.display = "none";
    taskError.style.display = "none";

    // Validate employees
    let employees = employeeInput ? employeeInput.split(/\s*,\s*/) : [];
    if (employees.length === 0 || employees[0] === "") {
        employeeError.textContent = "Please enter at least one employee.";
        employeeError.style.display = "block";
        return;
    }

    // Validate tasks
    let tasks = taskInput.split(/\s*[\n\s]+\s*/).filter(task => task);
    if (tasks.length === 0) {
        taskError.textContent = "Please enter at least one task.";
        taskError.style.display = "block";
        return;
    }

    // Shuffle tasks for fairness
    tasks.sort(() => Math.random() - 0.5);

    // Assign tasks to employees
    let assignments = Array.from({ length: employees.length }, () => []);
    tasks.forEach((task, i) => {
        assignments[i % employees.length].push(task);
    });

    // Populate table
    let resultBody = document.getElementById('resultBody');
    resultBody.innerHTML = "";

    let summary = {};
    
    assignments.forEach((tasks, index) => {
        let employee = employees[index];
        summary[employee] = tasks.length;
        
        tasks.forEach(task => {
            let row = resultBody.insertRow();
            row.insertCell(0).textContent = task;
            row.insertCell(1).textContent = employee;
        });
    });

    // Show summary
    let summaryOutput = "<ul>";
    Object.entries(summary).forEach(([employee, count]) => {
        summaryOutput += `<li><strong>${employee}:</strong> ${count} tasks</li>`;
    });
    summaryOutput += "</ul>";

    document.getElementById('summary').innerHTML = summaryOutput;
}
