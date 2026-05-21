/* -------------------------------------------------------------
   PURPLE TROLL ($PTROLL) - CORE INTERACTIVE ENGINE
   ------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initContractCopy();
    initActiveLinkTracking();
});

/**
 * 1. Sticky Header Animation on Scroll
 */
function initStickyHeader() {
    const header = document.querySelector(".header");
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run once in case page starts scrolled
}

/**
 * 2. Mobile Menu Navigation Drawer Actions
 */
function initMobileMenu() {
    const toggleBtn = document.querySelector(".mobile-menu-toggle");
    const overlay = document.querySelector(".mobile-menu-overlay");
    const drawer = document.querySelector(".mobile-menu-drawer");
    const closeBtn = document.querySelector(".drawer-close");
    const drawerLinks = document.querySelectorAll(".drawer-link");

    const openMenu = () => {
        overlay.classList.add("active");
        drawer.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scroll
    };

    const closeMenu = () => {
        overlay.classList.remove("active");
        drawer.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable background scroll
    };

    toggleBtn.addEventListener("click", openMenu);
    overlay.addEventListener("click", closeMenu);
    closeBtn.addEventListener("click", closeMenu);

    // Close when a link inside the drawer is clicked
    drawerLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });
}

/**
 * 3. Intersection Observer for Beautiful Scroll Reveal Animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    
    if ("IntersectionObserver" in window) {
        const observerOptions = {
            root: null,
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        };
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, observerOptions);
        
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add("revealed"));
    }
}

/**
 * 4. Premium Click to Copy Contract Address
 */
function initContractCopy() {
    const copyBtn = document.getElementById("copy-btn");
    const caValue = document.getElementById("contract-address");
    
    if (!copyBtn || !caValue) return;
    
    const originalText = copyBtn.querySelector(".copy-text").textContent;
    let isCopying = false;
    
    copyBtn.addEventListener("click", async () => {
        if (isCopying) return;
        isCopying = true;
        
        const addressText = caValue.textContent.trim();
        
        try {
            await navigator.clipboard.writeText(addressText);
            
            // Visual feedback
            copyBtn.classList.add("copied");
            copyBtn.querySelector(".copy-text").textContent = "COPIED!";
            copyBtn.style.background = "var(--color-accent-green)";
            copyBtn.style.boxShadow = "0 0 15px var(--color-accent-green)";
            
            // Quick alert style confirmation
            const originalShadow = copyBtn.style.boxShadow;
            
            setTimeout(() => {
                copyBtn.classList.remove("copied");
                copyBtn.querySelector(".copy-text").textContent = originalText;
                copyBtn.style.background = "";
                copyBtn.style.boxShadow = "";
                isCopying = false;
            }, 1800);
            
        } catch (err) {
            console.error("Failed to copy text: ", err);
            isCopying = false;
        }
    });
}

/**
 * 5. Track Scroll and Update Navigation Active States
 */
function initActiveLinkTracking() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    
    const handleActiveLink = () => {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 120; // Offset for header height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });
        
        // If scrolled near top, default to hero
        if (window.scrollY < 100) {
            currentSectionId = "hero";
        }
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            const linkHref = link.getAttribute("href");
            if (linkHref === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    };
    
    window.addEventListener("scroll", handleActiveLink);
    handleActiveLink(); // Run initially
}
