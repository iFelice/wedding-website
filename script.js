// --- Funzioni Utilità ---
function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

// --- Mobile Menu Toggle ---
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        const isActive = nav.classList.toggle('active');
        setAttributes(menuToggle, {
            'aria-expanded': isActive,
            'aria-label': isActive ? 'Chiudi menu' : 'Apri menu'
        });
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars', !isActive);
            icon.classList.toggle('fa-times', isActive);
        }
    });

    // Chiudi menu se si clicca un link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                setAttributes(menuToggle, {'aria-expanded': 'false', 'aria-label': 'Apri menu'});
                 const icon = menuToggle.querySelector('i');
                 if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
            }
        });
    });


    // Chiudi menu se si clicca fuori
    document.addEventListener('click', (event) => {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
            nav.classList.remove('active');
            setAttributes(menuToggle, {'aria-expanded': 'false', 'aria-label': 'Apri menu'});
             const icon = menuToggle.querySelector('i');
             if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
        }
    });
}


// --- Countdown timer (Solo su Home Page) ---
const countdownElement = document.querySelector('.countdown');
if (countdownElement) { // Esegui solo se esiste l'elemento countdown
    const weddingDate = new Date('July 12, 2025 15:30:00').getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(countdownTimer);
            if (daysEl) daysEl.innerText = '000';
            if (hoursEl) hoursEl.innerText = '00';
            if (minutesEl) minutesEl.innerText = '00';
            if (secondsEl) secondsEl.innerText = '00';
            // Potresti mostrare un messaggio tipo "Evento iniziato!"
            return;
        }
        const days = Math.floor(distance / 864e5);
        const hours = Math.floor((distance % 864e5) / 36e5);
        const minutes = Math.floor((distance % 36e5) / 6e4);
        const seconds = Math.floor((distance % 6e4) / 1e3);

        if (daysEl) daysEl.innerText = days.toString().padStart(3, '0');
        if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
    }

    // Verifica che tutti gli elementi esistano prima di avviare
    if (daysEl && hoursEl && minutesEl && secondsEl) {
        updateCountdown(); // Chiamata iniziale
        var countdownTimer = setInterval(updateCountdown, 1000); // Salva l'intervallo per poterlo fermare
    } else {
        console.warn("Elementi del countdown non trovati.");
    }
}


// --- FAQ accordion (Solo su Pagina FAQ) ---
const faqContainer = document.querySelector('.faq-container');
if (faqContainer) { // Esegui solo se siamo nella pagina con le FAQ
    const faqQuestions = faqContainer.querySelectorAll('.faq-question');
    faqQuestions.forEach((question, index) => {
        const answer = question.nextElementSibling;
        if (answer && answer.classList.contains('faq-answer')) {
            const questionId = `faq-question-${index}`;
            const answerId = `faq-answer-${index}`;
            setAttributes(question, { 'id': questionId, 'aria-expanded': 'false', 'aria-controls': answerId, 'role': 'button', 'tabindex': '0' });
            setAttributes(answer, { 'id': answerId, 'role': 'region', 'aria-labelledby': questionId });
            answer.style.display = 'none'; // Nascondi inizialmente con JS

            question.addEventListener('click', () => {
                const isActive = question.classList.toggle('active');
                answer.style.display = isActive ? 'block' : 'none';
                // // Animazione slide (sostituisce display block/none)
                // if (isActive) {
                //     answer.style.maxHeight = answer.scrollHeight + "px";
                //     answer.style.paddingTop = '15px'; // Ripristina padding se usi maxHeight
                //     answer.style.paddingBottom = '5px';
                // } else {
                //     answer.style.maxHeight = null;
                //     answer.style.paddingTop = '0';
                //     answer.style.paddingBottom = '0';
                // }
                question.setAttribute('aria-expanded', isActive);

                // Chiudi le altre (opzionale)
                faqQuestions.forEach((otherQ, otherIdx) => {
                    if (otherIdx !== index && otherQ.classList.contains('active')) {
                         otherQ.classList.remove('active');
                         otherQ.nextElementSibling.style.display = 'none';
                         // otherQ.nextElementSibling.style.maxHeight = null; // Per animazione
                         otherQ.setAttribute('aria-expanded', 'false');
                    }
                });
            });

            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); question.click(); }
            });
        }
    });
}


