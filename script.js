const cards = document.querySelectorAll(".skill-card, .project-card");

cards.forEach(card => {
    card.addEventListener("mousemove", event => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.background = `
            radial-gradient(circle at ${x}px ${y}px, rgba(167, 139, 250, 0.18), rgba(255, 255, 255, 0.055) 45%)
        `;
    });

    card.addEventListener("mouseleave", () => {
        card.style.background = "rgba(255, 255, 255, 0.055)";
    });
}); 