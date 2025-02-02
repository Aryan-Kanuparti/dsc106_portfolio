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



import { fetchGitHubData } from './global.js';

async function loadGitHubStats() {
    try {
        const githubData = await fetchGitHubData('Aryan-Kanuparti'); 
        // Selectsthe HTML container where the data will be displayed
        const profileStats = document.querySelector('#profile-stats');
        if (profileStats) {
            profileStats.innerHTML = `
                <h2>GitHub Stats</h2>
                <dl>
                    <dt>Public Repos:</dt> <dd>${githubData.public_repos}</dd>
                    <dt>Public Gists:</dt> <dd>${githubData.public_gists}</dd>
                    <dt>Followers:</dt> <dd>${githubData.followers}</dd>
                    <dt>Following:</dt> <dd>${githubData.following}</dd>
                </dl>
            `;
        } else {
            console.error("Profile stats container not found.");
        }
    } catch (error) {
        console.error("Error loading GitHub data:", error);
    }
}

loadGitHubStats();
