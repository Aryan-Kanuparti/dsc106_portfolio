
console.log("projects.js is running");


import { fetchJSON, renderProjects } from '../global.js';


async function loadProjects() {
    try {
        // Determine the correct path for projects.json based on the current page
        const isProjectsPage = window.location.pathname.includes("projects");
        const jsonPath = isProjectsPage ? "../lib/projects.json" : "lib/projects.json";

        // Fetch projects from the JSON file
        const projects = await fetchJSON(jsonPath);
        console.log("Fetched projects:", projects); // Debugging line
        const projectsContainer = document.querySelector('.projects');

        if (!projectsContainer) {
            console.error("No '.projects' container found in the DOM.");
            return;
        }

        // Render each project
        renderProjects(projects, projectsContainer, 'h2', isProjectsPage);

        // Update the project count in the title
        const projectCount = projects.length;
        const projectTitleElement = document.querySelector('.projects-title');
        if (projectTitleElement) {
            projectTitleElement.textContent = `Projects (${projectCount})`;
        }
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}


// Load projects when the script runs
loadProjects();


import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";


let query = ''; // Declare the search query variable
const svg = d3.select("#projects-pie-plot")
    .attr("width", 300)  // Adjust the width of the SVG
    .attr("height", 300) // Adjust the height of the SVG
    .attr("viewBox", "-50 -50 100 100"); // Keeps the same coordinate system as in your HTML

const legend = d3.select('.legend'); // Select the legend container
const searchInput = document.querySelector('.searchBar'); // Select the search input field

let projects = []; // This will hold the project data globally

// Fetch and prepare the projects data
async function preparePieChartData() {
    projects = await fetchJSON('../lib/projects.json');

    // Render the pie chart and legend based on the projects data
    renderProjects(projects, document.querySelector('#projects-container')); // Initial render
    renderPieChart(projects); // Initial pie chart render
}


let selectedIndex = -1; // Track selected wedge
let selectedYear = null; // Track selected year

function renderPieChart(projectsGiven) {
    // Clear previous elements
    svg.selectAll('path').remove();
    legend.selectAll('li').remove();

    // Roll up data to count projects per year
    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    // Format data for pie chart
    let data = rolledData.map(([year, count]) => ({ value: count, label: year }));

    // Define arc generator
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let sliceGenerator = d3.pie().value(d => d.value);
    let arcData = sliceGenerator(data);
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // Append pie slices
    let paths = svg.selectAll("path")
        .data(arcData)
        .enter()
        .append("path")
        .attr("d", d => arcGenerator(d))
        .attr("fill", (_, idx) => colors(idx))
        .attr("class", "pie-slice")
        .on("click", (_, i) => {
            selectedIndex = selectedIndex === i.index ? -1 : i.index;
            selectedYear = selectedIndex === -1 ? null : data[selectedIndex].label;

            updateSelection();
            filterProjects();
        });

    // Append legend
    let legendItems = legend.selectAll('li')
        .data(data)
        .enter()
        .append('li')
        .attr('style', (_, idx) => `--color:${colors(idx)}`)
        .html((d) => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
        .on("click", (_, i) => {
            selectedIndex = selectedIndex === i ? -1 : i;
            selectedYear = selectedIndex === -1 ? null : data[selectedIndex].label;

            updateSelection();
            filterProjects();
        });

    // Function to update selection highlights
    function updateSelection() {
        paths.attr("class", (_, idx) => (idx === selectedIndex ? "selected" : ""));
        legendItems.attr("class", (_, idx) => (idx === selectedIndex ? "selected" : ""));
    }
}


function filterProjects() {
    const projectsContainer = document.querySelector('.projects');
    projectsContainer.innerHTML = ""; // Clear previous projects

    let filteredProjects = projects.filter(project => {
        // Match search query (if there's a query)
        let matchesQuery = query ? Object.values(project).some(value => 
            String(value).toLowerCase().includes(query)
        ) : true;

        // Match selected year (if a year is selected)
        let matchesYear = selectedYear ? project.year === selectedYear : true;

        return matchesQuery && matchesYear; // Ensure both filters apply
    });

    renderProjects(filteredProjects, projectsContainer);
    renderPieChart(filteredProjects); // Ensure pie chart updates with filtered projects
}

searchInput.addEventListener('input', (event) => {
    query = event.target.value.trim().toLowerCase(); // Store updated search query
    filterProjects(); // Apply both filters together
});


// Initial call to prepare the pie chart and display the projects
preparePieChartData();


