document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("divideButton").addEventListener("click", divideTasks);
    document.getElementById("reassignButton").addEventListener("click", divideTasks); // You can change to a different function if needed
    document.getElementById("copyButton").addEventListener("click", copyTable);
    document.getElementById("clearButton").addEventListener("click", clearTasks);
  });
  
  function divideTasks(event) {
    let employeeInput = document.getElementById("employeeNames").value.trim();
    let taskInput = document.getElementById("taskInput").value.trim();
    let employeeError = document.getElementById("employeeError");
    let taskError = document.getElementById("taskError");
    let resultTable = document.getElementById("resultTable");
  
    // Hide error messages
    employeeError.style.display = "none";
    taskError.style.display = "none";
  
    // Validate employee input
    let employees = employeeInput ? employeeInput.split(/\s*,\s*/) : [];
    if (employees.length === 0 || employees[0] === "") {
      showError(employeeError, "Please enter at least one employee.");
      return;
    }
  
    // Validate task input (split by newlines)
    let tasks = taskInput.split(/\n/).map(s => s.trim()).filter(s => s);
    if (tasks.length === 0) {
      showError(taskError, "Please enter at least one task.");
      return;
    }
  
    // Shuffle tasks for fairness
    tasks.sort(() => Math.random() - 0.5);
  
    // Assign tasks to employees
    let assignments = Array.from({ length: employees.length }, () => []);
    tasks.forEach((task, idx) => {
      assignments[idx % employees.length].push(task);
    });
  
    // Clear existing table body
    let resultBody = document.getElementById("resultBody");
    resultBody.innerHTML = "";
    let summary = {};
  
    assignments.forEach((tasks, idx) => {
      let emp = employees[idx];
      summary[emp] = tasks.length;
      tasks.forEach(task => {
        let row = document.createElement("tr");
        let tdTask = document.createElement("td");
        tdTask.textContent = task;
        let tdEmp = document.createElement("td");
        tdEmp.textContent = emp;
        row.appendChild(tdTask);
        row.appendChild(tdEmp);
        resultBody.appendChild(row);
      });
    });
  
    // Build summary HTML and update the summary div
    let summaryDiv = document.getElementById("summary");
    let summaryHTML = "<ul>";
    for (let emp in summary) {
      summaryHTML += `<li><strong>${emp}:</strong> ${summary[emp]} tasks</li>`;
    }
    summaryHTML += "</ul>";
    summaryDiv.innerHTML = summaryHTML;
  
    // Animate table appearance
    resultTable.classList.remove("fade-in");
    void resultTable.offsetWidth; // Force reflow
    resultTable.classList.add("fade-in");
  
    // Provide button feedback (without color change)
    buttonFeedback(event.currentTarget, "Divided!");
  }
  
  function showError(element, message) {
    element.textContent = message;
    element.style.display = "block";
    element.classList.add("shake");
    setTimeout(() => {
      element.classList.remove("shake");
    }, 500);
  }
  
  function copyTable(event) {
    let tbody = document.getElementById("resultBody");
    if (!tbody) {
      console.error("Table body not found.");
      copyFeedback(event.currentTarget, false);
      return;
    }
    // Create a temporary table containing only the tbody
    let tempTable = document.createElement("table");
    tempTable.appendChild(tbody.cloneNode(true));
    let tableHTML = tempTable.outerHTML;
  
    // Use Clipboard API with HTML support
    if (navigator.clipboard && navigator.clipboard.write) {
      const blob = new Blob([tableHTML], { type: "text/html" });
      const clipboardItem = new ClipboardItem({ "text/html": blob });
      navigator.clipboard.write([clipboardItem]).then(() => {
        copyFeedback(event.currentTarget, true);
      }).catch((err) => {
        console.error("Clipboard API error:", err);
        fallbackCopyHTML(tableHTML, event.currentTarget);
      });
    } else {
      fallbackCopyHTML(tableHTML, event.currentTarget);
    }
  }
  
  function fallbackCopyHTML(html, button) {
    let container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "-9999px";
    container.innerHTML = html;
    document.body.appendChild(container);
  
    let range = document.createRange();
    range.selectNode(container);
  
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  
    try {
      let successful = document.execCommand("copy");
      copyFeedback(button, successful);
    } catch (err) {
      console.error("Fallback copy error:", err);
      copyFeedback(button, false);
    }
  
    selection.removeAllRanges();
    document.body.removeChild(container);
  }
  
  function clearTasks(event) {
    document.getElementById("taskInput").value = "";
    document.getElementById("resultBody").innerHTML = "";
    document.getElementById("summary").innerHTML = "";
    document.getElementById("employeeError").style.display = "none";
    document.getElementById("taskError").style.display = "none";
    buttonFeedback(event.currentTarget, "Cleared!");
  }
  
  function buttonFeedback(button, text) {
    let original = button.getAttribute("data-original");
    button.textContent = text;
    setTimeout(() => {
      button.textContent = original;
    }, 2000);
  }
  
  function copyFeedback(button, success) {
    let original = button.getAttribute("data-original");
    if (success) {
      button.textContent = "Copied!";
      button.classList.add("copy-success");
    } else {
      button.textContent = "Copy Failed";
    }
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove("copy-success");
    }, 2000);
  }
  