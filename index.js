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
        const githubData = await fetchGitHubData('Aryan-Kanuparti'); // Replace with your GitHub username

        const profileStats = document.querySelector('#profile-stats');

        if (profileStats) {
            profileStats.innerHTML = `
                <h2>Github Stats</h2>
                <dl id="profile-stats-grid">
                    <dt>Repos</dt> <dt>Gists</dt> <dt>Followers</dt> <dt>Following</dt>
                    <dd>${githubData.public_repos}</dd> 
                    <dd>${githubData.public_gists}</dd> 
                    <dd>${githubData.followers}</dd> 
                    <dd>${githubData.following}</dd>
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
