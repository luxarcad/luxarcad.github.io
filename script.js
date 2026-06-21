const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themePill = document.getElementById("themePill");
const cursorGlow = document.querySelector(".cursor-glow");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prefersLight = window.matchMedia("(prefers-color-scheme: light)");

function updateThemePill() {
    if (!themePill) return;

    themePill.textContent = prefersLight.matches ? "Claro auto" : "Oscuro auto";
}

updateThemePill();
prefersLight.addEventListener("change", updateThemePill);

menuToggle?.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
    navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        navLinks.classList.remove("open");
    });
});

window.addEventListener("mousemove", event => {
    if (!cursorGlow || prefersReducedMotion) return;

    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
});

const cards = document.querySelectorAll(".magnetic-card, .stat-card");

cards.forEach(card => {
    card.addEventListener("mousemove", event => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.background = `
            radial-gradient(circle at ${x}px ${y}px, rgba(157, 78, 221, 0.18), transparent 34%),
            var(--surface)
        `;

        if (!prefersReducedMotion) {
            const rotateX = ((y / rect.height) - 0.5) * -8;
            const rotateY = ((x / rect.width) - 0.5) * 8;

            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        }
    });

    card.addEventListener("mouseleave", () => {
        card.style.background = "";
        card.style.transform = "";
    });
});

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

function setActiveNav() {
    let currentSection = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 140;

        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute("id");
        }
    });

    navItems.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", setActiveNav);
setActiveNav();

function initGsapAnimations() {
    if (!window.gsap || prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.out",
            duration: 1
        }
    });

    timeline
        .from(".navbar", {
            y: -30,
            opacity: 0
        })
        .from(".tag", {
            y: 24,
            opacity: 0
        }, "-=0.35")
        .from(".hero h1", {
            y: 38,
            opacity: 0
        }, "-=0.45")
        .from(".description", {
            y: 26,
            opacity: 0
        }, "-=0.5")
        .from(".hero-buttons .btn", {
            y: 22,
            opacity: 0,
            stagger: 0.12
        }, "-=0.45")
        .from(".hero-card", {
            x: 55,
            opacity: 0,
            rotate: 2
        }, "-=0.65");

    gsap.utils.toArray(".reveal").forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 78%"
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray(".skill-card, .project-card, .stat-card").forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 84%"
            },
            y: 45,
            opacity: 0,
            duration: 0.8,
            delay: (index % 4) * 0.06,
            ease: "power3.out"
        });
    });

    gsap.to(".hero-card", {
        y: -16,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

function initThreeBackground() {
    const canvas = document.getElementById("space-bg");

    if (!canvas || !window.THREE || prefersReducedMotion) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const particleCount = window.innerWidth < 768 ? 280 : 620;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 11;
        positions[i + 1] = (Math.random() - 0.5) * 8;
        positions[i + 2] = (Math.random() - 0.5) * 8;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.018,
        color: prefersLight.matches ? 0x7c3aed : 0x9d4edd,
        transparent: true,
        opacity: prefersLight.matches ? 0.45 : 0.75
    });

    const particles = new THREE.Points(particleGeometry, particlesMaterial);
    scene.add(particles);

    const shapeGeometry = new THREE.IcosahedronGeometry(1.15, 1);
    const shapeMaterial = new THREE.MeshBasicMaterial({
        color: prefersLight.matches ? 0x0284c7 : 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: prefersLight.matches ? 0.18 : 0.24
    });

    const shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
    shape.position.set(2.4, 0.2, -1.5);
    scene.add(shape);

    const secondGeometry = new THREE.TorusKnotGeometry(0.45, 0.13, 90, 12);
    const secondMaterial = new THREE.MeshBasicMaterial({
        color: prefersLight.matches ? 0xd97706 : 0xffb703,
        wireframe: true,
        transparent: true,
        opacity: prefersLight.matches ? 0.16 : 0.22
    });

    const secondShape = new THREE.Mesh(secondGeometry, secondMaterial);
    secondShape.position.set(-2.6, -1.1, -1);
    scene.add(secondShape);

    const mouse = {
        x: 0,
        y: 0
    };

    window.addEventListener("mousemove", event => {
        mouse.x = (event.clientX / window.innerWidth - 0.5) * 0.7;
        mouse.y = (event.clientY / window.innerHeight - 0.5) * 0.7;
    });

    prefersLight.addEventListener("change", () => {
        particlesMaterial.color.set(prefersLight.matches ? 0x7c3aed : 0x9d4edd);
        particlesMaterial.opacity = prefersLight.matches ? 0.45 : 0.75;

        shapeMaterial.color.set(prefersLight.matches ? 0x0284c7 : 0x00d4ff);
        shapeMaterial.opacity = prefersLight.matches ? 0.18 : 0.24;

        secondMaterial.color.set(prefersLight.matches ? 0xd97706 : 0xffb703);
        secondMaterial.opacity = prefersLight.matches ? 0.16 : 0.22;
    });

    function animate() {
        requestAnimationFrame(animate);

        particles.rotation.y += 0.0008;
        particles.rotation.x += 0.00035;

        shape.rotation.x += 0.004;
        shape.rotation.y += 0.006;

        secondShape.rotation.x -= 0.004;
        secondShape.rotation.y += 0.005;

        camera.position.x += (mouse.x - camera.position.x) * 0.025;
        camera.position.y += (-mouse.y - camera.position.y) * 0.025;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}

initGsapAnimations();
initThreeBackground();