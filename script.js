// ===== MATRIX RAIN EFFECT =====
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

// Set canvas size to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Characters for the matrix effect (mix of letters, numbers, symbols, and Japanese characters)
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

// Font size and column setup
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

// Initialize drops with random starting positions
for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
}

// Draw the matrix rain effect
function drawMatrix() {
    // Create fade effect by drawing semi-transparent black rectangle
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = fontSize + 'px monospace';

    // Draw each column
    for (let i = 0; i < drops.length; i++) {
        // Pick a random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Vary brightness for depth effect
        const brightness = Math.random();
        if (brightness > 0.95) {
            ctx.fillStyle = '#ffffff'; // Bright white for leading characters
        } else if (brightness > 0.8) {
            ctx.fillStyle = '#00ff9d'; // Bright green
        } else if (brightness > 0.5) {
            ctx.fillStyle = '#00cc7a'; // Medium green
        } else {
            ctx.fillStyle = '#008855'; // Dark green
        }
        
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly after it goes off screen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        // Move drop down
        drops[i]++;
    }
}

// Run the animation at ~25fps
setInterval(drawMatrix, 40);

// ===== RESIZE HANDLER =====
// Adjust canvas and drops when window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Recalculate columns and adjust drops array
    const newColumns = canvas.width / fontSize;
    drops.length = Math.floor(newColumns);
    
    // Initialize new drops if array grew
    for (let i = 0; i < drops.length; i++) {
        if (drops[i] === undefined) {
            drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
        }
    }
});

// ===== SMOOTH SCROLLING =====
// Add smooth scroll behavior to all navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Get the target section
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Smooth scroll to target
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== TYPING EFFECT =====
// Enhanced typing effect to simulate terminal behavior
function typeWriter(element, lines, charSpeed = 50, lineDelay = 1000) {
    let lineIndex = 0;
    let charIndex = 0;
    element.innerHTML = '';

    function type() {
        if (lineIndex < lines.length) {
            const currentLine = lines[lineIndex];
            if (charIndex < currentLine.length) {
                // Type next character
                element.innerHTML += currentLine.charAt(charIndex);
                charIndex++;
                setTimeout(type, charSpeed);
            } else {
                // Move to next line
                element.innerHTML += '<br>';
                lineIndex++;
                charIndex = 0;
                setTimeout(type, lineDelay);
            }
        } else {
            // Add blinking cursor at the end
            element.innerHTML += '<span class="cursor">_</span>';
        }
    }
    type();
}

// Initialize typing effect on page load
document.addEventListener('DOMContentLoaded', () => {
    const terminalText = document.querySelector('.terminal-text');
    // Extract text content, preserving line breaks
    const textContent = terminalText.textContent || terminalText.innerText;
    const lines = textContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    terminalText.innerHTML = '';
    typeWriter(terminalText, lines, 10, 400);
});

// ===== SCROLL-TRIGGERED ANIMATIONS =====
// Add slide-in and staggered animations when sections come into view
function animateOnScroll() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                entry.target.classList.add('fade-in');

                // Apply specific animations based on section
                if (sectionId === 'about') {
                    entry.target.classList.add('slide-in-left');
                } else if (sectionId === 'skills') {
                    entry.target.classList.add('slide-in-right');
                } else if (sectionId === 'projects') {
                    entry.target.classList.add('slide-in-up');
                } else if (sectionId === 'experience') {
                    entry.target.classList.add('slide-in-left');
                } else if (sectionId === 'testimonials') {
                    entry.target.classList.add('slide-in-up');
                } else if (sectionId === 'contact') {
                    entry.target.classList.add('slide-in-right');
                }
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
}

// Staggered animations for cards
function animateCardsOnScroll() {
    const cardSelectors = [
        '.skill-card',
        '.project-card',
        '.experience-item',
        '.cert-card'
    ];

    cardSelectors.forEach(selector => {
        const cards = document.querySelectorAll(selector);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('stagger-fade-in', `stagger-${(index % 8) + 1}`);
                    }, index * 100); // Stagger delay
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => observer.observe(card));
    });
}

// Add floating animations to icons
function addFloatingAnimations() {
    const icons = document.querySelectorAll('.highlight-item i, .social-links a i, .cert-card i');
    icons.forEach((icon, index) => {
        setTimeout(() => {
            icon.classList.add('float-animation');
        }, index * 200); // Stagger the start of floating
    });
}

