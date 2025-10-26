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
    
    document.querySelectorAll('.offer-item').forEach(item => {
        item.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            
            document.querySelectorAll('.offer-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            
            const serviceSelect = document.getElementById('service-select');
            if (serviceSelect && service) {
                serviceSelect.value = service;
            }
            
            const formSection = document.querySelector('.mt-10');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    document.getElementById('send').addEventListener('click', function() {
        const qm = document.getElementById('qm').value;
        const anfrage = document.getElementById('anfrage').value;
        const serviceSelect = document.getElementById('service-select');
        const selectedService = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : 'Nicht ausgewählt';
        const days = {
            'monday': 'Montag',
            'tuesday': 'Dienstag',
            'wednesday': 'Mittwoch',
            'thursday': 'Donnerstag',
            'friday': 'Freitag',
            'saturday': 'Samstag',
            'sunday': 'Sonntag'
        };
        const selectedDay = Object.keys(days).find(d => document.getElementById(`day-${d}`).checked);
        const selectedDayName = selectedDay ? days[selectedDay] : 'Keine Auswahl';
        const startTime = document.getElementById('start-time').value;

        const subject = 'Anfrage für einmaliges Angebot';
        const body = `
Hallo,

ich würde gerne ein einmaliges Angebot anfordern.

Gewähltes Angebot: ${selectedService}
Fläche: ${qm} m²

Bevorzugter Tag: ${selectedDayName}
Bevorzugte Startzeit: ${startTime || 'Nicht angegeben'}

Sonstige Fragen oder Anmerkungen:
${anfrage}

Viele Grüße
        `;

        window.location.href = `mailto:reinglanzbe@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    // Day selection logic
    const daysContainer = document.getElementById('days-container');
    if (daysContainer) {
        const checkboxes = daysContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    checkboxes.forEach(otherCheckbox => {
                        if (otherCheckbox !== this) {
                            otherCheckbox.checked = false;
                            otherCheckbox.disabled = true;
                            otherCheckbox.parentElement.classList.remove('selected');
                            otherCheckbox.parentElement.classList.add('ghost');
                        }
                    });
                    this.parentElement.classList.add('selected');
                    this.parentElement.classList.remove('ghost');
                } else {
                    checkboxes.forEach(otherCheckbox => {
                        otherCheckbox.disabled = false;
                        otherCheckbox.parentElement.classList.remove('ghost');
                    });
                    this.parentElement.classList.remove('selected');
                }
            });
        });
    }

    // Set year in footer
    const yearEl = document.getElementById('year');
    if(yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Force Dark Mode (always on)
    document.documentElement.classList.add('dark');
    localStorage.setItem('color-theme', 'dark');
});
