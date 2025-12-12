// ===== PARTICLE NETWORK ANIMATION =====
// OK so this particle animation took me FOREVER to figure out
// Had to learn about the Canvas API from MDN - it's pretty cool once you get it
// Basic idea: create particles that move around and connect when they're close to each other

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');  // 2d context for drawing
let particles = [];
let animationId;  // store this so we can cancel animation if needed

// Resize canvas to fill the entire window
// This needs to be called on window resize too
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Particle class - each particle is an object with position, speed, etc.
// Got the idea from a YouTube tutorial but modified it a lot
class Particle {
    constructor() {
        // Random starting position anywhere on the canvas
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;  // particle size between 1-3px

        // Speed - subtract 0.5 so particles can move in any direction
        // Multiplied by 0.5 to make them move slower (was too fast before)
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;

        // Random opacity so some particles are more visible than others
        this.opacity = Math.random() * 0.5 + 0.2;  // between 0.2 and 0.7
    }

    // Update particle position each frame
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges - just reverse direction
        // Originally tried wrapping around but bouncing looks better
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    // Draw the particle as a circle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 170, ${this.opacity})`;  // teal color with opacity
        ctx.fill();
    }
}

// Create all the particles
// Fewer particles on smaller screens so it doesn't lag on mobile
function initParticles() {
    particles = [];
    // Math here calculates particle count based on screen size
    // Cap at 80 particles max otherwise it gets too slow
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Draw lines between particles that are close to each other
// This is what creates that cool network effect
function connectParticles() {
    // Loop through all particle pairs
    // Using i and j to avoid checking the same pair twice
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            // Calculate distance between particles
            // Using Pythagorean theorem: distance = sqrt(dx² + dy²)
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only connect if distance is less than 150px
            // Tried different values - 150 looks best
            if (distance < 150) {
                // Line fades out as particles get further apart
                const opacity = (1 - distance / 150) * 0.3;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 212, 170, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Main animation loop
// This runs continuously using requestAnimationFrame
function animateParticles() {
    // Clear the canvas before drawing the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw each particle
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw the connecting lines
    connectParticles();

    // Request next frame - this creates the animation loop
    animationId = requestAnimationFrame(animateParticles);
}

// Initialize everything when page loads
resizeCanvas();
initParticles();
animateParticles();

// Handle window resize - recreate particles for new canvas size
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// ===== TYPING EFFECT =====
// Typing animation for the hero subtitle
// Cycles through different job titles with typing/deleting effect
// This took me way longer than it should have to get the timing right lol

const phrases = [
    'Cloud Computing Graduate',
    'AWS Solutions Developer',
    'ServiceNow Automation Specialist',
    'DevOps Engineer',
    'Security & IAM Developer',
    'Python Automation Expert',
    'Infrastructure as Code'
];

let phraseIndex = 0;  // which phrase we're on
let charIndex = 0;  // which character we're typing
let isDeleting = false;  // are we typing or deleting?
const typingElement = document.getElementById('typingText');

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    // Either add or remove one character
    if (isDeleting) {
        // Deleting - remove last character
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Typing - add next character
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    // Speed of typing/deleting
    // Deleting is faster than typing
    let typeSpeed = isDeleting ? 50 : 100;

    // When we finish typing the whole phrase
    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;  // pause for 2 seconds before deleting
        isDeleting = true;
    }
    // When we finish deleting
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;  // move to next phrase (loops back to start)
        typeSpeed = 500;  // small pause before typing next phrase
    }

    // Call this function again after typeSpeed milliseconds
    setTimeout(typeEffect, typeSpeed);
}

// Start the typing effect
typeEffect();

// ===== NAVBAR SCROLL BEHAVIOR =====
// Hide top navbar when scrolling down, show bottom navbar
// Spent a while getting this to feel smooth and not jumpy

const navbarTop = document.getElementById('navbarTop');
const navbarBottom = document.getElementById('navbarBottom');
let lastScrollY = window.scrollY;
const heroSection = document.getElementById('hero');

function handleScroll() {
    const heroHeight = heroSection.offsetHeight;
    const currentScrollY = window.scrollY;

    // Show bottom navbar after scrolling past 30% of hero section
    // Hide top navbar at the same point
    // Tried different percentages - 30% feels most natural
    if (currentScrollY > heroHeight * 0.3) {
        navbarTop.classList.add('hidden');
        navbarBottom.classList.add('visible');
    } else {
        navbarTop.classList.remove('hidden');
        navbarBottom.classList.remove('visible');
    }

    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleScroll);

// ===== PROJECT FILTERING =====
// Filter project cards by year
// Clicking a filter button shows/hides cards with fade animation

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filter = btn.dataset.filter;  // get the data-filter attribute

        // Show/hide cards based on filter
        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.year === filter) {
                // Show this card
                card.style.display = 'block';
                // Small delay so the fade-in animation works properly
                // Had to use setTimeout because display change needs to happen first
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                // Hide this card
                // Fade out first, then hide
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);  // wait for fade animation to finish
            }
        });
    });
});

// ===== SCROLL ANIMATIONS =====
// Fade in elements when they scroll into view
// Using Intersection Observer API - way better than scroll event listeners
// Learned about this from Stack Overflow - it's perfect for this use case

const observerOptions = {
    threshold: 0.1,  // trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px'  // trigger slightly before element enters viewport
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Element is now visible - add the 'visible' class
            // CSS handles the actual animation
            entry.target.classList.add('visible');
        }
        // Note: not removing 'visible' when scrolling back up
        // Want elements to stay visible once they've been revealed
    });
}, observerOptions);

// Observe all elements with the animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// ===== CONTACT MODAL =====
// Modal popup for contact information
// Built this from scratch instead of using Bootstrap's modal

function openModal() {
    document.getElementById('contactModal').classList.add('active');
    document.body.style.overflow = 'hidden';  // prevent background scrolling
}

function closeModal() {
    document.getElementById('contactModal').classList.remove('active');
    document.body.style.overflow = '';  // restore scrolling
}

// Close modal when clicking outside of it
// e.target is what was actually clicked
document.getElementById('contactModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('contactModal')) {
        closeModal();
    }
});

// Close modal with Escape key
// This is standard UX practice for modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
// Smooth scrolling for navigation links
// Prevents the default jump behavior

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();  // stop the default jump
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            // Smooth scroll to the target element
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'  // align to top of viewport
            });
        }
    });
});

// console.log('All scripts loaded successfully!');  // kept this for debugging