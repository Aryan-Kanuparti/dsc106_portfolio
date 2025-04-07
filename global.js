
console.log("IT’S ALIVE!");

// Dynamically set the base URL
const IS_LOCALHOST = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BASE_PATH = IS_LOCALHOST ? "/" : "/portfolio/";
document.write(`<base href="${BASE_PATH}">`);

// Home page check
const ARE_WE_HOME = document.documentElement.classList.contains('home');
let nav = document.createElement('nav');
document.body.prepend(nav);

// Define the pages array
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'meta/', title: 'Meta' }, 
    { url: 'https://github.com/Aryan-Kanuparti', title: 'GitHub' },
];

// Iterate through pages to add links to nav
for (let p of pages) {
    let url = ARE_WE_HOME || p.url.startsWith('http') ? p.url : BASE_PATH + p.url;

    // Create link and add it to nav
    let a = document.createElement('a');
    a.href = url;
    a.textContent = p.title;

    // Append current class for the current page
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
    );

    // To deal with external links
    if (a.host !== location.host) {
        a.target = '_blank';
    }
    nav.append(a);
}

// Insert color scheme label
document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
        Theme:
        <select>
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>`
);

const select = document.querySelector('.color-scheme select');

// Set the color scheme
function setColorScheme(colorScheme) {
    select.value = colorScheme;
    if (colorScheme === "light") {
        document.documentElement.style.setProperty("--color-bg", "#ffffff");
        document.documentElement.style.setProperty("--color-text", "#000000");
        document.documentElement.style.setProperty("--color-accent", "oklch(60% 30% 300)");
    } else if (colorScheme === "dark") {
        document.documentElement.style.setProperty("--color-bg", "#121212");
        document.documentElement.style.setProperty("--color-text", "#ffffff");
        document.documentElement.style.setProperty("--color-accent", "oklch(60% 50% 300)");
    } else {
        // Setting up automatic
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setColorScheme(isDarkMode ? "dark" : "light");
        return; // Prevent saving "light dark" in localStorage
    }

    // Save preference
    localStorage.colorScheme = colorScheme;
}

// Initialize color scheme on page load
if ("colorScheme" in localStorage) {
    setColorScheme(localStorage.colorScheme);
} else {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setColorScheme(isDarkMode ? "dark" : "light");
}

// Update color scheme on change
select.addEventListener("input", (event) => {
    setColorScheme(event.target.value);
});


//lab 4 step 1

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
        return []; // Return an empty array to prevent crashes
    }
}





export function renderProjects(projects, containerElement, headingLevel = 'h2', isProjectsPage = false) {
    if (!containerElement) {
        console.error("Invalid container element provided.");
        return;
    }

    containerElement.innerHTML = ''; // Clear existing content

    if (projects.length === 0) {
        containerElement.innerHTML = '<p>No projects match this query.</p>';
        return;
    }

    const imagePathPrefix = 'lib/'; // ✅ Correct path

    projects.forEach(project => {
        const article = document.createElement('article');
        // Ensure project.image does not already contain "lib/"
        const imageSrc = project.image.startsWith("lib/") ? project.image : `${imagePathPrefix}${project.image}`;

        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <img src="${imageSrc}" alt="${project.title}"> <!-- Fixed src here -->
            <div class="project-details">
                <p>${project.description}</p>
                <p class="project-year">${project.year}</p>
            </div>
        `;
        containerElement.appendChild(article);
    });
}




export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}
