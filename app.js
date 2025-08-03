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
      }
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
      email: "tskdrivingschool101@gmail.com"
  }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
  initMobileMenu();
  initStickyHeader();
  initBenefits();
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

// Pricing system - shows both prices side-by-side
function initPricingSystem() {
  const packagesGrid = document.getElementById('packages-grid');
  if (!packagesGrid) return;

  const manualPrices = appData.areas[0].manual;
  const autoPrices = appData.areas[0].automatic;

  if (!manualPrices || !autoPrices) {
      console.error(`Pricing data not found.`);
      packagesGrid.innerHTML = '<p>Sorry, pricing information is currently unavailable.</p>';
      return;
  }

  const packageOptions = [
      { key: '1hour', name: "1 Hour Lesson", description: "Perfect for a refresher" },
      { key: '1.5hours', name: "1.5 Hour Lesson", description: "Extended learning time" },
      { key: '2hours', name: "2 Hour Lesson", description: "Intensive session" },
      { key: '10hours', name: "10 Hours Block", description: "Save with bulk booking", isPopular: true },
      { key: 'beginnerPackage', name: "Beginner Package", description: "Introductory rate for new learners" }
  ];

  packagesGrid.innerHTML = packageOptions.map((pkg, index) => {
      const manualPrice = manualPrices[pkg.key];
      const autoPrice = autoPrices[pkg.key];
      const manualPriceDisplay = manualPrice ? `£${manualPrice}` : 'N/A';
      const autoPriceDisplay = autoPrice ? `£${autoPrice}` : 'N/A';

      return `
          <div class="package__card fade-in ${pkg.isPopular ? 'popular' : ''}" style="animation-delay: ${index * 100}ms;">
              ${pkg.isPopular ? '<div class="package__popular">Most Popular</div>' : ''}
              <h3 class="package__title">${pkg.name}</h3>
              <p class="package__description">${pkg.description}</p>
              
              <div class="package__price-details">
                  <div class="price-option">
                      <span class="price-label">Manual</span>
                      <span class="price-value">${manualPriceDisplay}</span>
                  </div>
                  <div class="price-option">
                      <span class="price-label">Automatic</span>
                      <span class="price-value">${autoPriceDisplay}</span>
                  </div>
              </div>

              ${pkg.key === '10hours' ? '<div class="package__savings">Save on block bookings!</div>' : ''}
              <a href="#contact" class="btn btn--primary">Enquire Now</a>
          </div>
      `;
  }).join('');
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
                   onerror="this.style.display='none'; this.parentElement.innerHTML+='<div class=\\"testimonial__image-placeholder\\"></div>'">
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
      let messageBody = `🚗 Driving Lesson Enquiry\n\n` +
                        `👤 Name: ${formData.get('name')}\n` +
                        `📧 Email: ${formData.get('email')}\n` +
                        `📞 Phone: ${formData.get('phone')}\n` +
                        `⚙️ Transmission: ${formData.get('transmission-preference')}\n`;
      
      if (formData.get('package-interest')) messageBody += `📦 Package: ${formData.get('package-interest')}\n`;
      if (formData.get('experience-level')) messageBody += `🎯 Experience: ${formData.get('experience-level')}\n`;
      if (formData.get('message')) messageBody += `💬 Message: ${formData.get('message').trim()}\n`;
      
      messageBody += `\n📍 Area: Coventry`;

      const whatsappUrl = `https://wa.me/${appData.contact.whatsapp}?text=${encodeURIComponent(messageBody)}`;
      window.open(whatsappUrl, '_blank');
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
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}
