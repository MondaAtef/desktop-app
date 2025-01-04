    var selectedRow = null;
    var highlightedRow = null;

// Right-click event listener
document.addEventListener('contextmenu', function(event) {
    var target = event.target;
    if (target.tagName === 'TD') {
        event.preventDefault();
        showContextMenu(event.clientX, event.clientY, target);
    }
});

function showContextMenu(x, y, cell) {
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;

    // Save the row to operate on later
    selectedRow = cell.parentElement;
    selectedRow.classList.add('selected');
}

// Hide context menu when clicking anywhere else
document.addEventListener('click', function() {
    document.getElementById('contextMenu').style.display = 'none';

    if (selectedRow) {
            selectedRow.classList.remove('selected');
        }
});

// Load data from Python backend when the page loads
window.onload = function() {
    eel.getDataFromBackend()(function(data) {
        loadData(data);
    });
};

// Function to load data from the backend and display it in the table
function loadData(savedData) {
    var table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];
    savedData.forEach(function(item) {
        var newRow = table.insertRow(-1);

        newRow.insertCell(0).innerHTML = item.note;
        newRow.insertCell(1).innerHTML = item.register;
        newRow.insertCell(2).innerHTML = item.mass;
        newRow.insertCell(3).innerHTML = item.massDate;
        newRow.insertCell(4).innerHTML = item.deathDate;
        newRow.insertCell(5).innerHTML = item.name;
    });
}
 // Edit option
    document.getElementById('editOption').addEventListener('click', function() {
        if (selectedRow) {
            editRow(selectedRow);
            document.getElementById('contextMenu').style.display = 'none';
        }
    });

    // Delete option
    document.getElementById('deleteOption').addEventListener('click', function() {
        if (selectedRow) {
            deleteRow(selectedRow);
            document.getElementById('contextMenu').style.display = 'none';
        }
    });
// Function to delete a row
function deleteRow(row) {
    var rowIndex = row.rowIndex - 1;
    document.getElementById("dynamicTable").deleteRow(row.rowIndex);
    eel.deleteRowInBackend(rowIndex)();
    selectedRow = null; 
}

// Function to save data to the Python backend and update the table
function saveData() {
    var table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];
    var data = [];

    for (var i = 0; i < table.rows.length; i++) {
        var row = table.rows[i];
        var rowData = {
            note: row.cells[0].innerText,
            register: row.cells[1].innerText,
            mass: row.cells[2].innerText,
            massDate: row.cells[3].innerText,
            deathDate: row.cells[4].innerText,
            name: row.cells[5].innerText
        };
        data.push(rowData);
    }

    // Send data to Python backend to save it in the file
    eel.saveDataToBackend(data)(function(response) {
        console.log("Data saved to backend:", response);
    });
}

// Function to add or edit a row
function addRow() {
    var name = document.getElementById("nameInput").value;
    var deathDate = document.getElementById("death_Date").value;
    var mass = document.getElementById("massInput").value;
    var massDate = document.getElementById("massDateInput").value;
    var register = document.getElementById("register").value;
    var note = document.getElementById("note").value;

    if (name !== "" && deathDate  !== "" && mass !== "" && massDate !== "" && register !== "" ) {
         // Check if the entry is a duplicate, but skip this check if editing the same row
        if (!selectedRow || (selectedRow.cells[5].innerText !== name || selectedRow.cells[4].innerText !== deathDate)) {
            var duplicateRow = isDuplicate(name, deathDate);
            if (duplicateRow) {
                alert("اتسجل يوم "  + duplicateRow.cells[1].innerText);
                duplicateRow.classList.add('highlight');
                clearInputs();
                return; 
            }
        }         
      
        if (selectedRow) {
            updateRow(selectedRow, name, deathDate, mass, massDate, register, note);
            selectedRow = null;
        } else {
            insertRow(name, deathDate, mass, massDate, register, note);
        }
        saveData();
        clearInputs(); 
    } else {
        alert("اكمل البيانات");
    }
}

//-----------------functions-----------------------------------------
// Function to check if a row with the same name and death date already exists
function isDuplicate(name, deathDate) {
    var table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];
    var rows = table.rows;

    for (var i = 0; i < rows.length; i++) {
        var rowName = rows[i].cells[5].innerText;
        var rowDeathDate = rows[i].cells[4].innerText;
        if (rowName === name && rowDeathDate === deathDate) {
            for (var j = 0; j < rows.length; j++) {
                rows[j].classList.remove('highlight');
            }
            rows[i].classList.add('highlight');

            setTimeout(function() {
                rows[i].classList.remove('highlight');
            }, 5000);
        
            return rows[i]; 
        }
    }
    return false;
}

