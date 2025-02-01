import { fetchJSON, renderProjects } from './global.js';

async function loadLatestProjects() {
    try {
        // fetches all projects from projects.json
        const projects = await fetchJSON('./lib/projects.json');
        
        // first 3 projects
        const latestProjects = projects.slice(0, 3);

        // Select  container in index.html
        const projectsContainer = document.querySelector('.projects');

        // Check container exists before rendering
        if (projectsContainer) {
            renderProjects(latestProjects, projectsContainer, 'h2');
        } else {
            console.error("Projects container not found.");
        }
    } catch (error) {
        console.error("Error loading latest projects:", error);
    }
}

// loads projects when the script is executed
loadLatestProjects();
