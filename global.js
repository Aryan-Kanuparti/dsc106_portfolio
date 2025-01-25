// console.log("IT’S ALIVE!");

// // let basePath = window.location.hostname === 'localhost' ? '' : '/dsc106_portfolio/';
// if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
//     document.write('<base href="/">'); // Development environment
// } else {
//     document.write('<base href="/dsc106_portfolio/">'); // Production environment
// }

//   // home page check
//   const ARE_WE_HOME = document.documentElement.classList.contains('home');
//   let nav = document.createElement('nav');
//   document.body.prepend(nav);
// // let pages = [
// //     { url: 'dsc106_portfolio/index.html', title: 'Home' },
// //     { url: 'dsc106_portfolio/projects/index.html', title: 'Projects' },
// //     { url: 'dsc106_portfolio/contact/index.html', title: 'Contact' },
// //     { url: 'dsc106_portfolio/resume/index.html', title: 'Resume' },
// //     { url: 'https://github.com/Aryan-Kanuparti', title: 'GitHub' },
// // ];

// let pages = [
//     { url: '', title: 'Home' },
//     { url: '../projects/', title: 'Projects' },
//     { url: '../contact/', title: 'Contact' },
//     { url: '../resume/', title: 'Resume' },
//     { url: 'https://github.com/Aryan-Kanuparti', title: 'GitHub' },
//   ];
  

//   // Iterate thorugh pages to add links to nav
//   for (let p of pages) {
//     let url = p.url;
//     let title = p.title;
  
    
//     url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
//     let a = document.createElement('a');
//     a.href = url;
//     a.textContent = title;
  
//     // append current class for the current page
//     a.classList.toggle(
//       'current',
//       a.host === location.host && a.pathname === location.pathname
//     );
  
//     // to deal wiht github external link
//     if (a.host !== location.host) {
//       a.target = '_blank';
//     }
//     nav.append(a);
//   }
  

// document.body.insertAdjacentHTML(
//     'afterbegin',
//     `
//     <label class="color-scheme">
//         Theme:
//         <select>
//             <option value="light dark">Automatic</option>
//             <option value="light">Light</option>
//             <option value="dark">Dark</option>
//         </select>
//     </label>`
// );

// const select = document.querySelector('.color-scheme select');


// // set the color scheme
// function setColorScheme(colorScheme) {
//     select.value = colorScheme;
//     if (colorScheme === "light") {
//         document.documentElement.style.setProperty("--color-bg", "#ffffff");
//         document.documentElement.style.setProperty("--color-text", "#000000");
//         document.documentElement.style.setProperty("--color-accent", "oklch(60% 30% 300)");
//     } else if (colorScheme === "dark") {
//         document.documentElement.style.setProperty("--color-bg", "#121212");
//         document.documentElement.style.setProperty("--color-text", "#ffffff");
//         document.documentElement.style.setProperty("--color-accent", "oklch(60% 50% 300)");
//     } else {
//         // setting up automatic
//         const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
//         setColorScheme(isDarkMode ? "dark" : "light");
//         return; // Prevent saving "light dark" in localStorage
//     }

//     // Save preference
//     localStorage.colorScheme = colorScheme;
// }

// if ("colorScheme" in localStorage) {
//     setColorScheme(localStorage.colorScheme);
// } else {
//     //makes automatic work
//     const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     setColorScheme(isDarkMode ? "dark" : "light");
// }

// select.addEventListener("input", (event) => {
//     setColorScheme(event.target.value);
// });


console.log("IT’S ALIVE!");

// Dynamically set the base URL
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    document.write('<base href="/">'); // Development environment
} else {
    document.write('<base href="/dsc106_portfolio/">'); // Production environment
}

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
    { url: 'https://github.com/Aryan-Kanuparti', title: 'GitHub' },
];

// Iterate through pages to add links to nav
for (let p of pages) {
    let url = p.url;
    let title = p.title;

    // Adjust URL based on whether we're on the home page
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

    // Create link and add it to nav
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

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
