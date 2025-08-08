// TSK Driving School - Manual & Automatic Website JavaScript

// Application data with actual image file names from images folder
const appData = {
  areas: [
      {
          name: "Coventry",
          automatic: {
              "1hour": 37,
              "1.5hours": 57,
              "2hours": 70,
              "10hours": 340,
              "beginnerPackage": 68
          },
          manual: {
              "1hour": 36,
              "1.5hours": 56,
              "2hours": 70,
              "10hours": 340,
              "beginnerPackage": 65
          }
      },
      {
          name: "Nuneaton",
          automatic: {
              "1hour": 38,
              "1.5hours": 55,
              "2hours": 72,
              "10hours": 360,
              "beginnerPackage": 70
          },
          manual: {
              "1hour": 37,
              "1.5hours": 54,
              "2hours": 70,
              "10hours": 350,
              "beginnerPackage": 67
          }
      },
      {
          name: "Leamington Spa",
          automatic: {
              "1hour": 42,
              "1.5hours": 62,
              "2hours": 80,
              "10hours": 400,
              "beginnerPackage": 78
          },
          manual: {
              "1hour": 40,
              "1.5hours": 60,
              "2hours": 78,
              "10hours": 390,
              "beginnerPackage": 75
          }
      },
      {
          name: "Solihull",
          automatic: {
              "1hour": 45,
              "1.5hours": 65,
              "2hours": 85,
              "10hours": 420,
              "beginnerPackage": 82
          },
          manual: {
              "1hour": 43,
              "1.5hours": 63,
              "2hours": 83,
              "10hours": 410,
              "beginnerPackage": 79
          }
      },
      {
          name: "Rugby",
          automatic: {
              "1hour": 36,
              "1.5hours": 54,
              "2hours": 68,
              "10hours": 330,
              "beginnerPackage": 66
          },
          manual: {
              "1hour": 35,
              "1.5hours": 52,
              "2hours": 66,
              "10hours": 320,
              "beginnerPackage": 63
          }
      },
      {
          name: "Warwick",
          automatic: {
              "1hour": 41,
              "1.5hours": 59,
              "2hours": 76,
              "10hours": 380,
              "beginnerPackage": 74
          },
          manual: {
              "1hour": 39,
              "1.5hours": 57,
              "2hours": 74,
              "10hours": 370,
              "beginnerPackage": 71
          }
      }
  ],
  testimonials: [
      {
          name: "Sarah Thompson",
          area: "Coventry",
          rating: 5,
          text: "Passed my test first time! The instructor was incredibly patient and helped me build confidence behind the wheel. Highly recommend TSK Driving School!",
          image: "images/2025-04-16.png"
      },
      {
          name: "James Wilson",
          area: "Coventry", 
          rating: 5,
          text: "Great instructor! Very professional and made learning to drive enjoyable. The lessons were well-structured and I felt well prepared for my test.",
          image: "images/2025-04-19.png"
      },
      {
          name: "Emma Clarke",
          area: "Coventry",
          rating: 5,
          text: "Excellent driving school! The instructor was calm, patient, and gave clear instructions. I passed on my first attempt thanks to the quality training.",
          image: "images/2025-04-1c9.png"
      },
      {
          name: "Michael Brown",
          area: "Coventry",
          rating: 5,
          text: "Very patient instructor who helped me overcome my nervousness. The lessons were tailored to my needs and I felt confident for my test.",
          image: "images/2025-04-20.png"
      },
      {
          name: "Lucy Davis",
          area: "Coventry",
          rating: 5,
          text: "Learned so much in each lesson. The instructor's teaching method was perfect for me. Passed first time with only 2 minor faults!",
          image: "images/2025-04-28.png"
      },
      {
          name: "David Miller",
          area: "Coventry",
          rating: 5,
          text: "Thank you for helping me pass! Professional service from start to finish. The instructor was knowledgeable and encouraging throughout.",
          image: "images/2025-04-2s5.png"
      },
      {
          name: "Sophie Anderson",
          area: "Coventry",
          rating: 5,
          text: "Finally passed after switching to TSK! The instructor was brilliant at explaining complex maneuvers in a simple way. Couldn't be happier!",
          image: "images/2025-04-916.png"
      },
      {
          name: "Ryan Taylor",
          area: "Coventry",
          rating: 5,
          text: "So happy with the results! Clear explanations and plenty of practice made all the difference. Passed with confidence thanks to TSK.",
          image: "images/2025-05-1dsds4.png"
      },
      {
          name: "Hannah White",
          area: "Coventry",
          rating: 5,
          text: "Great lessons with excellent feedback after each session. Felt fully prepared and confident for my driving test. Highly recommend!",
          image: "images/2025-07-13.png"
      },
      {
          name: "Tom Johnson",
          area: "Coventry",
          rating: 5,
          text: "Amazing instructor! Patient, professional, and really knows how to teach driving effectively. Made the whole experience enjoyable.",
          image: "images/202wdw5-06-01.png"
      },
      {
          name: "Katie Roberts",
          area: "Coventry",
          rating: 5,
          text: "Couldn't have done it without TSK! The lessons were perfectly structured and the instructor was always encouraging and supportive.",
          image: "images/cunnamed.png"
      },
      {
          name: "Alex Green",
          area: "Coventry",
          rating: 5,
          text: "Fantastic teacher who made learning to drive enjoyable and stress-free. Passed first time thanks to the excellent preparation!",
          image: "images/ss2025-04-2s5.png"
      },
      {
        name: "Vikram Choudhary",
        area: "Warwick",
        rating: 5,
        text: "Passed my test in first attempt! The instructor was very patient and helped me build confidence behind the wheel. Highly recommend TSK Driving School!",
        image: "images/vk.png"
      },
      {
        name: "Charlotte Mason",
        area: "Nuneaton",
        rating: 5,
        text: "Brilliant instructor! Made learning to drive fun and stress-free. Passed first time with confidence thanks to TSK's excellent teaching methods.",
        image: "images/unnamed.png"
      },
      {
        name: "Jake Phillips",
        area: "Leamington Spa",
        rating: 5,
        text: "Professional and patient instructor who helped me overcome my driving anxiety. The lessons were well-structured and I felt fully prepared for my test.",
        image: "images/unnamesd.png"
      },
      {
        name: "Sahil Tanwar",
        area: "Coventry",
        rating: 5,
        text: "TSK Driving School is the best! The instructor was calm, knowledgeable, and made sure I understood everything before my test. Passed with only 1 minor fault!",
        image: "images/st.png"
      },
      // {
      //   name: "Connor Walsh",
      //   area: "Rugby",
      //   rating: 5,
      //   text: "Top quality instruction! The lessons were tailored to my learning style and I felt confident throughout. Highly recommend TSK Driving School!",
      //   image: "images/tsk.png"
      // }
  ],
  benefits: [
      {
          title: "Expert Manual Instruction",
          description: "Master clutch control and gear changes with patient, professional guidance",
          icon: "⚙️"
      },
      {
          title: "Stress-Free Automatic",
          description: "Focus on road awareness and hazards without clutch control complexity",
          icon: "🎯"
      },
      {
          title: "Flexible Learning",
          description: "Choose between manual and automatic based on your preferences and needs",
          icon: "🔄"
      },
      {
          title: "High Pass Rates",
          description: "Proven track record with excellent first-time pass rates for both transmissions",
          icon: "🏆"
      },
      {
          title: "Modern Vehicles",
          description: "Learn in well-maintained, modern cars equipped with dual controls for safety",
          icon: "🚗"
      },
      {
          title: "Experienced Instructor",
          description: "DVSA approved instructor with years of experience teaching both manual and automatic",
          icon: "👨‍🏫"
      }
  ],
  contact: {
      phone: "+44 7872 309080",
      whatsapp: "447872309080", // Number for WhatsApp URL
      email: "tskdrivingschool101@gmail.com",
      instructorName: "Darrin"
  }
};

