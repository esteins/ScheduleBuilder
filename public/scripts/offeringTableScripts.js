// File that contains functions to retrieve offerings and shows offerings in tables

// Get courses taken for specific student for specific semester using AJAX
function retrieveOfferingsForSemesterAndUser(semesterId, tables, editOptions) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create offerings object
      var offerings = JSON.parse(xhr.responseText);
      // Add to offerings correct table
      var tableId = tables.userOfferingTable;
      addOfferingsToTable(offerings, tableId, editOptions);
    }
  };
  xhr.open("GET", "/getStudentCoursesBySemester/" + semesterId, true);
  xhr.send();
}

// Get courses offered for a given semester from database using AJAX
function retrieveOfferingsForSemester(semesterId, tables, editOptions) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create offerings object
      var offerings = JSON.parse(xhr.responseText);
      // Add offerings to correct table
      var tableId = tables.availableOfferingTable;
      addOfferingsToTable(offerings, tableId, editOptions);
    }
  };
  xhr.open("GET", "/getCoursesBySemester/" + semesterId, true);
  xhr.send();
}

// Create a row for each offering in offerings
function addOfferingsToTable(offerings, tableId, editOptions) {
  if (offerings.length > 0) {
    // Access the table
    var table = $(`#${tableId}`);
    var i;
    var offering;
    // Loop through offerings retrieved
    for (i = 0; i < offerings.length; i++) {
      offering = offerings[i];
      // Create a row and add it to the table specified
      createOfferingRow(offering, table, editOptions);
    }
  }
}

// Function to create row in offerings table
function createOfferingRow(offering, table, editOptions) {
  // Determine the ID for the offering row
  var id =
    editOptions.type === "studentSchedule"
      ? offering.registrationId
      : offering.offeringId;
  var offeringOutput = `<tr class='${editOptions.type}${id}'>`;
  offeringOutput += `<td id='name${id}'>${offering.name}</td>`;

  // Separate out the department code and course number if offering can be edited
  if (editOptions.edit) {
    offeringOutput += `<td id='code${id}'>${offering.deptCode}</td>`;
    offeringOutput += `<td id='code${id}'>${offering.courseNumber}</td>`;
  }
  // Otherwise combine them
  else {
    offeringOutput += `<td id='code${id}'>${offering.deptCode} ${offering.courseNumber}</td>`;
  }

  offeringOutput += `<td id='prof${id}'>${offering.prof}</td>`;
  offeringOutput += `<td id='credits${id}'>${offering.credits}</td>`;
  offeringOutput += `<td id='days${id}'>${offering.days}</td>`;
  offeringOutput += `<td id='time${id}'>${offering.time}</td>`;

  // Separate out building and room if row can be edited
  if (editOptions.edit) {
    offeringOutput += `<td id='building${id}'>${offering.building}</td>`;
    offeringOutput += `<td id='room${id}'>${offering.room}</td>`;
  }
  // Otherwise combine them
  else {
    offeringOutput += `<td id='location${id}'>${offering.building} ${offering.room}</td>`;
  }

  // Show add, edit, and delete icons if they are appropriate
  if (editOptions.delete && editOptions.edit) {
    offeringOutput +=
      "<td> <span class='editOffering glyphicon glyphicon-pencil'></span> <span class='deleteOffering glyphicon glyphicon-trash'></span> </td>";
  } else if (editOptions.delete) {
    offeringOutput +=
      "<td><span class='deleteOffering glyphicon glyphicon-trash'></span> </td>";
  } else if (editOptions.add) {
    offeringOutput +=
      "<td><span class='addOffering glyphicon glyphicon-plus'></span> </td>";
  }
  offeringOutput += "</tr>";

  // Add the row to the table
  table.append(offeringOutput);
}