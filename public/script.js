document.addEventListener('DOMContentLoaded', function () {
    const qmEl = document.getElementById('qm');
    const preisQmEl = document.getElementById('preisQm');
    const wochenEl = document.getElementById('wochen');
    const anzahlEl = document.getElementById('anzahl');
    const outQmEl = document.getElementById('outQm');
    const dayCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="day-"]');
    const serviceTabs = document.querySelectorAll('.service-tab');
    const offerCards = document.querySelectorAll('.offer-card');

    function selectService(service, price) {
        serviceTabs.forEach(tab => {
            if (tab.dataset.service === service) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        offerCards.forEach(card => {
            if (card.dataset.service === service) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        if (preisQmEl) {
            preisQmEl.value = price.toString().replace('.', ',');
        }
        calculate();
    }

    serviceTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const service = this.dataset.service;
            const price = parseFloat(this.dataset.price);
            selectService(service, price);
        });
    });

    offerCards.forEach(card => {
        card.addEventListener('click', function() {
            const service = this.dataset.service;
            const price = parseFloat(this.dataset.price);
            selectService(service, price);
        });
    });

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

    // Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    if(themeToggleBtn) {
        // Change the icons inside the button based on previous settings
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            themeToggleLightIcon.classList.remove('hidden');
            document.documentElement.classList.add('dark');
        } else {
            themeToggleDarkIcon.classList.remove('hidden');
            document.documentElement.classList.remove('dark');
        }

        themeToggleBtn.addEventListener('click', function() {
            // toggle icons inside button
            themeToggleDarkIcon.classList.toggle('hidden');
            themeToggleLightIcon.classList.toggle('hidden');

            // if set via local storage previously
            if (localStorage.getItem('color-theme')) {
                if (localStorage.getItem('color-theme') === 'light') {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                }

            // if NOT set via local storage previously
            } else {
                if (document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                } else {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                }
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
