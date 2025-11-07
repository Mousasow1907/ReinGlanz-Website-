document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear();
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = year;
  }

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const statusMessage = document.getElementById('status-message');

  if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const company = document.getElementById('company').value;
      const service = document.getElementById('service').value;
      const serviceText = document.getElementById('service').selectedOptions[0].text;
      const area = document.getElementById('area').value;
      const message = document.getElementById('message').value;

      const subject = `Angebotsanfrage: ${serviceText} - ${name}`;
      const body = `
Hallo,

ich möchte gerne ein Angebot für folgende Reinigungsleistung erhalten:

═══════════════════════════════════════
KONTAKTINFORMATION
═══════════════════════════════════════

Name: ${name}
E-Mail: ${email}
${phone ? `Telefon: ${phone}\n` : ''}${company ? `Firma/Einrichtung: ${company}\n` : ''}
═══════════════════════════════════════
ANFRAGEDETAILS
═══════════════════════════════════════

Art der Reinigung: ${serviceText}
${area ? `Fläche: ${area} m²\n` : ''}
Nachricht:
${message}

Viele Grüße
${name}
      `;

      window.location.href = `mailto:reinglanzbe@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
});