// WhatsApp Messaging System
const WhatsAppMessages = {
  // Create a friendly, professional WhatsApp message
  createMessage: function(type, data = {}) {
    const instructorName = appData.contact.instructorName;
    const currentCity = AppState.getCurrentCity();
    
    const baseGreeting = `Hi ${instructorName}! 👋\n\nI hope you're having a great day! `;
    
    switch(type) {
      case 'package-enquiry':
        return `${baseGreeting}I'm interested in learning to drive and would love to know more about your ${data.packageName} in ${currentCity.name}.\n\n📦 Package: ${data.packageName}\n💰 Manual Price: £${data.manualPrice}\n💰 Automatic Price: £${data.autoPrice}\n📍 Location: ${currentCity.name}\n\nCould you please tell me more about:\n• Lesson availability\n• Next available slots\n• What's included in this package\n• Your teaching approach\n\nI'm really excited to start my driving journey with TSK Driving School! 🚗\n\nLooking forward to hearing from you soon!\n\nBest regards`;
      
      case 'general-enquiry':
        return `${baseGreeting}I'm interested in taking driving lessons with TSK Driving School in ${currentCity.name}.\n\nI'd love to discuss:\n• Available lesson packages\n• Your teaching methodology\n• Scheduling flexibility\n• Next available start dates\n\n📍 Preferred Location: ${currentCity.name}\n\nI've heard great things about TSK Driving School and would be thrilled to learn from such an experienced instructor! 🌟\n\nWhen would be a good time to chat?\n\nThanks so much!`;
      
      case 'manual-focus':
        return `${baseGreeting}I'm specifically interested in manual driving lessons with TSK Driving School in ${currentCity.name}.\n\n🔧 I'd love to master:\n• Clutch control\n• Smooth gear changes\n• Hill starts\n• All aspects of manual driving\n\n📍 Location: ${currentCity.name}\n\nI believe learning manual will give me better driving skills overall, and I'd love to learn from your expertise! Could we discuss lesson packages and your availability?\n\nThank you for your time!`;
      
      case 'automatic-focus':
        return `${baseGreeting}I'm interested in automatic driving lessons with TSK Driving School in ${currentCity.name}.\n\n🎯 I'd like to focus on:\n• Road awareness\n• Hazard perception\n• Traffic rules and safety\n• Building confidence behind the wheel\n\n📍 Location: ${currentCity.name}\n\nAutomatic seems perfect for me to concentrate fully on road safety without clutch complexity. Could you tell me about your automatic lesson packages and availability?\n\nLooking forward to starting this journey!`;
      
      case 'intensive-course':
        return `${baseGreeting}I'm looking for an intensive driving course to get test-ready quickly with TSK Driving School in ${currentCity.name}.\n\n⚡ I'm hoping to:\n• Get test-ready in 2-4 weeks\n• Have intensive focused lessons\n• Build confidence quickly\n• Pass my test first time\n\n📍 Location: ${currentCity.name}\n\nI've heard you have excellent pass rates and would love to benefit from your proven teaching methods! Could we discuss intensive course options?\n\nThank you so much!`;
      
      case 'contact-form':
        return `${baseGreeting}I've filled out the contact form on your website and wanted to reach out directly!\n\n👤 Name: ${data.name}\n📧 Email: ${data.email}\n📞 Phone: ${data.phone}\n⚙️ Transmission Preference: ${data.transmission}\n${data.package ? `📦 Package Interest: ${data.package}\n` : ''}${data.experience ? `🎯 Experience Level: ${data.experience}\n` : ''}📍 Preferred Area: ${currentCity.name}\n\n${data.message ? `💬 Additional Message:\n${data.message}\n\n` : ''}I'm really excited about the possibility of learning to drive with such a highly recommended instructor! When would be a convenient time to discuss lessons?\n\nThanks for all you do to help people achieve their driving goals! 🚗✨`;
      
      case 'refresher-training':
        return `${baseGreeting}I'm interested in refresher driving lessons with TSK Driving School in ${currentCity.name}.\n\n🔄 I'd like help with:\n• Building confidence after time away from driving\n• Motorway driving practice\n• Night driving preparation\n• Handling different weather conditions\n\n📍 Location: ${currentCity.name}\n\nI think some professional guidance would really help me become a more confident driver. Could we discuss your refresher packages?\n\nThank you for offering such comprehensive training!`;
      
      default:
        return `${baseGreeting}I'm interested in driving lessons with TSK Driving School in ${currentCity.name}.\n\nI'd love to learn more about your services and discuss how we can get started!\n\n📍 Preferred Location: ${currentCity.name}\n\nLooking forward to hearing from you!\n\nBest regards`;
    }
  },
  
  // Send WhatsApp message
  send: function(messageType, data = {}) {
    const message = this.createMessage(messageType, data);
    const whatsappUrl = `https://wa.me/${appData.contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
  initMobileMenu();
  initStickyHeader();
  initHeroSlider();
  initBenefits();
  initCitySelector();
  initPricingSystem();
  initTestimonials();
  initContactForm();
  initSmoothScrolling();
  initScrollAnimations();
});

// --- THEME TOGGLE FUNCTIONALITY ---
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const applyTheme = (theme) => {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    applyTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}

// --- MOBILE NAVIGATION ---
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('nav-menu-mobile');
    if (!navToggle || !mobileMenu) return;

    const closeMenu = () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    };

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target)) {
            closeMenu();
        }
    });

    mobileMenu.querySelectorAll('.nav__link-mobile').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// --- STICKY/SCROLLING HEADER ---
function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (lastScrollY < window.scrollY && window.scrollY > 150) {
            header.classList.add('header--hidden');
        } else {
            header.classList.remove('header--hidden');
        }
        lastScrollY = window.scrollY;
    });
}

// --- HERO SLIDER FUNCTIONALITY ---
function initHeroSlider() {
    const slider = document.getElementById('hero-slider');
    const slides = slider?.querySelectorAll('.hero__slide');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!slider || !slides.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const newIndex = (currentSlide + 1) % totalSlides;
        showSlide(newIndex);
    }
    
    function prevSlide() {
        const newIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(newIndex);
    }
    
    // Pause auto-advance when user interacts with controls
    let pauseAutoAdvance = false;
    
    function pauseAndResume() {
        pauseAutoAdvance = true;
        setTimeout(() => {
            pauseAutoAdvance = false;
        }, 10000); // Resume after 10 seconds of no interaction
    }
    
    // Event listeners with pause functionality
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            pauseAndResume();
            nextSlide();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            pauseAndResume();
            prevSlide();
        });
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            pauseAndResume();
            showSlide(index);
        });
    });
    
    // Auto-advance slides every 5 seconds
    const autoAdvanceInterval = setInterval(() => {
        if (!pauseAutoAdvance) {
            nextSlide();
        }
    }, 5000);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

// Initialize benefits section
function initBenefits() {
  const benefitsGrid = document.getElementById('benefits-grid');
  if (!benefitsGrid) return;

  benefitsGrid.innerHTML = appData.benefits.map((benefit, index) => `
      <div class="benefit__card fade-in" style="animation-delay: ${index * 100}ms;">
          <div class="benefit__icon">${benefit.icon}</div>
          <h3 class="benefit__title">${benefit.title}</h3>
          <p class="benefit__description">${benefit.description}</p>
      </div>
  `).join('');
}

// Application State Management
const AppState = {
  currentCityIndex: 0,
  
  setCity: function(index) {
    if (index >= 0 && index < appData.areas.length) {
      this.currentCityIndex = index;
      this.updateUI();
    }
  },
  
  getCurrentCity: function() {
    return appData.areas[this.currentCityIndex];
  },
  
  updateUI: function() {
    this.updateCityDisplay();
    this.updateCityButtons();
    this.updatePricing();
  },
  
  updateCityDisplay: function() {
    const cityDisplays = document.querySelectorAll('.current-city, .current-city-pricing');
    cityDisplays.forEach(display => {
      display.textContent = this.getCurrentCity().name;
    });
  },
  
  updateCityButtons: function() {
    const allCityButtons = document.querySelectorAll('.city-btn, .pricing-city-btn');
    allCityButtons.forEach((btn, index) => {
      const btnIndex = parseInt(btn.dataset.cityIndex) || index;
      btn.classList.toggle('active', btnIndex === this.currentCityIndex);
    });
  },
  
  updatePricing: function() {
    const packagesGrid = document.getElementById('packages-grid');
    if (!packagesGrid) return;
    
    const currentCity = this.getCurrentCity();
    console.log('Updating pricing for:', currentCity.name);
    
    const packageOptions = [
      { key: '1hour', name: "1 Hour Lesson", description: "Perfect for a refresher" },
      { key: '1.5hours', name: "1.5 Hour Lesson", description: "Extended learning time" },
      { key: '2hours', name: "2 Hour Lesson", description: "Intensive session" },
      { key: '10hours', name: "10 Hours Block", description: "Save with bulk booking", isPopular: true },
      { key: 'beginnerPackage', name: "Beginner Package", description: "Introductory rate for new learners" }
    ];

    packagesGrid.innerHTML = packageOptions.map((pkg, index) => {
      const manualPrice = currentCity.manual[pkg.key];
      const autoPrice = currentCity.automatic[pkg.key];
      
      return `
        <div class="package__card fade-in ${pkg.isPopular ? 'popular' : ''}" style="animation-delay: ${index * 100}ms;">
          ${pkg.isPopular ? '<div class="package__popular">Most Popular</div>' : ''}
          <h3 class="package__title">${pkg.name}</h3>
          <p class="package__description">${pkg.description}</p>
          
          <div class="package__price-details">
            <div class="price-option">
              <span class="price-label">Manual</span>
              <span class="price-value">£${manualPrice}</span>
            </div>
            <div class="price-option">
              <span class="price-label">Automatic</span>
              <span class="price-value">£${autoPrice}</span>
            </div>
          </div>
          
          ${pkg.key === '10hours' ? '<div class="package__savings">Save on block bookings!</div>' : ''}
          <button class="btn btn--primary" onclick="WhatsAppMessages.send('package-enquiry', {packageName: '${pkg.name}', manualPrice: '${manualPrice}', autoPrice: '${autoPrice}'})">
            📱 Enquire Now
          </button>
        </div>
      `;
    }).join('');
    
    // Re-observe new elements for animations
    if (window.reObserveFadeInElements) {
      setTimeout(window.reObserveFadeInElements, 100);
    }
  }
};

// Global function for HTML onclick events
window.selectCity = function(index) {
  AppState.setCity(index);
};

// City selector initialization
function initCitySelector() {
  createPricingCitySelector();
  AppState.updateUI();
}

function createPricingCitySelector() {
  const pricingSection = document.getElementById('pricing');
  if (!pricingSection) return;
  
  const sectionHeader = pricingSection.querySelector('.section__header');
  if (!sectionHeader || sectionHeader.querySelector('.pricing-city-selector')) return;
  
  const citySelectorHTML = `
    <div class="pricing-city-selector">
      <h3>📍 Select Your Area for Pricing:</h3>
      <div class="pricing-city-buttons">
        ${appData.areas.map((area, index) => `
          <button class="pricing-city-btn ${index === 0 ? 'active' : ''}" 
                  data-city-index="${index}" 
                  onclick="selectCity(${index})">
            ${area.name}
          </button>
        `).join('')}
      </div>
      <p class="selected-city-display">Currently showing prices for: <span class="current-city-pricing">${appData.areas[0].name}</span></p>
    </div>
  `;
  
  sectionHeader.insertAdjacentHTML('afterend', citySelectorHTML);
}

// Legacy function for backward compatibility
window.updateCityPricing = function(index) {
  selectCity(index);
};

// Pricing system - now handled by AppState
function initPricingSystem() {
  // Initial pricing display is handled by AppState
  AppState.updatePricing();
}

// Testimonials section
function initTestimonials() {
  const testimonialsGrid = document.getElementById('testimonials-grid');
  if (!testimonialsGrid) return;

  testimonialsGrid.innerHTML = appData.testimonials.map((testimonial, index) => `
      <div class="testimonial__card fade-in" style="animation-delay: ${index * 50}ms;">
          <div class="testimonial__image-container">
              <img src="${testimonial.image}" 
                   alt="Success story from ${testimonial.name}" 
                   class="testimonial__image"
                   loading="lazy"
                   onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\"testimonial__image-placeholder\\">👤</div>
          </div>
          <div class="testimonial__review-section">
              <div class="testimonial__rating">
                  <div class="testimonial__stars">${'★'.repeat(testimonial.rating)}</div>
              </div>
              <div class="testimonial__content">
                  <p class="testimonial__text">${testimonial.text}</p>
              </div>
              <div class="testimonial__footer">
                  <h4 class="testimonial__author">${testimonial.name}</h4>
                  <p class="testimonial__area">${testimonial.area}</p>
              </div>
          </div>
      </div>
  `).join('');
}

// Contact form
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      
      const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        transmission: formData.get('transmission-preference'),
        package: formData.get('package-interest'),
        experience: formData.get('experience-level'),
        message: formData.get('message')
      };
      
      WhatsAppMessages.send('contact-form', contactData);
  });
}

// Smooth scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              const headerOffset = 80;
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
      });
  });
}

// Scroll animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
          }
      });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' 
  });

  // Observe all fade-in elements
  const observeElements = () => {
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
      observer.observe(el);
    });
  };
  
  // Initial observation
  observeElements();
  
  // Re-observe after DOM changes (useful for dynamic content)
  window.reObserveFadeInElements = observeElements;
}
