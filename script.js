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
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.service-card, .testimonial-card, .value-card, .use-case-card, .portfolio-card');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });
    
    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.textContent);
                let current = 0;
                const increment = value / 40;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= value) {
                        target.textContent = value.toString() + (target.textContent.includes('+') ? '+' : '');
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current).toString() + (target.textContent.includes('+') ? '+' : '');
                    }
                }, 25);
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
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
                } else {
                    field.classList.remove('error');
                }
                
                if (field.type === 'email' && field.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value.trim())) {
                        isValid = false;
                        field.classList.add('error');
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
            }
        });
        
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
            
            // Auto-hide the message after 5 seconds
            setTimeout(() => {
                messageElement.classList.add('hide');
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }, 5000);
        }
    }
    
    // Add CSS for form validation and messages
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group textarea.error {
            border-color: #ff3b30;
        }
        
        .form-message {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        
        .form-message.error {
            background-color: rgba(255, 59, 48, 0.1);
            color: #ff3b30;
        }
        
        .form-message.success {
            background-color: rgba(52, 199, 89, 0.1);
            color: #34c759;
        }
        
        .form-message.hide {
            opacity: 0;
        }
        
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}); 