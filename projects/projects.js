import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
    const projects = await fetchJSON('../lib/projects.json');
    console.log("Fetched projects:", projects); // Debugging line
    const projectsContainer = document.querySelector('.projects');

    if (!projectsContainer) {
        console.error("No '.projects' container found in the DOM.");
        return;
    }

    renderProjects(projects, projectsContainer, 'h2');

    // Step 1.6: Count projects and update the title
    const projectCount = projects.length;
    const projectTitleElement = document.querySelector('.projects-title');
    if (projectTitleElement) {
        projectTitleElement.textContent = `Projects (${projectCount})`;
    }
}

// Load projects when the script runs
loadProjects();


// Determine the correct path for projects.json based on the current page
const isProjectsPage = window.location.pathname.includes("projects");
const jsonPath = isProjectsPage ? "../lib/projects.json" : "lib/projects.json";

fetch(jsonPath)
    .then(response => response.json())
    .then(projects => {
        // Manage image paths based on the current page
        const imagePathPrefix = isProjectsPage ? "../" : "";

        // Get the container where projects will be displayed
        const projectsContainer = document.getElementById('projects-container');

        // Create and display each project
        projects.forEach(project => {
            const projectElement = document.createElement('article');
            projectElement.innerHTML = `
                <img src="${imagePathPrefix}${project.image}" alt="${project.title}">
                <h2>${project.title} (${project.year})</h2>
                <p>${project.description}</p>
            `;
            projectsContainer.appendChild(projectElement);
        });
    })
    .catch(error => console.error('Error loading projects:', error));

