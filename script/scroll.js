const headerButton = document.getElementById("goto-header-button");
const aproposButton = document.getElementById("goto-a-propos-button");
const formationButton = document.getElementById("goto-formation-button");
const skillsButton = document.getElementById("goto-skills-button");
const creaButton = document.getElementById("goto-crea-button");
const contactButton = document.getElementById("goto-contact-button");

createButtonScroll(headerButton, "header-animated-canva");
createButtonScroll(aproposButton, "a-propos-section");
createButtonScroll(formationButton, "formation-section");
createButtonScroll(skillsButton, "skills-section");
createButtonScroll(creaButton, "creation-section");
createButtonScroll(contactButton, "contact");

function createButtonScroll(button, scrollTo) {
    button.addEventListener("click", () => {
        const element = document.getElementById(scrollTo);
    
        element.scrollIntoView();
    });
}