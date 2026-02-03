document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = navLinks.classList.contains('active') ? '✕' : '☰';
      menuBtn.innerHTML = icon;
    });
  }

  // Contact Form Handling
  const quoteForm = document.getElementById('quote-form');
  const copyQuoteBtn = document.getElementById('copy-quote');

  if (quoteForm) {
    // Check for freight query string
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('type') === 'freight') {
      const notesField = document.getElementById('notes');
      if (notesField) {
        notesField.value = "I need a freight quote for...";
      }
    }

    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(quoteForm);
      const data = Object.fromEntries(formData);
      
      // Basic validation
      if (!data.name || !data.email || !data.phone) {
        alert('Please fill in all required fields.');
        return;
      }

      // Construct email body
      const subject = `Quote Request: ${data.material} - ${data.company || data.name}`;
      const body = `
Name: ${data.name}
Company: ${data.company}
Email: ${data.email}
Phone: ${data.phone}

Material: ${data.material}
Quantity: ${data.quantity}
Pickup: ${data.pickup_location}
Delivery: ${data.delivery_location}
Timeline: ${data.timeline}

Notes:
${data.notes}
      `.trim();

      // Open mailto
      window.location.href = `mailto:sales@yourdomain.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    // Copy Details
    if (copyQuoteBtn) {
      copyQuoteBtn.addEventListener('click', () => {
        const formData = new FormData(quoteForm);
        const data = Object.fromEntries(formData);
        
        const text = `
Name: ${data.name}
Company: ${data.company}
Email: ${data.email}
Phone: ${data.phone}
Material: ${data.material}
Quantity: ${data.quantity}
Notes: ${data.notes}
        `.trim();

        navigator.clipboard.writeText(text).then(() => {
          const originalText = copyQuoteBtn.textContent;
          copyQuoteBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyQuoteBtn.textContent = originalText;
          }, 2000);
        });
      });
    }
  }

  // Active Link Handling
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
      link.classList.add('active');
    }
  });
});