// Parallax effect for matrix background
function addParallaxEffect() {
    let lastScrollY = window.scrollY;

    function updateParallax() {
        const currentScrollY = window.scrollY;
        const deltaY = currentScrollY - lastScrollY;

        // Subtle parallax movement
        const matrixCanvas = document.getElementById('matrix');
        const currentTransform = matrixCanvas.style.transform || 'translateY(0px)';
        const currentY = parseFloat(currentTransform.replace('translateY(', '').replace('px)', '')) || 0;
        const newY = currentY + deltaY * 0.1; // Adjust multiplier for parallax intensity

        matrixCanvas.style.transform = `translateY(${newY}px)`;

        lastScrollY = currentScrollY;
        requestAnimationFrame(updateParallax);
    }

    requestAnimationFrame(updateParallax);
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    animateCardsOnScroll();
    addFloatingAnimations();
    addParallaxEffect();
});

// ===== FORM VALIDATION =====
// Enhanced form validation with real-time feedback
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;

    // Name validation
    if (name.value.trim().length < 2) {
        showError(name, 'Name must be at least 2 characters');
        isValid = false;
    } else {
        clearError(name);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError(email);
    }

    // Message validation
    if (message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters');
        isValid = false;
    } else {
        clearError(message);
    }

    return isValid;
}

function showError(input, message) {
    const formGroup = input.parentElement;
    let error = formGroup.querySelector('.error-message');
    if (!error) {
        error = document.createElement('div');
        error.className = 'error-message';
        error.style.color = '#ff6b6b';
        error.style.fontSize = '0.85rem';
        error.style.marginTop = '0.5rem';
        error.style.fontWeight = '500';
        formGroup.appendChild(error);
    }
    error.textContent = message;
    input.style.borderColor = '#ff6b6b';
    input.style.boxShadow = '0 0 0 2px rgba(255, 107, 107, 0.2)';
}

function clearError(input) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    if (error) error.remove();
    input.style.borderColor = 'rgba(0, 255, 157, 0.3)';
    input.style.boxShadow = 'none';
}

// Real-time validation
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    nameInput.addEventListener('blur', () => {
        if (nameInput.value.trim().length < 2 && nameInput.value.trim().length > 0) {
            showError(nameInput, 'Name must be at least 2 characters');
        } else if (nameInput.value.trim().length >= 2) {
            clearError(nameInput);
        }
    });

    emailInput.addEventListener('blur', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value && !emailRegex.test(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
        } else if (emailInput.value && emailRegex.test(emailInput.value)) {
            clearError(emailInput);
        }
    });

    messageInput.addEventListener('blur', () => {
        if (messageInput.value.trim().length < 10 && messageInput.value.trim().length > 0) {
            showError(messageInput, 'Message must be at least 10 characters');
        } else if (messageInput.value.trim().length >= 10) {
            clearError(messageInput);
        }
    });
});

// ===== FORM SUBMISSION =====
// Enhanced form submission with better success/error handling
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
        submitBtn.disabled = true;

        // EmailJS configuration - Replace with your actual service details
        const serviceID = 'your_service_id'; // Replace with your EmailJS service ID
        const templateID = 'your_template_id'; // Replace with your EmailJS template ID
        const publicKey = 'your_public_key'; // Replace with your EmailJS public key

        // Prepare template parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_name: 'Kishanth R', // Replace with your name
        };

        // Send email using EmailJS
        emailjs.send(serviceID, templateID, templateParams, publicKey)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                showFormMessage('success', 'Message sent successfully! I will get back to you within 24 hours.');
                e.target.reset();
                // Clear any validation errors
                clearError(document.getElementById('name'));
                clearError(document.getElementById('email'));
                clearError(document.getElementById('message'));
            })
            .catch((error) => {
                console.log('FAILED...', error);
                showFormMessage('error', 'Failed to send message. Please try again or contact me directly at bl4ck.v0r73x@gmail.com');
            })
            .finally(() => {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    } else {
        showFormMessage('error', 'Please correct the errors above and try again.');
    }
});

// Form message display function
function showFormMessage(type, message) {
    const form = document.querySelector('.contact-form');
    let messageDiv = form.querySelector('.form-message');

    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.className = 'form-message';
        form.insertBefore(messageDiv, form.firstChild);
    }

    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// ===== SCROLL TO TOP FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Smooth scroll to top
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
