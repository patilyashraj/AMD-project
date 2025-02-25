async function uploadFile(event) {
    event.preventDefault(); // Prevents page reload

    let formData = new FormData(document.getElementById("uploadForm"));

    let response = await fetch("/upload", {
        method: "POST",
        body: formData
    });

    let result = await response.json();

    if (result.message) {
        document.getElementById("message").innerText = result.message;
    }

    if (result.summary) {
        displaySummary(result.summary);
    }
}

function displaySummary(summary) {
    let summaryDiv = document.getElementById("summary");
    summaryDiv.innerHTML = ""; // Clear previous results

    // Columns
    let columnsHTML = `<h3>Columns:</h3><p>${summary.columns.join(", ")}</p>`;

    // Missing Values
    let missingValuesHTML = "<h3>Missing Values:</h3><ul>";
    for (let key in summary.missing_values) {
        missingValuesHTML += `<li><strong>${key}:</strong> ${summary.missing_values[key]}</li>`;
    }
    missingValuesHTML += "</ul>";

    // Basic Statistics
    let statsHTML = "<h3>Basic Statistics:</h3>";
    for (let column in summary.basic_statistics) {
        statsHTML += `<h4>${column}</h4><ul>`;
        for (let stat in summary.basic_statistics[column]) {
            statsHTML += `<li><strong>${stat}:</strong> ${summary.basic_statistics[column][stat]}</li>`;
        }
        statsHTML += "</ul>";
    }

    summaryDiv.innerHTML = columnsHTML + missingValuesHTML + statsHTML;
}
