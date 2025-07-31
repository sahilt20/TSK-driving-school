// TSK Driving School - Automatic Only Website JavaScript

// Application data from provided JSON
const appData = {
  areas: [
    {
      name: "Coventry",
      hourlyRate: 34,
      packages: {
        "5hours": 165,
        "10hours": 330,
        "20hours": 650,
        "40hours": 1280
      }
    },
    {
      name: "Nuneaton", 
      hourlyRate: 36,
      packages: {
        "5hours": 175,
        "10hours": 350,
        "20hours": 690,
        "40hours": 1360
      }
    },
    {
      name: "Warwick",
      hourlyRate: 36,
      packages: {
        "5hours": 175,
        "10hours": 350,
        "20hours": 690,
        "40hours": 1360
      }
    },
    {
      name: "Rugby",
      hourlyRate: 36,
      packages: {
        "5hours": 175,
        "10hours": 350,
        "20hours": 690,
        "40hours": 1360
      }
    }
  ],
  testimonials: [
    {
      name: "Marcus Thompson",
      area: "Coventry",
      rating: 5,
      text: "TSK's automatic lessons were fantastic! As a busy professional, I appreciated how quickly I could focus on actual driving skills rather than clutch control. Passed first time!",
      image: "attachment1"
    },
    {
      name: "Priya Patel", 
      area: "Warwick",
      rating: 5,
      text: "I was so nervous about learning to drive, but automatic lessons with TSK gave me confidence. No stalling, no stress - just smooth learning. Highly recommend!",
      image: "attachment2"
    },
    {
      name: "Emma Williams",
      area: "Rugby", 
      rating: 5,
      text: "The automatic lessons were perfect for my schedule. I could concentrate on road awareness and hazard perception without worrying about gears. Excellent instruction!",
      image: "attachment3"
    },
    {
      name: "Jake Morrison",
      area: "Nuneaton",
      rating: 5,
      text: "Initially worried automatic would be 'cheating', but it's actually the smarter choice. Learned faster, felt more confident, and now I'm a safe driver on the roads!",
      image: "attachment4"
    }
  ],
  benefits: [
    {
      title: "Easier Learning Curve",
      description: "Focus on road awareness and hazards without clutch control complexity",
      icon: "🎯"
    },
    {
      title: "Faster Progress", 
      description: "Typically require 20% fewer lessons than manual transmission",
      icon: "⚡"
    },
    {
      title: "Less Stress",
      description: "No stalling, no rolling back on hills, more confidence building",
      icon: "😌"
    },
    {
      title: "Better for Traffic",
      description: "Ideal for urban driving with stop-start traffic conditions",
      icon: "🚦"
    },
    {
      title: "Enhanced Safety",
      description: "Keep both hands on wheel, better hazard perception",
      icon: "🛡️"
    },
    {
      title: "Future Ready",
      description: "Most new cars are automatic, especially electric vehicles",
      icon: "🔮"
    }
  ],
  contact: {
    phone: "07850 900 382",
    whatsapp: "447850900382",
    email: "info@tskdriving.co.uk"
  }
};

// Global state
let currentArea = 'Coventry';
let currentTestimonialIndex = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing TSK Driving School website...');
  
  // Initialize all components
  initNavigation();
  initAreas();
  initBenefits();
  initPricingSystem();
  initTestimonials();
  initContactForm();
  initAnimations();
  initSmoothScrolling();
  updateWhatsAppMessage();
  
  console.log('Website initialized successfully');
});

// Navigation functionality
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }
}

// Initialize areas section
function initAreas() {
  const areasGrid = document.getElementById('areas-grid');
  if (!areasGrid) return;
  
  areasGrid.innerHTML = '';
  
  appData.areas.forEach((area, index) => {
    const areaCard = document.createElement('div');
    areaCard.className = `area__card ${index === 0 ? 'active' : ''}`;
    areaCard.dataset.area = area.name;
    
    areaCard.innerHTML = `
      <h3 class="area__title">${area.name}</h3>
      <p class="area__description">Professional automatic driving lessons with experienced instructors who know the local test routes and driving conditions.</p>
      <div class="area__pricing">
        <span class="area__price">Automatic: <span class="area__hourly">£${area.hourlyRate}/hr</span></span>
      </div>
    `;
    
    areaCard.addEventListener('click', function() {
      selectArea(area.name);
    });
    
    areasGrid.appendChild(areaCard);
  });
}

