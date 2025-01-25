console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 2 lab 3: add "current" class to the current page link
const navLinks = $$("nav a");

let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);

currentLink?.classList.add("current");
