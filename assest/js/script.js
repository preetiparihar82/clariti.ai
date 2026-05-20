document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => { navMenu.classList.toggle('active'); });
    }

    // Ensure Anime.js is loaded
    if (typeof anime !== 'undefined') {
        
        // --- 1. NEW DYNAMIC SLIDER LOGIC ---
        const slides = document.querySelectorAll('.hero-slide');
        let currentSlide = 0;
        let slideTimer;

        function showSlide(index) {
            // Clear any existing timers
            clearTimeout(slideTimer);

            // Hide old, show new
            slides.forEach(s => s.classList.remove('active'));
            const slide = slides[index];
            slide.classList.add('active');

            // Find elements to animate
            const textElements = slide.querySelectorAll('h1, p, .tag, .request-demo-btn');
            const visualElements = slide.querySelectorAll('.phone-column');
            const words = slide.querySelectorAll('.word');

            // Reset word opacity if they exist (so they can animate again next loop)
            if(words.length) {
                words.forEach(w => { 
                    w.style.opacity = 0; 
                    w.style.transform = 'translateY(15px)'; 
                });
            }

            // Create a Timeline. 
            // The 'complete' function guarantees the slide only changes AFTER animations end.
            const tl = anime.timeline({
                complete: () => {
                    // SMART TIMER: 
                    // If there are words (Slide 2), wait 3 seconds after the last word.
                    // If there are NO words (Slide 1), wait 7 seconds so the user can read the slide.
                    const holdTime = words.length > 0 ? 3000 : 6000; 

                    slideTimer = setTimeout(() => {
                        currentSlide = (currentSlide + 1) % slides.length;
                        showSlide(currentSlide);
                    }, holdTime); 
                }
            });

            // Step 1: Animate the main text and images in
            tl.add({
                targets: [textElements, visualElements],
                translateY: [30, 0],
                opacity: [0, 1],
                delay: anime.stagger(100),
                duration: 800,
                easing: 'easeOutExpo'
            });

            // Step 2: Animate the rotating words one by one in the same spot
            if (words.length > 0) {
                // Wait briefly before starting the word rotation
                tl.add({ duration: 300 }); 

                words.forEach((word, i) => {
                    const isLast = i === words.length - 1;

                    // Animate Word IN
                    tl.add({
                        targets: word,
                        translateY: [15, 0],
                        opacity: [0, 1],
                        duration: 200,
                        easing: 'easeOutQuad'
                    });

                    // If it's NOT the last word, hold it so the user can read, then fade it OUT
                    if (!isLast) {
                        tl.add({
                            targets: word,
                            translateY: [0, -15], // Slide up and fade out
                            opacity: [1, 0],
                            duration: 400,
                            delay: 1200, // HOLD DURATION: How long the word stays on screen
                            easing: 'easeInQuad'
                        });
                    }
                });
            }

        }

        // Start the slider loop
        showSlide(0);

        // --- 2. Floating Animations ---
        anime({
            targets: '#performance-widget, .chat-card',
            translateY: [-10, 10], translateX: [-5, 5], duration: 5000, direction: 'alternate', loop: true, easing: 'easeInOutSine'
        });
        anime({
            targets: '#forecast-widget, .earnings-card',
            translateY: [12, -12], translateX: [5, -5], duration: 5800, direction: 'alternate', loop: true, easing: 'easeInOutSine'
        });
        anime({
            targets: '.hero-text-glow, .dark-dashboard-wrapper::before',
            opacity: [0.5, 0.9], scale: [0.95, 1.05], duration: 4000, direction: 'alternate', loop: true, easing: 'easeInOutSine'
        });
        anime({
            targets: '.float-el', // Your main dashboard image float
            translateY: [-15, 0], duration: 6000, direction: 'alternate', loop: true, easing: 'easeInOutSine'
        });

        // --- 3. Interactive Parallax ---
        const container = document.getElementById('phone-container');
        const wrapper = document.getElementById('phone-wrapper');
        const bgImageWrapper = document.querySelector('.right-bg-image');

        if (window.matchMedia("(pointer: fine)").matches && container && wrapper) {
            wrapper.addEventListener('mousemove', (e) => {
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left - (rect.width / 2);
                const y = e.clientY - rect.top - (rect.height / 2);

                const rotateY = (x / 25).toFixed(2);
                const rotateX = -(y / 25).toFixed(2);
                const bgMoveX = -(x / 35).toFixed(2);
                const bgMoveY = -(y / 35).toFixed(2);

                container.style.transition = 'none';
                container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                if(bgImageWrapper) {
                   bgImageWrapper.style.transform = `translate(calc(-50% + ${bgMoveX}px), calc(-50% + ${bgMoveY}px)) scale(1.05)`;
                }
            });

            wrapper.addEventListener('mouseleave', () => {
                container.style.transition = 'transform 0.6s ease-out';
                container.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                if(bgImageWrapper) {
                     bgImageWrapper.style.transform = `translate(-50%, -50%) scale(1)`;
                }
            });
        }
    } else {
        console.warn("Anime.js is not loaded.");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    // Select all elements that should animate on scroll
    const reveals = document.querySelectorAll('.reveal-on-scroll');

    // Create an Intersection Observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the element is visible in the viewport
            if (entry.isIntersecting) {
                // Add the animation class
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once it has animated so it doesn't repeat
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Triggers when 15% of the element is visible
        threshold: 0.15, 
        // Starts the calculation slightly before it hits the bottom of the screen
        rootMargin: "0px 0px -50px 0px" 
    });

    // Tell the observer to watch each element
    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

});

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Interactive Accordion Logic --- */
    // Only target buttons inside our safe namespace
    const faqButtons = document.querySelectorAll('.ses-faq-btn');

    faqButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const currentItem = this.closest('.ses-faq-item');
            const answer = currentItem.querySelector('.ses-faq-answer');

            // Close other open items
            const allItems = document.querySelectorAll('.ses-faq-item');
            allItems.forEach(item => {
                if (item !== currentItem && item.classList.contains('ses-active')) {
                    item.classList.remove('ses-active');
                    item.querySelector('.ses-faq-answer').style.maxHeight = null;
                }
            });

            // Toggle clicked item
            currentItem.classList.toggle('ses-active');

            if (currentItem.classList.contains('ses-active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    /* --- 2. Scroll Animation Setup --- */
    const sectionToReveal = document.querySelector('.ses-reveal-section');

    if (sectionToReveal) {
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ses-is-visible');
                    observer.unobserve(entry.target); // Run once
                }
            });
        }, observerOptions);

        observer.observe(sectionToReveal);
    }
});