// Initialize benefits section
function initBenefits() {
  const benefitsGrid = document.getElementById('benefits-grid');
  if (!benefitsGrid) return;
  
  benefitsGrid.innerHTML = '';
  
  appData.benefits.forEach(benefit => {
    const benefitCard = document.createElement('div');
    benefitCard.className = 'benefit__card';
    
    benefitCard.innerHTML = `
      <div class="benefit__icon">${benefit.icon}</div>
      <h3 class="benefit__title">${benefit.title}</h3>
      <p class="benefit__description">${benefit.description}</p>
    `;
    
    benefitsGrid.appendChild(benefitCard);
  });
}

// Area selection functionality
function selectArea(areaName) {
  console.log('Selecting area:', areaName);
  currentArea = areaName;
  
  // Update area cards
  const areaCards = document.querySelectorAll('.area__card');
  areaCards.forEach(card => {
    card.classList.remove('active');
    if (card.dataset.area === areaName) {
      card.classList.add('active');
    }
  });
  
  // Update area select dropdown
  const areaSelect = document.getElementById('area-select');
  if (areaSelect) {
    areaSelect.value = areaName;
  }
  
  // Update pricing
  updatePackagePricing();
  updateWhatsAppMessage();
}

// Pricing system
function initPricingSystem() {
  const areaSelect = document.getElementById('area-select');
  
  if (areaSelect) {
    areaSelect.addEventListener('change', function() {
      console.log('Area dropdown changed to:', this.value);
      selectArea(this.value);
    });
  }
  
  // Initial pricing display
  updatePackagePricing();
}

function updatePackagePricing() {
  const packagesGrid = document.getElementById('packages-grid');
  if (!packagesGrid) return;
  
  const selectedArea = appData.areas.find(area => area.name === currentArea);
  if (!selectedArea) return;
  
  console.log('Updating pricing for', currentArea, '- Hourly rate:', selectedArea.hourlyRate);
  
  packagesGrid.innerHTML = '';
  
  const packageOptions = [
    { hours: 5, name: "Starter Package", description: "Perfect for beginners", popular: false },
    { hours: 10, name: "Foundation Package", description: "Build solid driving skills", popular: false },
    { hours: 20, name: "Comprehensive Package", description: "Most popular choice", popular: true },
    { hours: 40, name: "Complete Mastery", description: "From beginner to test ready", popular: false }
  ];
  
  packageOptions.forEach(pkg => {
    const packagePrice = selectedArea.packages[`${pkg.hours}hours`];
    const regularPrice = pkg.hours * selectedArea.hourlyRate;
    const savings = regularPrice - packagePrice;
    const pricePerHourPackage = packagePrice / pkg.hours;
    
    const packageCard = document.createElement('div');
    packageCard.className = `package__card ${pkg.popular ? 'popular' : ''}`;
    
    packageCard.innerHTML = `
      ${pkg.popular ? '<div class="package__popular">Most Popular</div>' : ''}
      <h3 class="package__title">${pkg.name}</h3>
      <p class="package__description">${pkg.description}</p>
      <div class="package__hours">${pkg.hours} Hours</div>
      <div class="package__price">£${packagePrice}</div>
      <div class="package__per-hour">£${pricePerHourPackage.toFixed(2)} per hour</div>
      ${savings > 0 ? `<div class="package__savings">Save £${savings}!</div>` : ''}
      <button class="btn btn--primary" onclick="bookPackage('${pkg.name}', '${currentArea}', ${pkg.hours}, ${packagePrice})">Book Now</button>
    `;
    
    packagesGrid.appendChild(packageCard);
  });
}