// Insert new row into the table
function insertRow(name, deathDate, mass, massDate, register, note) {
    var table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(-1);

    newRow.insertCell(0).innerHTML = note;
    newRow.insertCell(1).innerHTML = register;
    newRow.insertCell(2).innerHTML = mass;
    newRow.insertCell(3).innerHTML = massDate;
    newRow.insertCell(4).innerHTML = deathDate;
    newRow.insertCell(5).innerHTML = name;
}

// Update existing row in the table
function updateRow(row, name, deathDate, mass, massDate, register, note) {
    row.cells[0].innerHTML = note;
    row.cells[1].innerHTML = register;
    row.cells[2].innerHTML = mass;
    row.cells[3].innerHTML = massDate;
    row.cells[4].innerHTML = deathDate;
    row.cells[5].innerHTML = name;

    // Send the updated row data to the backend
    var rowData = {
        note: note,
        register: register,
        mass: mass,
        massDate: massDate,
        deathDate: deathDate,
        name: name
    };
    var rowIndex = row.rowIndex - 1; 
    eel.updateRowInBackend(rowIndex, rowData)();  
}

// Clear input fields
function clearInputs() {
    document.getElementById("nameInput").value = '';
    document.getElementById("death_Date").value = '';
    document.getElementById("massInput").value = 'القداس الأول';
    document.getElementById("massDateInput").value = '';
    document.getElementById("register").value = '';
    document.getElementById("note").value = '......';
}
    
   // Function to edit a row
function editRow(row) {
    document.getElementById("nameInput").value = row.cells[5].innerText;
    document.getElementById("death_Date").value = row.cells[4].innerText;
   document.getElementById("massDateInput").value = row.cells[3].innerText;
    document.getElementById("massInput").value = row.cells[2].innerText;
    document.getElementById("register").value = row.cells[1].innerText;
    document.getElementById("note").value = row.cells[0].innerText;
    selectedRow = row;
}



function deleteAllData() {
    if (confirm("Are you sure you want to delete all data?")) {
        var table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];
        while (table.rows.length > 0) {
            table.deleteRow(0);
        }
        eel.deleteAllDataInBackend()();
    }
}

function searchTable() {
    var input = document.getElementById("searchInput");
    var filter = input.value.toLowerCase();
    var table = document.getElementById("dynamicTable");
    var tbody = table.getElementsByTagName("tbody")[0];
    var rows = tbody.getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        var found = false;
        for (var j = 0; j < cells.length; j++) {
            if (cells[j].innerText.toLowerCase().indexOf(filter) > -1) {
                found = true;
                break;
            }
        }
        rows[i].style.display = found ? "" : "none";
    }
} 

function printTable() {
    var massDateFilter = document.getElementById("massDateFilter").value;
    var table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];
    var printContent = "<table style='border-collapse: collapse; width: 100%;'><thead><tr><th style='border: 1px solid black; padding: 8px;'>ملاحظه</th><th style='border: 1px solid black; padding: 8px;'>تاريخ القداس</th><th style='border: 1px solid black; padding: 8px;'>الاسم</th></tr></thead><tbody>";
    var rowAdded = false;  // Flag to check if any row is added

    for (var i = 0; i < table.rows.length; i++) {
        var rowMassDate = table.rows[i].cells[3].innerText;
        var note = table.rows[i].cells[0].innerText;
        var name = table.rows[i].cells[5].innerText;
        
        if (massDateFilter === "" || rowMassDate === massDateFilter) {
            rowAdded = true;  // Set flag to true if a row is added
            printContent += "<tr>";
            printContent += "<td style='border: 1px solid black; padding: 8px;'>" + note + "</td>";
            printContent += "<td style='border: 1px solid black; padding: 8px;'>" + rowMassDate + "</td>";
            printContent += "<td style='border: 1px solid black; padding: 8px;'>" + name + "</td>";
            printContent += "</tr>";
        }
    }
    
    printContent += "</tbody></table>";
    
    if (!rowAdded) {
        alert("لا يوجد هذا التاريخ")
    } else {
        // Open a new window and print the content with additional styles
        var printWindow = window.open('', '', 'height=800, width=800');
        printWindow.document.write('<html><head><title>Print Table</title>');
        printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }
    
    // Clear the input field after printing
    document.getElementById("massDateFilter").value = "";
}

