// ── Flip de cards en proyectos.html ──
document.querySelectorAll(".proyecto-card").forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("flipped");
    });
});

// ── Botón volver arriba del footer ──
const footerTopBtn = document.querySelector(".footer-top-btn");
if (footerTopBtn) {
    footerTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}