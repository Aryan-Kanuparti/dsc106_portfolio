
console.log("projects.js is running");


import { fetchJSON, renderProjects } from '../global.js';

// async function loadProjects() {
//     try {
//         // Determine the correct path for projects.json based on the current page
//         const isProjectsPage = window.location.pathname.includes("projects");
//         const jsonPath = isProjectsPage ? "../lib/projects.json" : "lib/projects.json";

//         // Fetch projects from the JSON file
//         const projects = await fetchJSON(jsonPath);
//         console.log("Fetched projects:", projects); // Debugging line
//         const projectsContainer = document.querySelector('.projects');

//         if (!projectsContainer) {
//             console.error("No '.projects' container found in the DOM.");
//             return;
//         }

//         // Manage image paths based on the current page

//         // Render each project
//         renderProjects(projects, projectsContainer, 'h2', isProjectsPage);
//         // projects.forEach(project => {
//         //     const projectElement = document.createElement('article');
//         //     projectElement.innerHTML = `
//         //         <img src="${imagePathPrefix}${project.image}" alt="${project.title}">
//         //         <h2>${project.title} (${project.year})</h2>
//         //         <p>${project.description}</p>
//         //     `;
//         //     projectsContainer.appendChild(projectElement);
//         // });

//         // Update the project count in the title
//         const projectCount = projects.length;
//         const projectTitleElement = document.querySelector('.projects-title');
//         if (projectTitleElement) {
//             projectTitleElement.textContent = `Projects (${projectCount})`;
//         }
//     } catch (error) {
//         console.error("Error loading projects:", error);
//     }
// }




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

// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// // Sample data
// let data = [1, 2, 3, 4, 5, 5];

// // Define the SVG container
// d3.select("#projects-plot")
//   .attr("viewBox", "-50 -50 100 100");

// // Define arc generator
// let arcGenerator = d3.arc()
//   .innerRadius(0)  // Pie chart (0 inner radius); for donut chart, set this higher
//   .outerRadius(50);

// // Generate pie slices
// let sliceGenerator = d3.pie();
// let arcData = sliceGenerator(data);
// let arcs = arcData.map(d => arcGenerator(d));

// // Define a color scale
// let colors = d3.scaleOrdinal(d3.schemePaired);

// // Append pie slices to SVG
// d3.select("svg")
//   .selectAll("path")
//   .data(arcs)
//   .enter()
//   .append("path")
//   .attr("d", d => d)
//   .attr("fill", (_, idx) => colors(idx));

// Import D3.js from CDN
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Sample data
let data = [
    { value: 1, label: 'apples' },
    { value: 2, label: 'oranges' },
    { value: 3, label: 'mangos' },
    { value: 4, label: 'pears' },
    { value: 5, label: 'limes' },
    { value: 5, label: 'cherries' },
  ];

// Define the SVG container
const svg = d3.select("#projects-pie-plot")
  .attr("width", 300)  // Adjust the width of the SVG
  .attr("height", 300) // Adjust the height of the SVG
  .attr("viewBox", "-50 -50 100 100"); // Keeps the same coordinate system as in your HTML

// Define the arc generator
let arcGenerator = d3.arc()
  .innerRadius(0)  // Pie chart (0 inner radius); for donut chart, set this higher
  .outerRadius(50); // The radius of the pie

// Use D3's pie function to convert data into angles for the slices
// let sliceGenerator = d3.pie();
let sliceGenerator = d3.pie().value(d => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map(d => arcGenerator(d));

// Define a color scale
let colors = d3.scaleOrdinal(d3.schemeTableau10); // Scalable color scale

// Append pie slices to the SVG
svg.selectAll("path")
  .data(arcs)
  .enter()
  .append("path")
  .attr("d", d => d)
  .attr("fill", (_, idx) => colors(idx)); // Assign color based on the slice index


let legend = d3.select('.legend');
data.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color:${colors(idx)}`) // Use your color scale here
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});