document.addEventListener('DOMContentLoaded', () => {

    /* --- Scroll Animation Setup --- */
    const revealElements = document.querySelectorAll('.fb-reveal');

    if (revealElements.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.15, 
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fb-active');
                    observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    /* --- Interactive Parallax Hover on Images --- */
    const cards = document.querySelectorAll('.fb-card');
    
    cards.forEach(card => {
        // Target your actual image tags
        const image = card.querySelector('.fb-feature-img');
        if(!image) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate movement amount (higher divider = softer movement)
            const moveX = (x - rect.width / 2) / 40; 
            const moveY = (y - rect.height / 2) / 40;

            image.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        card.addEventListener('mouseleave', () => {
            // Smoothly snap back into position and re-engage the CSS floating keyframes
            image.style.transform = `translate(0, 0)`;
            image.style.transition = `transform 0.5s ease-out`;
            
            setTimeout(() => {
                image.style.transition = ``; 
            }, 500);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {

    /* --- IntersectionObserver for Scroll Reveal Animation --- */
    const revealElements = document.querySelectorAll('.fb-reveal');

    const observerOptions = {
        root: null, // use viewport
        threshold: 0.15, // trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px" // starts calculating just before hitting bottom edge
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    };

    const revealObserver = new IntersectionObserver(observerCallback, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});
function renderClaritiPath() {
    const svg = document.getElementById('clariti-path-layer');
    const container = document.querySelector('.clariti-grid'); 
    
    // 1. MOBILE FIX: If screen is small, clear the line and exit so it doesn't leave a frozen desktop line
    if (window.innerWidth <= 1024) {
        if(svg) svg.innerHTML = ''; 
        return;
    }
    
    const badges = Array.from(document.querySelectorAll('.clariti-num-badge'));
    const cards = Array.from(document.querySelectorAll('.clariti-card'));
    
    if(!svg || !container || badges.length === 0 || cards.length === 0) return;

    // Clear previous drawing
    svg.innerHTML = '';
    const containerRect = container.getBoundingClientRect();

    // Map badge coordinates relative to the grid container
    const badgePoints = badges.map(badge => {
        const rect = badge.getBoundingClientRect();
        return {
            leftEdge: rect.left - containerRect.left,
            rightEdge: rect.right - containerRect.left,
            yCenter: (rect.top - containerRect.top) + (rect.height / 2)
        };
    });

    // Map card coordinates to find the exact gaps between columns
    const cardPoints = cards.map(card => {
        const rect = card.getBoundingClientRect();
        return {
            leftEdge: rect.left - containerRect.left,
            rightEdge: rect.right - containerRect.left
        };
    });

    let d = "";

    // The horizontal line bringing the path in from the left
    const entryHeight = badgePoints[1].yCenter; 
    const dropX = badgePoints[0].leftEdge - 24; 
    
    // Draw Entry Line (comes from far left)
    d += `M -500 ${entryHeight} `; 
    d += `L ${dropX} ${entryHeight} `; 
    d += `L ${dropX} ${badgePoints[0].yCenter} `; 
    d += `L ${badgePoints[0].leftEdge} ${badgePoints[0].yCenter} `; 

    // Draw connecting zigzag loops behind the cards
    for (let i = 0; i < badgePoints.length - 1; i++) {
        const currentBadge = badgePoints[i];
        const nextBadge = badgePoints[i + 1];
        
        const currentCard = cardPoints[i];
        const nextCard = cardPoints[i + 1];

        // Start path at the right edge of the current badge
        d += `M ${currentBadge.rightEdge} ${currentBadge.yCenter} `;
        
        // Calculate the exact middle gap between the CARDS
        const midX = currentCard.rightEdge + ((nextCard.leftEdge - currentCard.rightEdge) / 2);
        
        // Draw straight right (hides invisibly behind the card because card has z-index: 10)
        d += `L ${midX} ${currentBadge.yCenter} `;
        
        // Drop down/up through the empty gap safely
        d += `L ${midX} ${nextBadge.yCenter} `;
        
        // Draw into the left side of the next badge
        d += `L ${nextBadge.leftEdge} ${nextBadge.yCenter} `;
    }

    // Draw Exit Line (extends off the right side of the screen)
    const lastBadge = badgePoints[badgePoints.length - 1];
    d += `M ${lastBadge.rightEdge} ${lastBadge.yCenter} `;
    d += `L ${containerRect.width + 500} ${lastBadge.yCenter} `;

    // Render the SVG path onto the DOM
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'clariti-animated-path');
    
    svg.appendChild(path);
}

// Bind standard resize events
window.addEventListener('load', renderClaritiPath);
window.addEventListener('resize', renderClaritiPath);

// 2. FONT FIX: Wait for custom web fonts to load before drawing to prevent misalignment
if (document.fonts) {
    document.fonts.ready.then(renderClaritiPath);
} else {
    // Fallback for older browsers
    setTimeout(renderClaritiPath, 150);
    setTimeout(renderClaritiPath, 600);
}


document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Automated Vertical Testimonial Scroller ---
    const track = document.getElementById('sp-test-track');
    
    // Scroll interval (every 4 seconds)
    setInterval(() => {
        // Get the top testimonial
        const firstItem = track.children[0];
        
        // Calculate exactly how far to slide up (height of item + its bottom margin)
        const style = window.getComputedStyle(firstItem);
        const margin = parseFloat(style.marginBottom);
        const shiftDistance = firstItem.offsetHeight + margin;

        // Apply smooth transition and move track up
        track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        track.style.transform = `translateY(-${shiftDistance}px)`;

        // Wait for the slide animation to finish
        setTimeout(() => {
            // Remove animation temporarily
            track.style.transition = 'none';
            // Pop the first item and place it invisibly at the bottom
            track.appendChild(firstItem);
            // Instantly snap the track back to top position (no visual jump because item is gone)
            track.style.transform = 'translateY(0)';
        }, 600); // 600ms matches the CSS transition time

    }, 4000); 


    // --- 2. Automated Stats Swapper (Unchanged from before) ---
    const statsData = [
        { val: "99", suf: "%", label: "ACCURACY RATE" },
        { val: "12", suf: "ms", label: "AVG LATENCY" },
        { val: "500", suf: "+", label: "ENTERPRISE APPS" },
        { val: "24/7", suf: "", label: "LIVE SUPPORT" }
    ];

    const statContainers = document.querySelectorAll('.sp-stat-content.sp-animatable');

    setInterval(() => {
        // 1. Fade out current data
        statContainers.forEach(container => container.classList.add('sp-fade-out'));

        // 2. Wait for fade, shift array, and inject new data
        setTimeout(() => {
            const lastItem = statsData.pop();
            statsData.unshift(lastItem); // Circular shift

            statContainers.forEach((container, i) => {
                container.querySelector('.stat-val').innerText = statsData[i].val;
                container.querySelector('.stat-suf').innerText = statsData[i].suf;
                container.querySelector('.sp-stat-label').innerText = statsData[i].label;
                
                // Reset and fade back in
                container.classList.remove('sp-fade-out');
                container.classList.add('sp-fade-in-prepare');
                void container.offsetWidth; // Trigger DOM reflow
                container.classList.remove('sp-fade-in-prepare');
            });
        }, 400); 

    }, 3500); // Swaps slightly faster than the scroll to offset animations nicely
});

document.addEventListener("DOMContentLoaded", function() {
    // Select all elements with the animation class
    const elementsToAnimate = document.querySelectorAll('.cl-animate-up');

    // Create an intersection observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the element is in the viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('cl-visible');
                // Unobserve so the animation only happens once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Triggers when 15% of the element is visible
    });

    // Observe each element
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});