// --- Gallery modal implementation (Solo su Pagina Galleria) ---
const galleryContainerElement = document.querySelector('.gallery-container');
if (galleryContainerElement) { // Esegui solo se siamo nella pagina galleria
    const modal = document.getElementById('galleryModal'); // Assicurati che questo ID sia presente nell'HTML della galleria
    const modalImg = document.getElementById('modalImg');
    const closeBtn = modal?.querySelector('.modal-close');
    const prevBtn = modal?.querySelector('.modal-prev');
    const nextBtn = modal?.querySelector('.modal-next');
    const galleryItems = galleryContainerElement.querySelectorAll('.gallery-item'); // Seleziona i contenitori
    const galleryImages = Array.from(galleryContainerElement.querySelectorAll('.gallery-item img')); // Array delle sole immagini
    let currentImageIndex = 0;
    let modalIsOpen = false;

     if (!modal || !modalImg || galleryItems.length === 0) {
        console.warn("Elementi della galleria modale non trovati.");
    } else {
        function updateModalImage() {
            if (galleryImages.length > 0 && modalImg) {
                modalImg.src = galleryImages[currentImageIndex].src;
                modalImg.alt = galleryImages[currentImageIndex].alt || `Immagine galleria ${currentImageIndex + 1}`;
            }
        }
        function openModal(index) {
            modalIsOpen = true;
            modal.style.display = 'flex';
            currentImageIndex = index;
            updateModalImage();
            document.body.style.overflow = 'hidden'; // Blocca scroll sfondo
            modal.setAttribute('aria-hidden', 'false');
            closeBtn?.focus(); // Focus sul bottone chiudi
        }
        function closeModal() {
            modalIsOpen = false;
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Sblocca scroll
            modal.setAttribute('aria-hidden', 'true');
            // Riporta il focus all'elemento della galleria cliccato (opzionale)
            galleryItems[currentImageIndex]?.focus();
        }
        function showImage(newIndex) {
            if (!modalIsOpen) return;
            currentImageIndex = (newIndex + galleryImages.length) % galleryImages.length; // Gestisce giro avanti/indietro
            updateModalImage();
        }
        function nextImage() { showImage(currentImageIndex + 1); }
        function prevImage() { showImage(currentImageIndex - 1); }

        galleryItems.forEach((item, index) => {
             item.addEventListener('click', () => openModal(index));
             setAttributes(item, {'role': 'button', 'tabindex': '0', 'aria-label': `Apri immagine ${index+1}`});
             item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(index); } });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);

        // Navigazione tastiera e chiusura click esterno
        document.addEventListener('keydown', (e) => {
             if (modalIsOpen) {
                 if (e.key === 'ArrowLeft') prevImage();
                 if (e.key === 'ArrowRight') nextImage();
                 if (e.key === 'Escape') closeModal();
             }
        });
        modal.addEventListener('click', (e) => { if (e.target === modal) { closeModal(); } });
    }
}


