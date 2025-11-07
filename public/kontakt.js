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

  if (form && submitBtn && statusMessage) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        company: document.getElementById('company').value,
        service: document.getElementById('service').value,
        area: document.getElementById('area').value,
        message: document.getElementById('message').value,
      };

      try {
        const supabaseUrl = 'https://vfhhucchsbyvpzufhsgq.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmaGh1Y2Noc2J5dnB6dWZoc2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NDE2MjQsImV4cCI6MjA3ODExNzYyNH0.EdM0vmv7p7iZ5qbMYXTyNQK7mlSOKDLua0HCA9UcgvU';

        const response = await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          statusMessage.className = 'p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700';
          statusMessage.textContent = 'Vielen Dank! Ihr Angebot wurde erfolgreich versendet. Wir melden uns schnellstmöglich bei Ihnen.';
          statusMessage.classList.remove('hidden');

          form.reset();

          setTimeout(() => {
            window.location.href = 'index.html';
          }, 3000);
        } else {
          throw new Error(result.message || 'Ein Fehler ist aufgetreten');
        }
      } catch (error) {
        statusMessage.className = 'p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700';
        statusMessage.textContent = 'Fehler beim Senden des Angebots. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.';
        statusMessage.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Angebot senden';
      }
    });
  }
});
