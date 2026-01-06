document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced Intersection Observer for staggered fade-in animations
    const fadeElements = document.querySelectorAll('.service-card, .testimonial-card, .value-card, .use-case-card, .portfolio-card, .feature, .stat');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Get all siblings in the same grid/container for staggered animation
                const parent = entry.target.parentElement;
                const siblings = Array.from(parent.children).filter(child =>
                    child.classList.contains('service-card') ||
                    child.classList.contains('testimonial-card') ||
                    child.classList.contains('value-card') ||
                    child.classList.contains('use-case-card') ||
                    child.classList.contains('portfolio-card') ||
                    child.classList.contains('feature') ||
                    child.classList.contains('stat')
                );

                const index = siblings.indexOf(entry.target);
                const delay = index * 100; // 100ms stagger between items

                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, delay);

                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        fadeObserver.observe(element);
    });

    // Section header animations
    const sectionHeaders = document.querySelectorAll('.section-header');

    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                headerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    sectionHeaders.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(20px)';
        header.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        headerObserver.observe(header);
    });

    // Stats counter animation with enhanced easing
    const statNumbers = document.querySelectorAll('.stat-number');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                const hasPlus = target.textContent.includes('+');
                let current = 0;
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out cubic for smooth deceleration
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    current = Math.floor(easeOut * finalValue);

                    target.textContent = current.toString() + (hasPlus ? '+' : '');

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };

                requestAnimationFrame(animate);
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.padding = '0.75rem 0';
            header.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            header.style.padding = '1.25rem 0';
            header.style.background = 'rgba(10, 10, 15, 0.8)';
        }

        lastScroll = currentScroll;
    });

    // Parallax effect for hero gradient orbs (subtle)
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;

            if (scrolled < heroHeight) {
                const parallaxValue = scrolled * 0.3;
                hero.style.setProperty('--parallax-y', `${parallaxValue}px`);
            }
        });
    }

    // Form submission with validation
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic form validation
            const formFields = contactForm.querySelectorAll('input:not([type="hidden"]), textarea');
            let isValid = true;

            formFields.forEach(field => {
                if (field.required && !field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    shakeElement(field);
                } else {
                    field.classList.remove('error');
                }

                if (field.type === 'email' && field.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value.trim())) {
                        isValid = false;
                        field.classList.add('error');
                        shakeElement(field);
                    }
                }
            });

            if (!isValid) {
                showFormMessage('Please fill out all required fields correctly.', 'error');
                return;
            }

            // Submit form if valid
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            submitButton.style.opacity = '0.7';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    contactForm.reset();
                    showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                showFormMessage('Something went wrong. Please try again later.', 'error');
                console.error('Form submission error:', error);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                submitButton.style.opacity = '1';
            }
        });

        // Add focus animations to form fields
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });

        // Helper function to shake element
        function shakeElement(element) {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = 'shake 0.5s ease-in-out';
        }

        // Helper function to show form messages
        function showFormMessage(message, type) {
            let messageElement = contactForm.querySelector('.form-message');

            if (!messageElement) {
                messageElement = document.createElement('div');
                messageElement.className = 'form-message';
                contactForm.prepend(messageElement);
            }

            messageElement.textContent = message;
            messageElement.className = `form-message ${type}`;
            messageElement.style.display = 'block';

            // Fade in
            messageElement.style.opacity = '0';
            messageElement.offsetHeight; // Trigger reflow
            messageElement.style.opacity = '1';

            // Auto-hide the message after 5 seconds
            setTimeout(() => {
                messageElement.classList.add('hide');
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }, 5000);
        }
    }

    // Add dynamic CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group textarea.error {
            border-color: #ff4757 !important;
            box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.2) !important;
        }

        .form-message {
            padding: 1rem 1.25rem;
            border-radius: 16px;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            font-weight: 500;
            opacity: 1;
            transition: opacity 0.3s ease;
        }

        .form-message.error {
            background: rgba(255, 71, 87, 0.15);
            border: 1px solid rgba(255, 71, 87, 0.3);
            color: #ff6b7a;
        }

        .form-message.success {
            background: rgba(46, 213, 115, 0.15);
            border: 1px solid rgba(46, 213, 115, 0.3);
            color: #2ed573;
        }

        .form-message.hide {
            opacity: 0;
        }

        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .section-header.animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .form-group.focused label {
            color: #ff6b4a;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        /* Smooth scrollbar for webkit browsers */
        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background: #0a0a0f;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(255, 107, 74, 0.3);
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 107, 74, 0.5);
        }

        /* Menu open state */
        body.menu-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
});