// --- RSVP Form Logic (Solo su Pagina RSVP) ---
const rsvpFormElement = document.getElementById('rsvpForm');
if (rsvpFormElement) { // Esegui solo se il form esiste
    // Avvolgi tutto in DOMContentLoaded per sicurezza
    document.addEventListener('DOMContentLoaded', function() {
        const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyz9pePUO-T2SbDVxP-3Xvv8EfNoraIf6jUaniIw4dpXbmU3cjsDQq64dJemoPthu1M/exec';
        const form = document.getElementById('rsvpForm');
        // Assicurati che l'overlay esista nell'HTML di rsvp.html
        const loadingOverlay = document.getElementById('loading-overlay');
        const submitButton = form?.querySelector('button[type="submit"]');

        const numeroOspitiGroup = document.getElementById('numero-ospiti-group');
        const nomiOspitiGroup = document.getElementById('nomi-ospiti-group');
        const preferenzeMenuGroup = document.getElementById('preferenze-menu-group');
        const intolleranzeGroup = document.getElementById('intolleranze-group');
        const numeroOspitiSelect = document.getElementById('numero-ospiti');
        const nomiOspitiText = document.getElementById('nomi-ospiti');
        const preferenzeMenuSelect = document.getElementById('preferenze-menu');
        const intolleranzeText = document.getElementById('intolleranze');

        const conditionalGroups = [numeroOspitiGroup, nomiOspitiGroup, preferenzeMenuGroup, intolleranzeGroup];
        const requiredIfParticipating = [numeroOspitiSelect, nomiOspitiText, preferenzeMenuSelect]; // Campi richiesti se si partecipa

        if (!WEB_APP_URL || !WEB_APP_URL.startsWith('https://script.google.com/')) {
             console.error('URL App Web non valido per RSVP.'); alert('Errore configurazione modulo RSVP. Contattare gli sposi.');
             if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Errore Configurazione'; }
             return;
        }
        if (!loadingOverlay) {
            console.warn("Elemento 'loading-overlay' non trovato nella pagina RSVP.");
        }

        const handlePartecipazioneChange = (showFields) => {
             conditionalGroups.forEach(el => {
                 if (el) {
                     // Transizione fade (opzionale, richiede CSS aggiuntivo)
                     // el.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
                     // if (showFields) {
                     //     el.style.visibility = 'visible';
                     //     el.style.opacity = '1';
                     //     el.style.display = 'block'; // Assicura sia block
                     // } else {
                     //     el.style.opacity = '0';
                     //     el.style.visibility = 'hidden';
                     //     // Non impostare display:none subito per far funzionare la transizione
                     //     // setTimeout(() => { if (el.style.opacity === '0') el.style.display = 'none'; }, 300);
                     //     el.style.display = 'none'; // Semplice hide/show
                     // }
                     el.style.display = showFields ? 'block' : 'none'; // Versione semplice
                 }
             });
             requiredIfParticipating.forEach(input => {
                 if (input) input.required = showFields;
             });
             // Resetta i campi se si seleziona "No"
             if (!showFields) {
                [numeroOspitiSelect, nomiOspitiText, preferenzeMenuSelect, intolleranzeText].forEach(input => {
                    if (input) {
                        if (input.tagName === 'SELECT') input.selectedIndex = 0; else input.value = '';
                        input.removeAttribute('required'); // Rimuovi required se nascosto
                    }
                });
            }
        };

        document.querySelectorAll('input[name="entry.682165499"]').forEach(radio => {
             radio.addEventListener('change', (e) => handlePartecipazioneChange(e.target.value === 'Sì, ci sarò'));
        });

        form.addEventListener('submit', async (e) => {
             e.preventDefault();
             if (loadingOverlay) loadingOverlay.style.display = 'flex';
             if (submitButton) submitButton.disabled = true;

             try {
                 const formData = new FormData(form);
                 const partecipazioneValue = formData.get('entry.682165499');

                 // Rimuovi campi condizionali non necessari se non si partecipa
                 if (partecipazioneValue !== 'Sì, ci sarò') {
                     ['entry.349902564', 'entry.155324483', 'entry.1172181114', 'entry.304213983'].forEach(key => {
                        if (formData.has(key)) formData.delete(key);
                     });
                 }

                 const response = await fetch(WEB_APP_URL, { method: 'POST', body: formData, mode: 'cors' });

                 if (!response.ok) {
                     let errorMsg = `Errore HTTP: ${response.status}`;
                     try { const errorText = await response.text(); errorMsg += ` - ${errorText}`; } catch { /* ignore */ }
                     throw new Error(errorMsg);
                 }

                 const data = await response.json();

                 if (data.result === 'success') {
                     // Reindirizza alle pagine corrette
                     window.location.href = (partecipazioneValue === 'Sì, ci sarò') ? 'grazie.html' : 'dispiaciuti.html';
                 } else {
                     throw new Error(`Errore dallo script Google: ${data.message || JSON.stringify(data)}`);
                 }
             } catch (error) {
                 console.error('Errore invio modulo RSVP:', error);
                 if (loadingOverlay) loadingOverlay.style.display = 'none';
                 if (submitButton) submitButton.disabled = false;
                 alert('Si è verificato un errore durante l\'invio.\nRiprovare o contattare gli sposi.\nDettagli: ' + error.message);
             }
        });

        // Imposta stato iniziale dei campi condizionali al caricamento
        const initialPartecipazione = document.querySelector('input[name="entry.682165499"]:checked');
        handlePartecipazioneChange(initialPartecipazione?.value === 'Sì, ci sarò');
    });
}

// --- Back to Top Button (Globale, se presente) ---
const backToTopBtn = document.getElementById('backToTop'); // Assicurati che l'ID esista in tutte le pagine o nel template
if (backToTopBtn) {
    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;
        if (scrollY > 300) {
             backToTopBtn.classList.add('show');
             backToTopBtn.setAttribute('aria-hidden', 'false');
        } else {
             backToTopBtn.classList.remove('show');
              backToTopBtn.setAttribute('aria-hidden', 'true');
        }
    });
    backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}