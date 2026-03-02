const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    // Toggle mobile menu visibilidad
    document.body.classList.toggle("show-mobile-menu");
});

menuCloseButton.addEventListener("click", () => menuOpenButton.click());

document.querySelectorAll(".skill-card").forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("flipped");
    });
});