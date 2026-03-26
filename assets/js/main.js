/* ============================================
   CODEX AETERNA - Main JavaScript
   ============================================ */

// ============================================
// EMAILJS CONFIGURATION
// ============================================

// Initialize EmailJS (only if loaded — not every page includes the SDK)
if (typeof emailjs !== 'undefined') {
  emailjs.init("kNEutPBZIXOEln6NO");
}

// ============================================
// FORM SUBMISSION HANDLER
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Show loading state
      submitButton.textContent = '✉️ Sending...';
      submitButton.disabled = true;
      
      // Add timestamp
      const now = new Date();
      const timestamp = now.toLocaleString('en-US', { 
        timeZone: 'America/Los_Angeles',
        dateStyle: 'full',
        timeStyle: 'short'
      });
      
      // Get form data
      const formData = new FormData(this);
      
      // Handle checkbox
      const reserveCheckbox = this.querySelector('#reserve');
      const reserveValue = reserveCheckbox && reserveCheckbox.checked 
        ? 'YES - Priority queue requested' 
        : 'No';
      
      // Create template parameters
      const templateParams = {
        name: formData.get('name'),
        email: formData.get('email'),
        memorialFor: formData.get('memorialFor') || 'Not specified',
        type: formData.get('type') || 'Not specified',
        source: formData.get('source') || 'Not specified',
        budget: formData.get('budget') || 'Not specified',
        message: formData.get('message'),
        reserve: reserveValue,
        timestamp: timestamp
      };
      
      // Send email via EmailJS
      if (typeof emailjs === 'undefined') {
        alert('Email service not loaded. Please email directly:\nhello@codexaeterna.com');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        return;
      }
      emailjs.send(
        'service_0kveogc',
        'template_c00j2et',
        templateParams
      )
      .then(function(response) {
        console.log('Email sent successfully:', response);
        
        // Success message
        alert('✓ Message sent successfully.\n\n' +
          'We\'ll respond to ' + templateParams.email + ' within 24 hours.\n\n' +
          '— Codex Aeterna');
        
        // Reset form
        contactForm.reset();
        
        // Restore button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      })
      .catch(function(error) {
        console.error('EmailJS error:', error);
        
        // Error message with fallback
        alert('⚠ There was an error sending your message.\n\n' +
              'Please email me directly at:\n' +
              'hello@codexaeterna.com\n\n' +
              '(I respond within 24 hours)');
        
        // Restore button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
    });
  }

  // ============================================
  // IMAGE ROTATION
  // ============================================

  const souls = [
    {
      type: "image",
      src: "url('assets/img/ElonFullSingularity.webp')",
      label: "Elon Musk · Singularity",
      corpus: "54K tweets",
      dim: "2010–2025",
      tooltip: "15 years of consciousness mapped. Cool → Hot. Sparse → Dense. The evolution of a mind over time."
    },
    {
      type: "image",
      src: "url('assets/img/WilliamShakespeareFull.webp')",
      label: "Shakespeare · Folio",
      corpus: "37 plays",
      dim: "Drama",
      tooltip: "The complete spectral signature of Shakespeare's folio — poetic density rendered as geometric form."
    },
    {
      type: "image",
      src: "url('assets/img/Onegin.webp')",
      label: "Pushkin · Onegin",
      corpus: "Novel",
      dim: "Poetry",
      tooltip: "Pushkin's Eugene Onegin — a rotationally aligned signature emphasizing its verse structure."
    },
    {
      type: "image",
      src: "url('assets/img/WarandPiece2.webp')",
      label: "Tolstoy · War & Peace",
      corpus: "Epic",
      dim: "Prose",
      tooltip: "Leo Tolstoy's War and Peace — massive prose corpus visualized as coherent semantic geometry."
    },
    {
      type: "image",
      src: "url('assets/img/max-steel-memorial.jpg')",
      label: "Max · Steel Memorial",
      corpus: "Pet Memorial",
      dim: "RAG-enriched",
      tooltip: "A devoted companion's soul etched in steel. Owner memories enriched against 50,000 classical texts."
    },
    {
      type: "image",
      src: "url('assets/img/buddy-metal-samples.jpg')",
      label: "Buddy · Material Tests",
      corpus: "Pet Memorial",
      dim: "Steel & Aluminum",
      tooltip: "The same soul signature rendered across different metals and laser techniques. Steel, anodized aluminum, varying finishes."
    }
  ];

  let currentIndex = 0;
  const visualArt = document.getElementById('visual-art');
  const labelEl = document.getElementById('visual-label');
  const corpusEl = document.getElementById('visual-corpus');
  const dimEl = document.getElementById('visual-dim');
  const tooltipWrapper = document.getElementById('visual-tooltip-wrapper');

  function updateVisual(soul) {
    labelEl.textContent = soul.label;
    corpusEl.textContent = soul.corpus;
    dimEl.textContent = soul.dim;
    visualArt.style.backgroundImage = soul.src;
    tooltipWrapper.dataset.tooltip = soul.tooltip || soul.label;
  }

  function cycleSouls() {
    visualArt.classList.add('fade-out');
    
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % souls.length;
      const nextSoul = souls[currentIndex];
      updateVisual(nextSoul);
      visualArt.classList.remove('fade-out');
    }, 800);
  }

  if (visualArt && labelEl && corpusEl && dimEl) {
    updateVisual(souls[0]);
    setInterval(cycleSouls, 5000);
  }

  // ============================================
  // HAMBURGER MENU TOGGLE
  // ============================================

  document.querySelectorAll('.hamburger').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var container = this.closest('header') || this.closest('.site-nav');
      if (container) {
        var isOpen = container.classList.toggle('nav-open');
        this.setAttribute('aria-expanded', String(isOpen));
      }
    });
  });

  // Close nav when a link is clicked on mobile
  document.querySelectorAll('header nav a, .site-nav nav a').forEach(function(link) {
    link.addEventListener('click', function() {
      var container = this.closest('header') || this.closest('.site-nav');
      if (container) {
        container.classList.remove('nav-open');
        var btn = container.querySelector('.hamburger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ============================================
  // GALAXY HERO CLICK-THROUGH
  // ============================================

  const galaxyHero = document.querySelector('.galaxy-teaser');
  if (galaxyHero) {
    galaxyHero.addEventListener('click', function(e) {
      // Don't navigate if clicking a button/link (they handle themselves)
      if (e.target.closest('a') || e.target.closest('button')) return;
      window.location.href = 'galaxy.html';
    });
  }

  // ============================================
  // AUTO-UPDATE COPYRIGHT YEAR
  // ============================================

  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
