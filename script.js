const spancrit = document.getElementById("critical");
const spanhigh = document.getElementById("high");
const spanmed = document.getElementById("medium");
const spanlow = document.getElementById("low");

const filtersec = document.getElementById("filter-drop");
const eventsContainer = document.getElementById("events-container");

const incinput = document.getElementById("incinput");
const searchbtn = document.getElementById("search-btn");

let incidentsData = [];


fetch("incidents.json")
  .then((response) => response.json())
  .then((data) => {

    incidentsData = data;

    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;

    data.forEach(incident => {
      console.log(incident.Severity);

      if (incident.Severity === "Critical") {
        critical++;
      }
      else if (incident.Severity === "High") {
        high++;
      }
      else if (incident.Severity === "Medium") {
        medium++;
      }
      else {
        low++;
      }
    });

    spancrit.textContent = critical;
    spanhigh.textContent = high;
    spanmed.textContent = medium;
    spanlow.textContent = low;

    displayIncidents(data);
  });


// for displaying the incidents in the cards
function displayIncidents(incidents) {

  eventsContainer.innerHTML = "";

  if (incidents.length === 0) {

    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message";
    errorMessage.textContent = "No incidents found.";
    eventsContainer.appendChild(errorMessage);

    return;
  }

  incidents.forEach(incident => {

    const eventCard = document.createElement("div");
    eventCard.className = incident.Severity.toLowerCase();
    eventCard.innerHTML = `
      <h3>${incident.Severity}</h3>
      <p>${incident.Description}</p>
      <p>${incident.Date}</p>
    `;

    eventsContainer.appendChild(eventCard);

  });
}


// filtering + searching
function filterAndSearch() {

  const selectedfilter = filtersec.value;
  const searchTerm = incinput.value.trim().toLowerCase();

  const filteredIncidents = incidentsData.filter(incident => {

    const matchesFilter =
      selectedfilter === "All" ||
      incident.Severity === selectedfilter;

    const text =
      incident.Description.toLowerCase() + " " +
      incident.Severity.toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      text.split(/\s+/).includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  displayIncidents(filteredIncidents);
}


// for filtering
filtersec.addEventListener("change", () => {
  filterAndSearch();
});


// for searching
searchbtn.addEventListener("click", (event) => {
  event.preventDefault();
  filterAndSearch();

});

incinput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    filterAndSearch();
  }
});
