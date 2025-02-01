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
