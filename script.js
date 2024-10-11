document.addEventListener('DOMContentLoaded', function() {
    const tshirt = document.getElementById('tshirt');
    const design = document.getElementById('design');
    const upload = document.getElementById('upload');
    const sizeSlider = document.getElementById('size');
    const xPositionSlider = document.getElementById('x-position');
    const yPositionSlider = document.getElementById('y-position');
    const downloadBtn = document.getElementById('download');
    const sampleDesigns = document.querySelectorAll('.sample-design');
    const designerSection = document.querySelector('.designer-section');

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Header scroll effect with smooth transition
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for fade-in animations
    const fadeElems = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElems.forEach(elem => observer.observe(elem));

    function updateDesign() {
        const size = sizeSlider.value;
        const x = xPositionSlider.value;
        const y = yPositionSlider.value;

        design.style.maxWidth = `${size}%`;
        design.style.maxHeight = `${size}%`;
        design.style.left = `${x}%`;
        design.style.top = `${y}%`;

        // Add a subtle animation effect
        design.style.transition = 'all 0.3s ease-out';
    }

    function loadDesign(src) {
        design.style.opacity = '0';
        design.src = src;
        design.style.display = 'block';
        updateDesign();
        
        // Fade in the new design
        setTimeout(() => {
            design.style.opacity = '1';
            design.style.transition = 'opacity 0.5s ease-in';
        }, 100);
    }

    upload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            loadDesign(event.target.result);
        };

        reader.readAsDataURL(file);

        // Add a visual feedback for successful upload
        upload.classList.add('uploaded');
        setTimeout(() => upload.classList.remove('uploaded'), 1000);
    });

    sizeSlider.addEventListener('input', updateDesign);
    xPositionSlider.addEventListener('input', updateDesign);
    yPositionSlider.addEventListener('input', updateDesign);

    downloadBtn.addEventListener('click', function() {
        const previewElement = document.querySelector('.tshirt-preview');
        if (!previewElement) {
            console.error("T-shirt preview element not found");
            showNotification("An error occurred. T-shirt preview element not found.", "error");
            return;
        }

        // Add a loading animation
        downloadBtn.classList.add('loading');

        html2canvas(previewElement, {
            useCORS: true,
            allowTaint: true,
            foreignObjectRendering: true,
            logging: true,
            onclone: function(clonedDoc) {
                console.log("Cloned document:", clonedDoc);
            }
        }).then(canvas => {
            console.log("Canvas generated successfully");
            try {
                const dataURL = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'custom-tshirt.png';
                link.href = dataURL;
                link.click();
                showNotification("Your design has been downloaded!", "success");
            } catch (error) {
                console.error("Error generating data URL:", error);
                showNotification("An error occurred while generating the preview. Please try uploading your own image.", "error");
            }
        }).catch(error => {
            console.error("Error generating canvas:", error);
            showNotification("An error occurred while generating the preview. Please try again.", "error");
        }).finally(() => {
            downloadBtn.classList.remove('loading');
        });
    });

    sampleDesigns.forEach(function(sampleDesign) {
        sampleDesign.addEventListener('click', function() {
            loadDesign(this.src);
            
            // Add a visual feedback for selection
            sampleDesigns.forEach(design => design.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Function to show notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 100);
    }

    // Add parallax effect to the hero section
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = scrollPosition * 0.7 + 'px';
    });

    // Add a typing effect to the hero title
    const heroTitle = document.querySelector('.hero h1');
    const titleText = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    function typeWriter() {
        if (i < titleText.length) {
            heroTitle.textContent += titleText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();
});