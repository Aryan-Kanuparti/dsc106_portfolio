console.log("IT’S ALIVE!");

// function $$(selector, context = document) {
//   return Array.from(context.querySelectorAll(selector));
// }

// // Step 2 lab 3: add "current" class to the current page link
// const navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );

// currentLink?.classList.add("current");

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
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
  


  // Add the dark mode switcher dropdown to the top of the page
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

// Function to set the color scheme
function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    select.value = colorScheme;
}

// Load the user's saved preference from localStorage
if ("colorScheme" in localStorage) {
    setColorScheme(localStorage.colorScheme);
}

// Listen for changes in the dropdown
select.addEventListener('input', function (event) {
    const colorScheme = event.target.value;
    setColorScheme(colorScheme);
    localStorage.colorScheme = colorScheme; // Save the preference
});
