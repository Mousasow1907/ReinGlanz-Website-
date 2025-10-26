document.addEventListener('DOMContentLoaded', function () {
    const bubblesContainer = document.getElementById('bubbles-container');
    
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 60 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        const left = Math.random() * 100;
        bubble.style.left = `${left}%`;
        
        const drift = (Math.random() - 0.5) * 100;
        bubble.style.setProperty('--drift', `${drift}px`);
        
        const duration = Math.random() * 10 + 8;
        bubble.style.animationDuration = `${duration}s`;
        
        const delay = Math.random() * 5;
        bubble.style.animationDelay = `${delay}s`;
        
        if (bubblesContainer) {
            bubblesContainer.appendChild(bubble);
        }
        
        setTimeout(() => {
            if (bubble.parentElement) {
                bubble.remove();
            }
        }, (duration + delay) * 1000);
    }
    
    function createFloatingParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 15 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        const duration = Math.random() * 5 + 3;
        particle.style.animationDuration = `${duration}s`;
        
        if (bubblesContainer) {
            bubblesContainer.appendChild(particle);
        }
    }
    
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        
        const duration = Math.random() * 2 + 1;
        sparkle.style.animationDuration = `${duration}s`;
        
        if (bubblesContainer) {
            bubblesContainer.appendChild(sparkle);
        }
        
        setTimeout(() => {
            if (sparkle.parentElement) {
                sparkle.remove();
            }
        }, duration * 1000);
    }
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createBubble(), i * 500);
    }
    
    for (let i = 0; i < 20; i++) {
        createFloatingParticle();
    }
    
    setInterval(createBubble, 3000);
    setInterval(createSparkle, 1500);

    const qmEl = document.getElementById('qm');
    const preisQmEl = document.getElementById('preisQm');
    const wochenEl = document.getElementById('wochen');
    const anzahlEl = document.getElementById('anzahl');
    const outQmEl = document.getElementById('outQm');
    const gebietEl = document.getElementById('gebiet');
    const dayCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="day-"]');

    function calculate() {
        if(!qmEl || !preisQmEl || !wochenEl || !outQmEl || !anzahlEl) return;
        
        const qm = parseFloat(qmEl.value) || 0;
        const preisQm = parseFloat(preisQmEl.value.replace(',', '.')) || 0;
        const wochen = parseInt(wochenEl.value) || 0;
        
        const anzahl = Array.from(dayCheckboxes).filter(i => i.checked).length;
        anzahlEl.value = anzahl;

        const gesamt = qm * preisQm * anzahl * wochen;

        outQmEl.innerHTML = `
            <div class="font-semibold">Ergebnis (m²-Modell)</div>
            <div>Fläche: <span class="font-bold">${qm} m²</span></div>
            <div>Preis/m²: <span class="font-bold">${preisQm.toFixed(2)} €</span></div>
            <div>Anzahl Tage/Woche: <span class="font-bold">${anzahl}</span></div>
            <div>Wochen / Monat: <span class="font-bold">${wochen}</span></div>
            <div class="mt-2 pt-2 border-t border-gray-300">
                Monatliche Kosten: <span class="font-bold text-lg text-blue-600">${gesamt.toFixed(2)} €</span>
            </div>
        `;
    }

    if(gebietEl) {
        gebietEl.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            if (price && preisQmEl) {
                preisQmEl.value = price.replace('.', ',');
                calculate();
            }
        });
    }

    document.querySelectorAll('.offer-item').forEach(item => {
        item.addEventListener('click', function() {
            const gebiet = this.getAttribute('data-gebiet');
            const price = this.getAttribute('data-price');
            
            if (gebietEl && gebiet) {
                gebietEl.value = gebiet;
            }
            
            if (preisQmEl && price) {
                preisQmEl.value = price.replace('.', ',');
            }
            
            calculate();
            document.querySelectorAll('.offer-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('preise').scrollIntoView({ behavior: 'smooth' });
        });
    });

    if(qmEl) qmEl.addEventListener('input', calculate);
    if(preisQmEl) preisQmEl.addEventListener('input', calculate);
    if(wochenEl) wochenEl.addEventListener('input', calculate);
    dayCheckboxes.forEach(checkbox => checkbox.addEventListener('change', calculate));

    calculate();

    const sendBtn = document.getElementById('send');
    if(sendBtn) {
        sendBtn.addEventListener('click', function() {
            const qm = document.getElementById('qm').value;
            const anfrage = document.getElementById('anfrage').value;
            const days = {
                'monday': 'Montag',
                'tuesday': 'Dienstag',
                'wednesday': 'Mittwoch',
                'thursday': 'Donnerstag',
                'friday': 'Freitag',
                'saturday': 'Samstag',
                'sunday': 'Sonntag'
            };
            const selectedDays = Object.keys(days).filter(d => {
                const dayEl = document.getElementById(`day-${d}`);
                return dayEl && dayEl.checked;
            }).map(d => days[d]);
            const startTime = document.getElementById('start-time').value;

            const subject = 'Anfrage über den Kostenrechner';
            const body = `
Hallo,

ich habe eine Anfrage über den Kostenrechner gestellt.

Fläche: ${qm} m²
Ausgewählte Tage: ${selectedDays.join(', ') || 'Keine Auswahl'}
Startzeit: ${startTime || 'Nicht angegeben'}

Sonstige Fragen oder Anmerkungen:
${anfrage}

Viele Grüße
            `;

            window.location.href = `mailto:reinglanzbe@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    // Set year in footer
    const yearEl = document.getElementById('year');
    if(yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    document.documentElement.classList.add('dark');
    localStorage.setItem('color-theme', 'dark');

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const contactSendBtn = document.getElementById('contact-send');
    if(contactSendBtn) {
        contactSendBtn.addEventListener('click', function() {
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const phone = document.getElementById('contact-phone').value;
            const message = document.getElementById('contact-message').value;

            if (!name || !email || !message) {
                alert('Bitte füllen Sie alle Pflichtfelder aus.');
                return;
            }

            const subject = 'Kontaktanfrage von ' + name;
            const body = `
Hallo,

eine neue Kontaktanfrage ist eingegangen:

Name: ${name}
E-Mail: ${email}
${phone ? 'Telefon: ' + phone : ''}

Nachricht:
${message}

Viele Grüße
            `;

            window.location.href = `mailto:reinglanzbe@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }
});
