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
// Add fade-in animation when sections come into view
function animateOnScroll() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', animateOnScroll);

// ===== FORM VALIDATION =====
// Dynamic form validation
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
        showError(email, 'Please enter a valid email');
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
        formGroup.appendChild(error);
    }
    error.textContent = message;
    input.classList.add('error');
}

function clearError(input) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    if (error) error.remove();
    input.classList.remove('error');
}

// ===== FORM SUBMISSION =====
// Handle contact form submission with validation and EmailJS
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
        submitBtn.textContent = 'Sending...';
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
            to_name: 'Your Name', // Replace with your name
        };

        // Send email using EmailJS
        emailjs.send(serviceID, templateID, templateParams, publicKey)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                alert('Message sent successfully! I will get back to you soon.');
                e.target.reset();
            })
            .catch((error) => {
                console.log('FAILED...', error);
                alert('Failed to send message. Please try again or contact me directly.');
            })
            .finally(() => {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    }
});
