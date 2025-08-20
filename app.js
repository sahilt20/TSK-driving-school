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
              "1hour": 40,
              "1.5hours": 56,
              "2hours": 75,
              "10hours": 365,
              "beginnerPackage": 56
          },
          manual: {
              "1hour": 36,
              "1.5hours": 54,
              "2hours": 70,
              "10hours": 340,
              "beginnerPackage": 52.5
          }
      },
      {
          name: "Leamington Spa",
          automatic: {
              "1hour": 40,
              "1.5hours": 56,
              "2hours": 75,
              "10hours": 365,
              "beginnerPackage": 56
          },
          manual: {
              "1hour": 36,
              "1.5hours": 54,
              "2hours": 70,
              "10hours": 340,
              "beginnerPackage": 52.5
          }
      },
      {
          name: "Solihull",
          automatic: {
              "1hour": 40,
              "1.5hours": 56,
              "2hours": 75,
              "10hours": 365,
              "beginnerPackage": 56
          },
          manual: {
              "1hour": 36,
              "1.5hours": 54,
              "2hours": 70,
              "10hours": 340,
              "beginnerPackage": 52.5
          }
      },
      {
          name: "Rugby",
          automatic: {
              "1hour": 40,
              "1.5hours": 56,
              "2hours": 75,
              "10hours": 365,
              "beginnerPackage": 56
          },
          manual: {
              "1hour": 36,
              "1.5hours": 54,
              "2hours": 70,
              "10hours": 340,
              "beginnerPackage": 52.5
          }
      },
      {
          name: "Warwick",
          automatic: {
              "1hour": 40,
              "1.5hours": 56,
              "2hours": 75,
              "10hours": 365,
              "beginnerPackage": 56
          },
          manual: {
              "1hour": 36,
              "1.5hours": 54,
              "2hours": 70,
              "10hours": 340,
              "beginnerPackage": 52.5
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
  theoryClasses: {
    packages: [
      {
        name: "Theory Test Preparation",
        duration: "2 weeks",
        sessions: "6 sessions",
        price: 75,
        features: [
          "Highway Code mastery",
          "Hazard perception training", 
          "Mock tests & practice",
          "Test booking assistance",
          "Pass guarantee support"
        ],
        popular: true
      }
    ]
  },
  comboPackages: {
    // Theory + Practical combo packages with city-specific pricing
    packages: [
      {
        name: "Theory + 5 Hour Practical Combo",
        description: "Perfect starter package - Theory classes + 5 practical lessons",
        theoryComponent: "Theory Test Preparation (6 sessions)",
        practicalComponent: "5 x 1-hour practical lessons",
        features: [
          "Complete theory test preparation",
          "5 hours practical driving lessons",
          "Coordinated learning approach",
          "Priority booking",
          "Progress tracking"
        ],
        popular: false
      },
      {
        name: "Theory + 10 Hour Complete Package",
        description: "Most popular - Theory preparation + comprehensive practical training",
        theoryComponent: "Theory Test Preparation (6 sessions)", 
        practicalComponent: "10 x 1-hour practical lessons",
        features: [
          "Full theory test preparation",
          "10 hours practical lessons",
          "Mock test simulations",
          "Test-ready preparation",
          "Flexible scheduling",
          "Pass guarantee support"
        ],
        popular: true
      },
      {
        name: "Complete Driver Package",
        description: "Ultimate package - Everything you need from theory to test",
        theoryComponent: "Theory Test Preparation (6 sessions)",
        practicalComponent: "20 x 1-hour practical lessons",
        features: [
          "Complete theory preparation",
          "Extensive practical training",
          "Mock theory & practical tests",
          "Test booking assistance",
          "Ongoing support until pass",
          "Flexible lesson scheduling"
        ],
        popular: false
      }
    ]
  },
  instructorProgram: {
    requirements: [
      "Full UK driving license (3+ years)",
      "No more than 6 penalty points",
      "Right to work in the UK",
      "Good communication skills",
      "Patient and professional attitude"
    ],
    benefits: [
      "Flexible working hours",
      "Competitive earning potential",
      "Full training provided",
      "Modern dual-control vehicles",
      "Ongoing support & development",
      "Established client base"
    ],
    process: [
      {
        step: 1,
        title: "Initial Application",
        description: "Submit your application and we'll review your eligibility",
        duration: "1-2 days"
      },
      {
        step: 2,
        title: "Interview & Assessment", 
        description: "Meet with our team to discuss your suitability and career goals",
        duration: "1 week"
      },
      {
        step: 3,
        title: "Training Program",
        description: "Complete our comprehensive instructor training course",
        duration: "4-6 weeks"
      },
      {
        step: 4,
        title: "DVSA Qualification",
        description: "Pass your ADI (Approved Driving Instructor) tests",
        duration: "2-4 weeks"
      },
      {
        step: 5,
        title: "Start Teaching",
        description: "Begin your career with full support from TSK team",
        duration: "Ongoing"
      }
    ]
  },
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
      
      case 'theory-classes':
        return `${baseGreeting}I'm interested in your theory test classes with TSK Driving School in ${currentCity.name}.\n\n📚 I'd love to know more about:\n• Theory test preparation courses\n• Hazard perception training\n• Mock tests and practice sessions\n• Course schedules and availability\n• Pass rates and success stories\n\n${data.packageName ? `📦 Specific Interest: ${data.packageName}\n💰 Price: £${data.price}\n` : ''}📍 Location: ${currentCity.name}\n\nI want to make sure I'm fully prepared for my theory test and would love to benefit from your expert guidance!\n\nLooking forward to starting my theory journey with TSK! 📖✨`;
      
      case 'join-instructor':
        return `${baseGreeting}I'm interested in joining TSK Driving School as a driving instructor in ${currentCity.name}.\n\n👨‍🏫 I'd love to learn more about:\n• The application and training process\n• Requirements and qualifications needed\n• Earning potential and working conditions\n• Training timeline and support provided\n• Career development opportunities\n\n📍 Preferred Area: ${currentCity.name}\n\nI'm passionate about helping people learn to drive safely and would be thrilled to join such a reputable driving school with excellent standards!\n\nCould we arrange a time to discuss this opportunity further?\n\nThank you for building such a fantastic team! 🚗👏`;
      
      case 'combo-package':
        return `${baseGreeting}I'm very interested in your ${data.packageName} in ${currentCity.name}!\n\n🎯 This combo package looks perfect for me:\n📦 Package: ${data.packageName}\n💰 Manual Combo Price: £${data.manualPrice} (Save £${data.manualSavings})\n💰 Automatic Combo Price: £${data.autoPrice} (Save £${data.autoSavings})\n📍 Location: ${currentCity.name}\n\nI love that this combines theory and practical lessons - it seems like the most efficient way to learn! 🚗✨\n\nCould you please tell me more about:\n• How the theory and practical lessons are coordinated\n• Flexibility in scheduling both components\n• Next available start dates\n• What's included in the package\n\nI'm excited to get started with both theory and practical learning together!\n\nLooking forward to your response!`;
      
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
  initTheoryClasses();
  initInstructorProgram();
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

// Calculate combo package pricing for current city
function calculateComboPackagePricing(comboPackage) {
  const currentCity = AppState.getCurrentCity();
  const theoryPrice = 75; // Single theory package price
  
  const practicalHours = {
    "Theory + 5 Hour Practical Combo": 5,
    "Theory + 10 Hour Complete Package": 10, 
    "Complete Driver Package": 20
  };
  
  const hours = practicalHours[comboPackage.name];
  
  // Calculate practical pricing (using 1-hour rates)
  const manualPracticalPrice = currentCity.manual["1hour"] * hours;
  const autoPracticalPrice = currentCity.automatic["1hour"] * hours;
  
  // Calculate combo prices with discounts
  const manualComboPrice = Math.floor((theoryPrice + manualPracticalPrice) * 0.9); // 10% discount
  const autoComboPrice = Math.floor((theoryPrice + autoPracticalPrice) * 0.9); // 10% discount
  
  return {
    theoryPrice,
    manualPracticalPrice,
    autoPracticalPrice,
    manualComboPrice,
    autoComboPrice,
    manualSavings: (theoryPrice + manualPracticalPrice) - manualComboPrice,
    autoSavings: (theoryPrice + autoPracticalPrice) - autoComboPrice
  };
}

// Initialize theory classes section
function initTheoryClasses() {
  const theoryPackagesGrid = document.getElementById('theory-packages');
  if (!theoryPackagesGrid) return;

  // Single simplified theory package
  const theoryPackage = appData.theoryClasses.packages[0];

  const theoryPackageHTML = `
      <div class="theory-intro-card fade-in">
          <div class="theory-intro__badge">📚 Theory Test Preparation</div>
          <h3 class="theory-intro__title">${theoryPackage.name}</h3>
          <p class="theory-intro__subtitle">Build your knowledge and confidence for the road ahead with our comprehensive theory test preparation program designed to help you pass first time.</p>
          
          <div class="theory-stats">
              <div class="theory-stat">
                  <span class="theory-stat__number">98%</span>
                  <span class="theory-stat__label">Pass Rate</span>
              </div>
              <div class="theory-stat">
                  <span class="theory-stat__number">200+</span>
                  <span class="theory-stat__label">Students Passed</span>
              </div>
              <div class="theory-stat">
                  <span class="theory-stat__number">1st</span>
                  <span class="theory-stat__label">Time Success</span>
              </div>
          </div>
          
          <div class="theory-intro__price-section">
              <div class="theory-price-item">
                  <span class="theory-price-label">Price</span>
                  <span class="theory-price-value">£${theoryPackage.price}</span>
              </div>
              <div class="theory-price-item">
                  <span class="theory-price-label">Duration</span>
                  <span class="theory-price-value">${theoryPackage.duration}</span>
              </div>
              <div class="theory-price-item">
                  <span class="theory-price-label">Sessions</span>
                  <span class="theory-price-value">${theoryPackage.sessions}</span>
              </div>
          </div>
          
          <div class="theory-intro__features">
              <div class="theory-feature-card">
                  <div class="theory-feature-card__icon">📖</div>
                  <h4 class="theory-feature-card__title">Highway Code Mastery</h4>
                  <p class="theory-feature-card__description">Complete coverage of all essential road rules and regulations</p>
              </div>
              <div class="theory-feature-card">
                  <div class="theory-feature-card__icon">🎯</div>
                  <h4 class="theory-feature-card__title">Hazard Perception Training</h4>
                  <p class="theory-feature-card__description">Advanced training to identify and respond to road hazards</p>
              </div>
              <div class="theory-feature-card">
                  <div class="theory-feature-card__icon">📝</div>
                  <h4 class="theory-feature-card__title">Mock Tests & Practice</h4>
                  <p class="theory-feature-card__description">Regular practice tests to track your progress and readiness</p>
              </div>
              <div class="theory-feature-card">
                  <div class="theory-feature-card__icon">🎓</div>
                  <h4 class="theory-feature-card__title">Pass Guarantee Support</h4>
                  <p class="theory-feature-card__description">Additional support if you need extra help to pass your test</p>
              </div>
          </div>
          
          <div class="theory-intro__actions">
              <button class="btn btn--primary" onclick="WhatsAppMessages.send('theory-classes', {packageName: '${theoryPackage.name}', price: '${theoryPackage.price}'})">
                  📚 Book Theory Classes
              </button>
              <button class="btn btn--outline" onclick="WhatsAppMessages.send('theory-classes', {packageName: '${theoryPackage.name}', price: '${theoryPackage.price}'})">
                  💬 Ask Questions
              </button>
          </div>
      </div>
  `;

  // Combo packages with city-specific pricing
  const comboPackagesHTML = appData.comboPackages.packages.map((combo, index) => {
    const pricing = calculateComboPackagePricing(combo);
    return `
      <div class="combo-package__card fade-in ${combo.popular ? 'popular' : ''}" style="animation-delay: ${(index + 1) * 100}ms;">
          ${combo.popular ? '<div class="combo-package__popular">🔥 Best Value</div>' : ''}
          <h3 class="combo-package__title">${combo.name}</h3>
          <p class="combo-package__description">${combo.description}</p>
          
          <div class="combo-package__components">
              <div class="combo-component">
                  <span class="component-label">Theory:</span>
                  <span class="component-value">${combo.theoryComponent}</span>
              </div>
              <div class="combo-component">
                  <span class="component-label">Practical:</span>
                  <span class="component-value">${combo.practicalComponent}</span>
              </div>
          </div>
          
          <div class="combo-package__pricing">
              <div class="price-breakdown">
                  <div class="price-option">
                      <span class="price-label">Manual Combo</span>
                      <div class="price-details">
                          <span class="original-price">£${pricing.theoryPrice + pricing.manualPracticalPrice}</span>
                          <span class="combo-price">£${pricing.manualComboPrice}</span>
                      </div>
                      <span class="savings">Save £${pricing.manualSavings}</span>
                  </div>
                  <div class="price-option">
                      <span class="price-label">Auto Combo</span>
                      <div class="price-details">
                          <span class="original-price">£${pricing.theoryPrice + pricing.autoPracticalPrice}</span>
                          <span class="combo-price">£${pricing.autoComboPrice}</span>
                      </div>
                      <span class="savings">Save £${pricing.autoSavings}</span>
                  </div>
              </div>
          </div>
          
          <ul class="combo-package__features">
              ${combo.features.map(feature => `<li>✓ ${feature}</li>`).join('')}
          </ul>
          
          <button class="btn btn--primary btn--full-width" onclick="WhatsAppMessages.send('combo-package', {packageName: '${combo.name}', manualPrice: '${pricing.manualComboPrice}', autoPrice: '${pricing.autoComboPrice}', manualSavings: '${pricing.manualSavings}', autoSavings: '${pricing.autoSavings}'})">
              🎯 Book Combo Package
          </button>
      </div>
    `;
  }).join('');

  // Simplified layout with theory info at top and combo packages below
  theoryPackagesGrid.innerHTML = `
    <div class="theory-simple-section">
        ${theoryPackageHTML}
    </div>
    <div class="packages-section">
        <h3 class="packages-section__title">🎯 Theory + Practical Combo Packages</h3>
        <div class="packages-grid combo-packages">
            ${comboPackagesHTML}
        </div>
    </div>
  `;
}

// Initialize instructor program section
function initInstructorProgram() {
  // Populate requirements
  const requirementsList = document.getElementById('requirements-list');
  if (requirementsList) {
      requirementsList.innerHTML = appData.instructorProgram.requirements.map(req => `
          <li class="requirement-item fade-in">✓ ${req}</li>
      `).join('');
  }

  // Populate benefits
  const benefitsList = document.getElementById('benefits-list');
  if (benefitsList) {
      benefitsList.innerHTML = appData.instructorProgram.benefits.map(benefit => `
          <li class="benefit-item fade-in">🎯 ${benefit}</li>
      `).join('');
  }

  // Populate process steps
  const processSteps = document.getElementById('process-steps');
  if (processSteps) {
      processSteps.innerHTML = appData.instructorProgram.process.map((step, index) => `
          <div class="process-step fade-in" style="animation-delay: ${index * 100}ms;">
              <div class="process-step__number">${step.step}</div>
              <div class="process-step__content">
                  <h4 class="process-step__title">${step.title}</h4>
                  <p class="process-step__description">${step.description}</p>
                  <span class="process-step__duration">${step.duration}</span>
              </div>
          </div>
      `).join('');
  }
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
    this.updateTheoryPackages();
  },

  updateTheoryPackages: function() {
    // Re-initialize theory classes to update combo package pricing for new city
    if (typeof initTheoryClasses === 'function') {
      initTheoryClasses();
    }
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
