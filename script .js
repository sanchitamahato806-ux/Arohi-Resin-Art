// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navButtons = document.querySelector('.nav-buttons');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    navButtons.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navButtons.classList.remove('active');
    });
});

// Gallery Image Data
const galleries = {
    signature: [
        { src: 'images/img1.jpg', price: '₹899' },
        { src: 'images/img2.jpg', price: '₹999' },
        { src: 'images/img3.jpg', price: '₹899' },
        { src: 'images/img4.jpg', price: '₹1099' },
        { src: 'images/img5.jpg', price: '₹999' },
        { src: 'images/img6.jpg', price: '₹1199' },
        { src: 'images/img7.jpg', price: '₹899' }
    ],
    classic: [
        { src: 'images/img14.jpg', price: '₹1199' },
        { src: 'images/img15.jpg', price: '₹1299' },
        { src: 'images/img16.jpg', price: '₹1199' },
        { src: 'images/img17.jpg', price: '₹1399' }
    ],
    luxury: [
        { src: 'images/img8.jpg', price: '₹1499' },
        { src: 'images/img9.jpg', price: '₹1699' },
        { src: 'images/img10.jpg', price: '₹1999' },
        { src: 'images/img11.jpg', price: '₹1799' },
        { src: 'images/img12.jpg', price: '₹1899' },
        { src: 'images/img13.jpg', price: '₹1499' }
    ]
};

// Initialize galleries on collection pages
document.addEventListener('DOMContentLoaded', function() {
    initGalleries();
    initLightbox();
    initScrollAnimations();
});

// Initialize all galleries
function initGalleries() {
    Object.keys(galleries).forEach(collection => {
        const gallery = document.getElementById(`${collection}-gallery`);
        if (gallery) {
            renderGallery(gallery, galleries[collection]);
        }
    });
}

// Render gallery grid
function renderGallery(container, images) {
    container.innerHTML = images.map((img, index) => `
        <div class="gallery-item" data-index="${index}">
            <div class="gallery-image">
                <img src="${img.src}" alt="Resin Art ${index + 1}" loading="lazy">
                <div class="image-overlay">
                    <div class="price-tag">${img.price}</div>
                    <div class="view-btn">
                        <i class="fas fa-search-plus"></i>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add click listeners after rendering
    container.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const collection = container.id.replace('-gallery', '');
            const index = parseInt(this.dataset.index);
            openLightbox(galleries[collection], index);
        });
    });
}

// Lightbox functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    closeBtn.addEventListener('click', () => closeLightbox());
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Close on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

let currentImages = [];
let currentIndex = 0;

function openLightbox(images, index) {
    currentImages = images;
    currentIndex = index;
    updateLightbox();
    document.getElementById('lightbox').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function navigateLightbox(direction) {
    currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
    updateLightbox();
}

function updateLightbox() {
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = currentImages[currentIndex].src;
    lightboxImg.alt = `Resin Art ${currentIndex + 1}`;
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroShapes = document.querySelectorAll('.floating-shapes .shape');
    heroShapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Preload images for better performance
function preloadImages(imageArray) {
    imageArray.forEach(image => {
        const img = new Image();
        img.src = image.src;
    });
}

// Preload all gallery images
Object.values(galleries).forEach(gallery => {
    preloadImages(gallery);
});

// Add loading animation to body
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Intersection Observer for navbar background
const navbarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    });
}, { threshold: 0 });

navbarObserver.observe(document.querySelector('.hero-section'));

// Gallery masonry layout (runs after images load)
function initMasonry() {
    const grids = document.querySelectorAll('.gallery-grid');
    grids.forEach(grid => {
        const items = grid.querySelectorAll('.gallery-item');
        let shortestCol = 0;
        let colHeights = [0, 0, 0];

        items.forEach((item, index) => {
            const col = index % 3;
            item.style.order = col;
            colHeights[col] += item.offsetHeight + 20;
            if (colHeights[col] < colHeights[shortestCol]) {
                shortestCol = col;
            }
        });
    });
}

// Run masonry after a delay to ensure images are loaded
setTimeout(initMasonry, 500);

// Window resize handler
window.addEventListener('resize', () => {
    initMasonry();
});