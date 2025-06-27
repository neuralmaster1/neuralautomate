// Mobile menu functionality and all main scripts

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    function toggleMenu() {
        navLinks.classList.toggle('active');
    }
    if (mobileMenuBtn) {
        mobileMenuBtn.style.display = 'block';
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }
    // Close menu on link click (mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) navLinks.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            navbar.style.boxShadow = 'var(--shadow-sm)';
            navbar.style.transform = 'translateY(0)';
            return;
        }
        if (currentScroll > lastScroll) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
            navbar.style.boxShadow = 'var(--shadow-md)';
        }
        lastScroll = currentScroll;
    });

    // Subtle parallax for hero floating shapes
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        document.querySelectorAll('.hero-bg-animated [data-parallax]').forEach(el => {
            const factor = parseFloat(el.getAttribute('data-parallax')) || 0.5;
            el.style.transform = `translateY(${scrollY * factor * 0.15}px)`;
        });
    });

    // Fade-in animation for cards on scroll (staggered)
    const fadeEls = document.querySelectorAll('.fade-in');
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 120); // staggered reveal
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => fadeInObserver.observe(el));

    // Add scroll margin to account for fixed navbar
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.scrollMarginTop = document.querySelector('.navbar').offsetHeight + 'px';
    });

    // Form submission handling with inline validation and error banner
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        // Insert error message banner if not present
        let errorBanner = contactForm.querySelector('.error-message');
        if (!errorBanner) {
            errorBanner = document.createElement('div');
            errorBanner.className = 'error-message';
            contactForm.prepend(errorBanner);
        }
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            errorBanner.classList.remove('visible');
            errorBanner.textContent = '';
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                errorBanner.textContent = 'Please fill out all required fields correctly.';
                errorBanner.classList.add('visible');
                return;
            }
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = '✓ Thank you! We\'ll be in touch soon.';
                    contactForm.appendChild(successMessage);
                    contactForm.reset();
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                errorBanner.textContent = 'Something went wrong. Please try again.';
                errorBanner.classList.add('visible');
            } finally {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }
        });
    }
}); 