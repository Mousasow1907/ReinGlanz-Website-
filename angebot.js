
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('send').addEventListener('click', function() {
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
        const selectedDay = Object.keys(days).find(d => document.getElementById(`day-${d}`).checked);
        const selectedDayName = selectedDay ? days[selectedDay] : 'Keine Auswahl';
        const startTime = document.getElementById('start-time').value;

        const subject = 'Anfrage für einmaliges Angebot';
        const body = `
Hallo,

ich würde gerne ein einmaliges Angebot anfordern.

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

    // Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    function setLightTheme() {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
        themeToggleDarkIcon.classList.remove('hidden');
        themeToggleLightIcon.classList.add('hidden');
    }

    function setDarkTheme() {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleDarkIcon.classList.add('hidden');
    }

    // Initial theme check
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkTheme();
    } else {
        setLightTheme();
    }

    themeToggleBtn.addEventListener('click', function() {
        if (localStorage.getItem('color-theme') === 'light') {
            setDarkTheme();
        } else {
            setLightTheme();
        }
    });
});
