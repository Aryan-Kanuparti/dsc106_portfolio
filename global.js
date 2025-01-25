console.log("IT’S ALIVE!");

// let basePath = window.location.hostname === 'localhost' ? '' : '/dsc106_portfolio/';

// let pages = [
//     { url: 'dsc106_portfolio/index.html', title: 'Home' },
//     { url: 'dsc106_portfolio/projects/index.html', title: 'Projects' },
//     { url: 'dsc106_portfolio/contact/index.html', title: 'Contact' },
//     { url: 'dsc106_portfolio/resume/index.html', title: 'Resume' },
//     { url: 'https://github.com/Aryan-Kanuparti', title: 'GitHub' },
// ];

let pages = [
    { url: '', title: 'Home' },
    { url: '../projects/', title: 'Projects' },
    { url: '../contact/', title: 'Contact' },
    { url: '../resume/', title: 'Resume' },
    { url: 'https://github.com/Aryan-Kanuparti', title: 'GitHub' },
  ];
  
  // home page check
  const ARE_WE_HOME = document.documentElement.classList.contains('home');
  let nav = document.createElement('nav');
  document.body.prepend(nav);
  
  // Iterate thorugh pages to add links to nav
  for (let p of pages) {
    let url = p.url;
    let title = p.title;
  
    
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
  
    // append current class for the current page
    a.classList.toggle(
      'current',
      a.host === location.host && a.pathname === location.pathname
    );
  
    // to deal wiht github external link
    if (a.host !== location.host) {
      a.target = '_blank';
    }
    nav.append(a);
  }
  

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


// set the color scheme
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
        // setting up automatic
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setColorScheme(isDarkMode ? "dark" : "light");
        return; // Prevent saving "light dark" in localStorage
    }

    // Save preference
    localStorage.colorScheme = colorScheme;
}

if ("colorScheme" in localStorage) {
    setColorScheme(localStorage.colorScheme);
} else {
    //makes automatic work
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setColorScheme(isDarkMode ? "dark" : "light");
}

select.addEventListener("input", (event) => {
    setColorScheme(event.target.value);
});