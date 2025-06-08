// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
    const mobileMenu = document.querySelector(".mobile-menu")

  
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("active")
  

      // Toggle hamburger animation
      const spans = this.querySelectorAll("span")
      if (mobileMenu.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
        spans[1].style.opacity = "0"
        spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)"
      } else {
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
    })
  
    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll(".mobile-menu a")
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active")
  
        // Reset hamburger icon
        const spans = mobileMenuBtn.querySelectorAll("span")
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      })
    })
  
    // Sticky Header
    const header = document.getElementById("header")
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        header.style.backgroundColor = "white"
        header.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)"
        } else if (window.scrollY > 50) {
        header.style.backgroundColor = "rgba(255, 255, 255, 0.9)"

      } else {
        header.style.backgroundColor = "white"
        header.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)"

      }
    })
  
    // Active Navigation Link
    const sections = document.querySelectorAll("section")
    const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a")
  
    window.addEventListener("scroll", () => {
      let current = ""
  
      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
  
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
          current = section.getAttribute("id")

        }
      })
  
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active")
        }
      })
    })
  
    // Project Filtering
    const filterBtns = document.querySelectorAll(".filter-btn")
    const projectCards = document.querySelectorAll(".project-card")
  
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons
        filterBtns.forEach((btn) => btn.classList.remove("active"))
        
  
        // Add active class to clicked button
        this.classList.add("active")

  
        const filter = this.getAttribute("data-filter")
  
        projectCards.forEach((card) => {
          if (filter === "all" || card.getAttribute("data-category") === filter) {
            card.style.display = "block"
          } else {
            card.style.display = "none"
          }
        })
      })
    })
  
    // Project Modal
    const projectLinks = document.querySelectorAll(".project-link")
    const projectModal = document.querySelector(".project-modal")
    const closeModal = document.querySelector(".close-modal")
  
    // Sample project data (in a real project, this would come from a database)
    const projectData = [
      {
        title: "Luxury Home Construction",
        image: "images/project1.jpg",
        client: "Johnson Family",
        date: "March 2022",
        category: "Residential",
        location: "Beverly Hills, CA",
        description:
          "This luxury home project features 5 bedrooms, 6 bathrooms, a home theater, wine cellar, and infinity pool. Built with premium materials and energy-efficient systems, this 6,500 sq ft residence combines modern design with sustainable building practices.",
      },
      {
        title: "Modern Office Complex",
        image: "images/project2.jpg",
        client: "TechStart Inc.",
        date: "November 2021",
        category: "Commercial",
        location: "Seattle, WA",
        description:
          "A 15,000 sq ft office complex designed for a growing tech company. The space features open collaborative areas, private meeting rooms, a cafeteria, and state-of-the-art technology infrastructure. The building was designed with employee wellness in mind, incorporating natural light, indoor plants, and ergonomic workspaces.",
      },
      {
        title: "Complete Kitchen Remodel",
        image: "images/project3.jpg",
        client: "Martinez Residence",
        date: "January 2023",
        category: "Renovation",
        location: "Portland, OR",
        description:
          "This kitchen renovation transformed an outdated space into a modern cooking haven. The project included custom cabinetry, quartz countertops, high-end appliances, and a large center island. We reconfigured the layout to improve flow and functionality while maximizing storage space.",
      },
      {
        title: "Retail Shopping Center",
        image: "images/project4.jpg",
        client: "Metro Developments",
        date: "August 2022",
        category: "Commercial",
        location: "Denver, CO",
        description:
          "A 25,000 sq ft retail center with space for 12 businesses. The project included extensive site work, parking lot construction, and custom storefronts for each tenant. The modern design incorporates sustainable materials and energy-efficient systems throughout.",
      },
      {
        title: "Custom Family Home",
        image: "images/project5.jpg",
        client: "Williams Family",
        date: "February 2023",
        category: "Residential",
        location: "Austin, TX",
        description:
          "This 3,200 sq ft family home features 4 bedrooms, 3 bathrooms, an open concept living area, and a covered outdoor patio. Built with a focus on family living, the home includes custom storage solutions, durable finishes, and a flexible bonus room that can serve as a home office or playroom.",
      },
      {
        title: "Luxury Bathroom Renovation",
        image: "images/project6.jpg",
        client: "Thompson Residence",
        date: "October 2022",
        category: "Renovation",
        location: "Miami, FL",
        description:
          "This master bathroom renovation created a spa-like retreat with a freestanding soaking tub, walk-in shower with multiple shower heads, double vanity with custom lighting, and heated floors. The project transformed the space while working within the existing footprint.",
      },
    ]
  
    projectLinks.forEach((link, index) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
  
        const project = projectData[index]
  
        // Populate modal with project data
        document.querySelector(".modal-title").textContent = project.title
        document.querySelector(".modal-image img").src = project.image
        document.querySelector(".modal-image img").alt = project.title
        document.getElementById("modal-client").textContent = project.client
        document.getElementById("modal-date").textContent = project.date
        document.getElementById("modal-category").textContent = project.category
        document.getElementById("modal-location").textContent = project.location
        document.getElementById("modal-description").textContent = project.description
  
        // Show modal
        projectModal.classList.add("active")
        document.body.style.overflow = "hidden"
      })
    })
  
    // Close modal when clicking the close button
    closeModal.addEventListener("click", () => {
      projectModal.classList.remove("active")
      document.body.style.overflow = "auto"
    })
  
    // Close modal when clicking outside the modal content
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove("active")
        document.body.style.overflow = "auto"
      }
    })
  
    // Testimonial Slider
    const testimonials = document.querySelectorAll(".testimonial")
    const dots = document.querySelectorAll(".dot")
    const prevBtn = document.querySelector(".prev-testimonial")
    const nextBtn = document.querySelector(".next-testimonial")
    let currentTestimonial = 0
  
    function showTestimonial(index) {
      // Hide all testimonials
      testimonials.forEach((testimonial) => {
        testimonial.classList.remove("active")
      })
  
      // Remove active class from all dots
      dots.forEach((dot) => {
        dot.classList.remove("active")
      })
  
      // Show the selected testimonial and activate corresponding dot
      testimonials[index].classList.add("active")
      dots[index].classList.add("active")
    }
  
    // Next testimonial
    nextBtn.addEventListener("click", () => {
      currentTestimonial++
      if (currentTestimonial >= testimonials.length) {
        currentTestimonial = 0
      }
      showTestimonial(currentTestimonial)
    })
  
    // Previous testimonial
    prevBtn.addEventListener("click", () => {
      currentTestimonial--
      if (currentTestimonial < 0) {
        currentTestimonial = testimonials.length - 1
      }
      showTestimonial(currentTestimonial)
    })
  
    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentTestimonial = index
        showTestimonial(currentTestimonial)
      })
    })
  
    // Auto-rotate testimonials
    setInterval(() => {
      if (!document.hidden) {
        currentTestimonial++
        if (currentTestimonial >= testimonials.length) {
          currentTestimonial = 0
        }
        showTestimonial(currentTestimonial)
      }
    }, 5000)
  
    // Contact Form Submission
    const contactForm = document.getElementById("contactForm")
    const formSuccess = document.getElementById("formSuccess")
  
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // In a real project, you would send the form data to a server here
        // For this demo, we'll just show the success message
  
        contactForm.style.display = "none"
        formSuccess.style.display = "block"
  
        // Reset form
        contactForm.reset()
  
        // Hide success message after 5 seconds and show form again
        setTimeout(() => {
          formSuccess.style.display = "none"
          contactForm.style.display = "grid"
        }, 5000)
      })
    }
  
    // Back to Top Button
    const backToTopBtn = document.querySelector(".back-to-top")
  
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("active")
      } else {
        backToTopBtn.classList.remove("active")
      }
    })
  
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
  
        const targetId = this.getAttribute("href")
        if (targetId === "#") return
  
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          const headerHeight = document.getElementById("header").offsetHeight
          const targetPosition = targetElement.offsetTop - headerHeight
  
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  })
  