// Global function for booking packages
window.bookPackage = function(packageName, area, hours, price) {
  const whatsappMessage = `Hi! I'm interested in the ${packageName} (${hours} hours, £${price}) for automatic lessons in ${area}. Can you provide more information?`;
  const whatsappUrl = `https://wa.me/${appData.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
  console.log('Opening WhatsApp with message:', whatsappMessage);
  window.open(whatsappUrl, '_blank');
};

// Testimonials carousel
function initTestimonials() {
  const testimonialsContainer = document.getElementById('testimonials-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (!testimonialsContainer) return;
  
  renderTestimonials();
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      currentTestimonialIndex = Math.max(0, currentTestimonialIndex - 1);
      updateTestimonialCarousel();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      const maxIndex = Math.max(0, appData.testimonials.length - getVisibleTestimonials());
      currentTestimonialIndex = Math.min(maxIndex, currentTestimonialIndex + 1);
      updateTestimonialCarousel();
    });
  }
}

function renderTestimonials() {
  const testimonialsContainer = document.getElementById('testimonials-container');
  if (!testimonialsContainer) return;
  
  testimonialsContainer.innerHTML = '';
  
  appData.testimonials.forEach(testimonial => {
    const testimonialCard = document.createElement('div');
    testimonialCard.className = 'testimonial__card';
    
    const stars = '★'.repeat(testimonial.rating);
    
    testimonialCard.innerHTML = `
      <div class="testimonial__stars">${stars}</div>
      <p class="testimonial__text">"${testimonial.text}"</p>
      <div class="testimonial__author">${testimonial.name}</div>
      <div class="testimonial__area">${testimonial.area}</div>
    `;
    
    testimonialsContainer.appendChild(testimonialCard);
  });
}

function updateTestimonialCarousel() {
  const testimonialsContainer = document.getElementById('testimonials-container');
  if (!testimonialsContainer) return;
  
  const cardWidth = 350 + 24; // card width + gap
  const scrollLeft = currentTestimonialIndex * cardWidth;
  testimonialsContainer.scrollTo({
    left: scrollLeft,
    behavior: 'smooth'
  });
}

function getVisibleTestimonials() {
  const testimonialsContainer = document.getElementById('testimonials-container');
  if (!testimonialsContainer) return 1;
  
  const containerWidth = testimonialsContainer.offsetWidth;
  const cardWidth = 350 + 24;
  return Math.floor(containerWidth / cardWidth);
}

// Contact form
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Contact form submitted');
    
    if (validateForm()) {
      submitForm();
    }
  });
}

function validateForm() {
  const requiredFields = ['name', 'email', 'phone', 'service-area'];
  let isValid = true;
  
  console.log('Validating form...');
  
  // Clear previous error messages
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(msg => msg.remove());
  
  const formControls = document.querySelectorAll('.form-control');
  formControls.forEach(control => {
    control.classList.remove('error', 'success');
  });
  
  requiredFields.forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (!field) {
      console.error('Field not found:', fieldName);
      return;
    }
    
    const value = field.value.trim();
    
    if (!value) {
      showFieldError(field, 'This field is required');
      isValid = false;
      console.log('Field validation failed:', fieldName, 'is required');
    } else if (fieldName === 'email' && !isValidEmail(value)) {
      showFieldError(field, 'Please enter a valid email address');
      isValid = false;
      console.log('Email validation failed:', value);
    } else if (fieldName === 'phone' && !isValidPhone(value)) {
      showFieldError(field, 'Please enter a valid phone number');
      isValid = false;
      console.log('Phone validation failed:', value);
    } else {
      field.classList.add('success');
      console.log('Field validation passed:', fieldName);
    }
  });
  
  console.log('Form validation result:', isValid);
  return isValid;
}

function showFieldError(field, message) {
  field.classList.add('error');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  field.parentNode.appendChild(errorDiv);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

function submitForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  console.log('Submitting form...');
  
  // Show loading state
  submitBtn.classList.add('loading');
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  // Simulate form submission (in real implementation, this would send to a server)
  setTimeout(() => {
    // Reset form
    contactForm.reset();
    
    // Reset button
    submitBtn.classList.remove('loading');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Show success message
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    
    // Clear validation classes
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
      control.classList.remove('error', 'success');
    });
    
    console.log('Form submitted successfully');
  }, 2000);
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: calc(var(--header-height) + 20px);
    right: 20px;
    background: var(--color-${type === 'success' ? 'success' : 'primary'});
    color: white;
    padding: var(--space-16) var(--space-20);
    border-radius: var(--radius-base);
    box-shadow: var(--shadow-lg);
    z-index: 1001;
    max-width: 400px;
    transform: translateX(100%);
    transition: transform var(--duration-normal) var(--ease-standard);
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Smooth scrolling
function initSmoothScrolling() {
  console.log('Initializing smooth scrolling...');
  
  // Get all navigation links that start with #
  const navLinks = document.querySelectorAll('a[href^="#"]');
  console.log('Found navigation links:', navLinks.length);
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just a hash without ID
      if (href === '#') return;
      
      e.preventDefault();
      
      const targetId = href;
      console.log('Clicking navigation link:', targetId);
      
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerOffset = 80;
        const elementPosition = targetSection.offsetTop;
        const offsetPosition = elementPosition - headerOffset;
        
        console.log('Scrolling to:', targetId, 'at position:', offsetPosition);
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        console.warn('Target section not found:', targetId);
      }
    });
  });
}

// Animations on scroll
function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Add fade-in class to elements that should animate
  const animatedElements = document.querySelectorAll('.section__header, .area__card, .package__card, .benefit__card, .testimonial__card');
  animatedElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// Update WhatsApp floating button with dynamic message
function updateWhatsAppMessage() {
  const whatsappFloat = document.getElementById('whatsapp-float');
  if (!whatsappFloat) return;
  
  const selectedArea = appData.areas.find(area => area.name === currentArea);
  const hourlyRate = selectedArea ? selectedArea.hourlyRate : 36;
  
  const message = `Hi! I'm interested in automatic driving lessons in ${currentArea} (£${hourlyRate}/hr). Can you help me get started?`;
  const url = `https://wa.me/${appData.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  whatsappFloat.href = url;
  console.log('Updated WhatsApp message for:', currentArea);
}

// Responsive testimonial carousel
function handleResize() {
  // Reset testimonial carousel on resize
  currentTestimonialIndex = 0;
  updateTestimonialCarousel();
}

window.addEventListener('resize', handleResize);

// Update active navigation link on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const navLink = document.querySelector(`a[href="#${section.id}"]`);
    
    if (navLink) {
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav__link').forEach(link => link.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);

// Auto-scroll testimonials every 5 seconds
setInterval(() => {
  const maxIndex = Math.max(0, appData.testimonials.length - getVisibleTestimonials());
  currentTestimonialIndex = currentTestimonialIndex >= maxIndex ? 0 : currentTestimonialIndex + 1;
  updateTestimonialCarousel();
}, 5000);

// Handle touch events for testimonial carousel
let startX = 0;
let currentX = 0;
let isDragging = false;

// Add event listeners after DOM is loaded
setTimeout(() => {
  const testimonialsContainer = document.getElementById('testimonials-container');
  if (testimonialsContainer) {
    testimonialsContainer.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    testimonialsContainer.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    });

    testimonialsContainer.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;
      
      const diffX = startX - currentX;
      const threshold = 50;
      
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          // Swipe left - next testimonial
          const maxIndex = Math.max(0, appData.testimonials.length - getVisibleTestimonials());
          currentTestimonialIndex = Math.min(maxIndex, currentTestimonialIndex + 1);
        } else {
          // Swipe right - previous testimonial
          currentTestimonialIndex = Math.max(0, currentTestimonialIndex - 1);
        }
        updateTestimonialCarousel();
      }
    });
  }
}, 500);

// Keyboard navigation for testimonial carousel
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') {
    currentTestimonialIndex = Math.max(0, currentTestimonialIndex - 1);
    updateTestimonialCarousel();
  } else if (e.key === 'ArrowRight') {
    const maxIndex = Math.max(0, appData.testimonials.length - getVisibleTestimonials());
    currentTestimonialIndex = Math.min(maxIndex, currentTestimonialIndex + 1);
    updateTestimonialCarousel();
  }
});