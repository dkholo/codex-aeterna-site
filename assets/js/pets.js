/* ============================================
   ETERNAL MONUMENT - Pets Page JavaScript
   ============================================ */

// ============================================
// EMAILJS CONFIGURATION
// ============================================

// Initialize EmailJS (same account as main site)
emailjs.init("kNEutPBZIXOEln6NO");

// ============================================
// PET MEMORIAL FORM HANDLER
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const petForm = document.getElementById('pet-memorial-form');
  
  if (petForm) {
    petForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Show loading state
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      
      // Add timestamp
      const now = new Date();
      const timestamp = now.toLocaleString('en-US', { 
        timeZone: 'America/Los_Angeles',
        dateStyle: 'full',
        timeStyle: 'short'
      });
      
      // Get form data
      const form = this;
      const templateParams = {
        petName: form.petName.value,
        species: form.species.value,
        breed: form.breed.value || 'Not specified',
        years: form.years.value || 'Not specified',
        personality: form.personality.value,
        favorites: form.favorites.value,
        moment: form.moment.value,
        miss: form.miss.value,
        additional: form.additional.value || 'None',
        ownerName: form.ownerName.value,
        email: form.email.value,
        format: form.format.value || 'Undecided',
        formType: 'Pet Memorial',
        timestamp: timestamp
      };
      
      // Send email via EmailJS
      // TODO: Create a pet-specific template or use the same one
      emailjs.send(
        'service_0kveogc',
        'template_c00j2et',
        templateParams
      )
      .then(function(response) {
        console.log('Email sent successfully:', response);
        
        alert('Thank you, ' + templateParams.ownerName + '!\n\n' +
          'Your memorial request for ' + templateParams.petName + ' has been received.\n\n' +
          'You\'ll receive a preview at ' + templateParams.email + ' within 48 hours.\n\n' +
          '— Codex Aeterna');
        
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      })
      .catch(function(error) {
        console.error('EmailJS error:', error);
        
        alert('⚠ There was an error sending your message.\n\n' +
              'Please email us directly at:\n' +
              'hello@codexaeterna.com\n\n' +
              '(We respond within 24 hours)');
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
    });
  }

  // ============================================
  // PET MEMORIAL IMAGE ROTATION
  // ============================================

  const petSouls = [
    {
      type: "image",
      src: "url('assets/img/max-steel-memorial.jpg')",
      label: "Max · Steel Memorial",
      corpus: "Beloved Companion",
      dim: "Etched in Steel",
      tooltip: "A devoted dog's soul captured forever. Owner memories enriched against 50,000 classical texts, then laser-etched into steel."
    },
    {
      type: "image",
      src: "url('assets/img/buddy-metal-samples.jpg')",
      label: "Buddy · Material Tests",
      corpus: "Beloved Companion",
      dim: "Steel & Aluminum",
      tooltip: "One soul, multiple materials. Testing steel, anodized aluminum, and different laser techniques to find the perfect finish."
    },
    // Add more pet memorial images here
  ];

  let currentIndex = 0;
  const visualArt = document.getElementById('pet-visual-art');
  const labelEl = document.getElementById('pet-visual-label');
  const corpusEl = document.getElementById('pet-visual-corpus');
  const dimEl = document.getElementById('pet-visual-dim');
  const tooltipWrapper = document.getElementById('pet-tooltip-wrapper');

  function updateVisual(soul) {
    if (labelEl) labelEl.textContent = soul.label;
    if (corpusEl) corpusEl.textContent = soul.corpus;
    if (dimEl) dimEl.textContent = soul.dim;
    if (visualArt) visualArt.style.backgroundImage = soul.src;
    if (tooltipWrapper) tooltipWrapper.dataset.tooltip = soul.tooltip || soul.label;
  }

  function cycleSouls() {
    if (!visualArt) return;
    
    visualArt.classList.add('fade-out');
    
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % petSouls.length;
      const nextSoul = petSouls[currentIndex];
      updateVisual(nextSoul);
      visualArt.classList.remove('fade-out');
    }, 800);
  }

  // Only start slideshow if we have images AND the elements exist
  if (petSouls.length > 0 && visualArt && labelEl && corpusEl && dimEl) {
    updateVisual(petSouls[0]);
    setInterval(cycleSouls, 5000);
  }

  // ============================================
  // AUTO-UPDATE COPYRIGHT YEAR
  // ============================================

  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
