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
// ═══════════════════════════════════════
// CARRUSEL INFINITO CON AUTOPLAY
// ═══════════════════════════════════════

const track = document.getElementById("carouselTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsContainer = document.getElementById("carouselDots");

if (track) {
    const originalCards = Array.from(track.querySelectorAll(".carousel-card"));
    const totalOriginal = originalCards.length;
    let cardWidth = 0;
    let visibleCount = 1;
    let currentIndex = 0; // índice dentro de las originales (0 a totalOriginal-1)
    let isTransitioning = false;
    let autoplayTimer = null;
    const AUTOPLAY_SPEED = 3000; // ms entre cada movimiento

    // ── 1. Clona cards al inicio y al final ──
    function setupClones() {
        // Elimina clones anteriores si los hay
        track.querySelectorAll(".clone").forEach(c => c.remove());

        // Clona todas al final
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add("clone");
            track.appendChild(clone);
        });

        // Clona todas al inicio
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add("clone");
            track.insertBefore(clone, track.firstChild);
        });
    }

    // ── 2. Calcula tamaños ──
    function calcSizes() {
        const trackWidth = track.parentElement.offsetWidth;
        
        // En móvil siempre 1 card
        if (window.innerWidth <= 900) {
            visibleCount = 1;
            cardWidth = trackWidth - 40; // 40 = padding lateral

            // Aplica el ancho a todas las cards
            track.querySelectorAll(".carousel-card").forEach(card => {
                card.style.minWidth = cardWidth + "px";
                card.style.maxWidth = cardWidth + "px";
            });
        } else {
            track.querySelectorAll(".carousel-card").forEach(card => {
                card.style.minWidth = "";
                card.style.maxWidth = "";
            });
            cardWidth = track.querySelectorAll(".carousel-card")[0].offsetWidth + 24;
            visibleCount = Math.max(1, Math.floor(trackWidth / cardWidth));
        }
    }

    // ── 3. Posiciona el track sin animación ──
    function setPosition(index, animate = true) {
        // El offset real incluye los clones del inicio (totalOriginal cards)
        const realIndex = index + totalOriginal;
        const offset = realIndex * cardWidth;

        if (!animate) {
            track.style.transition = "none";
        } else {
            track.style.transition = "transform 0.6s ease";
        }

        track.style.transform = `translateX(-${offset}px)`;
    }

    // ── 4. Mueve al siguiente ──
    function next() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        setPosition(currentIndex);
    }

    // ── 5. Mueve al anterior ──
    function prev() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        setPosition(currentIndex);
    }

    // ── 6. Detecta cuando termina la transición para hacer el salto invisible ──
    track.addEventListener("transitionend", () => {
        // Si pasó el último original → salta al primero
        if (currentIndex >= totalOriginal) {
            currentIndex = 0;
            setPosition(currentIndex, false); // sin animación
        }

        // Si fue antes del primero → salta al último
        if (currentIndex < 0) {
            currentIndex = totalOriginal - 1;
            setPosition(currentIndex, false); // sin animación
        }

        updateDots();
        isTransitioning = false;

        // Fuerza reflow para que el próximo animate funcione
        track.getBoundingClientRect();
        track.style.transition = "transform 0.6s ease";
    });

    // ── 7. Dots ──
    function createDots() {
        dotsContainer.innerHTML = "";
        for (let i = 0; i < totalOriginal; i++) {
            const dot = document.createElement("button");
            dot.classList.add("carousel-dot");
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => {
                stopAutoplay();
                currentIndex = i;
                isTransitioning = false;
                setPosition(currentIndex);
                updateDots();
                startAutoplay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const idx = ((currentIndex % totalOriginal) + totalOriginal) % totalOriginal;
        dotsContainer.querySelectorAll(".carousel-dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === idx);
        });
    }

    // ── 8. Autoplay ──
    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => next(), AUTOPLAY_SPEED);
    }

    function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
    }

    // Pausa al hover
    track.addEventListener("mouseenter", stopAutoplay);
    track.addEventListener("mouseleave", startAutoplay);

    // ── 9. Botones manuales ──
    prevBtn.addEventListener("click", () => {
        stopAutoplay();
        prev();
        startAutoplay();
    });

    nextBtn.addEventListener("click", () => {
        stopAutoplay();
        next();
        startAutoplay();
    });

    // ── 10. Swipe en móvil ──
    let startX = 0;
    track.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
        stopAutoplay();
    });
    track.addEventListener("touchend", e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
        startAutoplay();
    });

    // ── 11. Init ──
    function init() {
        setupClones();
        calcSizes();
        setPosition(0, false); // posición inicial sin animación
        createDots();
        startAutoplay();
    }

    init();

    // Recalcular al redimensionar
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            stopAutoplay();
            calcSizes();
            currentIndex = 0;
            setPosition(0, false);
            updateDots();
            startAutoplay();
        }, 200);
    });
}