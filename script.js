/* ==========================================================================
   JAVASCRIPT UNDANGAN DIGITAL ISLAMI PREMIUM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER HILANG SETELAH LOADING SELESAI ---
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader-wrapper');
        if (loader) {
            // Beri jeda sedikit agar transisi terasa halus
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
            }, 800);
        }
    });

    // --- 2. EKSTRAKSI PARAMETER NAMA TAMU (?to=Nama+Tamu) ---
    const getQueryParam = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    const guestName = getQueryParam('to');
    const guestNameElement = document.getElementById('guest-name');
    
    // Judul default jika nama tamu tidak didefinisikan dalam URL
    const defaultGuestName = "Tamu Undangan";
    
    if (guestNameElement) {
        if (guestName) {
            // Ganti karakter '+' atau '%20' dengan spasi secara otomatis
            guestNameElement.textContent = decodeURIComponent(guestName);
        } else {
            guestNameElement.textContent = defaultGuestName;
        }
    }

    // --- 3. LOGIKA BUTTON BUKA UNDANGAN ---
    const btnOpenInvitation = document.getElementById('btn-open-invitation');
    const coverOverlay = document.getElementById('cover-overlay');
    const mainContent = document.getElementById('main-content');

    if (btnOpenInvitation && coverOverlay && mainContent) {
        btnOpenInvitation.addEventListener('click', () => {
            // Hilangkan scrollbars sementara cover tertutup (jika ada)
            document.body.style.overflow = 'auto';

            // Menampilkan main content sebelum menggeser cover agar transisi berjalan mulus
            mainContent.classList.add('show-content');
            coverOverlay.classList.add('slide-up');

            // Memicu trigger animasi scroll pertama kali saat halaman terbuka
            triggerScrollAnimations();
        });
    }

    // --- 5. COUNTDOWN TIMER MENUJU 12 JULI 2026 PUKUL 08:00 WIB ---
    // Format tanggal target dalam format ISO dengan timezone Indonesia (GMT+0700)
    const targetDate = new Date('2026-07-12T08:00:00+07:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            // Jika waktu sudah lewat
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            
            const countdownTitle = document.querySelector('.countdown-title');
            if (countdownTitle) {
                countdownTitle.textContent = "Acara Sedang Berlangsung / Telah Selesai";
            }
            clearInterval(countdownInterval);
            return;
        }

        // Penghitungan hari, jam, menit, detik
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Menampilkan angka dengan padding nol di depan jika angka < 10
        document.getElementById('days').textContent = days < 10 ? '0' + days : days;
        document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
    };

    // Jalankan sekali saat load, lalu jalankan interval setiap 1 detik
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // --- 6. DINAMIS KONFIRMASI WA (RSVP) DENGAN PRE-FILLED TEXT ---
    const btnWaRsvp = document.getElementById('btn-wa-rsvp');
    if (btnWaRsvp) {
        const phone = "6281213905932"; // Nomor WA Panitia (format internasional tanpa '+')
        const currentGuest = guestName ? decodeURIComponent(guestName) : defaultGuestName;
        
        // Membuat pesan teks WhatsApp terformat rapi
        const messageText = `Assalamualaikum Wr. Wb.

Saya *${currentGuest}*, ingin mengonfirmasi kehadiran saya pada acara Imtihan Akhirussanah di Pondok Pesantren Al-Istighotsah Assalafi Setu Bekasi.

Insya Allah, saya *akan hadir* dalam acara tersebut. 

Terima kasih.
Wassalamualaikum Wr. Wb.`;

        // Encode pesan ke URI component agar aman dikirim lewat tautan url
        const encodedMessage = encodeURIComponent(messageText);
        btnWaRsvp.href = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
    }

    // --- 7. ANIMASI SAAT SCROLL (SCROLL TRIGGERS) ---
    // Menggunakan Intersection Observer API untuk performa yang optimal
    const animElements = document.querySelectorAll('.scroll-animate');

    const triggerScrollAnimations = () => {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null, // menggunakan viewport browser
                rootMargin: '0px',
                threshold: 0.15 // terpicu jika 15% bagian elemen sudah terlihat di viewport
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        // Berhenti mengamati jika sudah dianimasikan sekali
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            animElements.forEach(el => observer.observe(el));
        } else {
            // Fallback jika browser sangat lama dan tidak mendukung IntersectionObserver
            const scrollHandler = () => {
                animElements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
                    if (rect.top <= viewHeight * 0.85) {
                        el.classList.add('animated');
                    }
                });
            };
            window.addEventListener('scroll', scrollHandler);
            scrollHandler(); // Pemicu pertama
        }
    };

    // --- 8. SCROLL PROGRESS BAR ---
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });

    // --- 9. GENERATOR LINK UNDANGAN UNTUK PANITIA ---
    const btnGenerate = document.getElementById('btn-generate-link');
    const inputGuest = document.getElementById('input-guest-name');
    const generatedArea = document.getElementById('generated-link-area');
    const outputLink = document.getElementById('output-link-text');
    const btnCopy = document.getElementById('btn-copy-link');
    const copySuccess = document.getElementById('copy-success');

    if (btnGenerate && inputGuest && generatedArea && outputLink) {
        btnGenerate.addEventListener('click', () => {
            const guestValue = inputGuest.value.trim();
            if (guestValue === "") {
                inputGuest.focus();
                return;
            }

            // Dapatkan URL saat ini tanpa query parameters
            let currentUrl = window.location.origin + window.location.pathname;
            
            // Fallback jika dibuka via local file protocol (file:///)
            if (window.location.protocol === 'file:') {
                currentUrl = 'https://undangan-istighotsah.tiiny.site/'; // Contoh domain placeholder
            }

            // Encode nama tamu untuk query parameter
            const encodedName = encodeURIComponent(guestValue);
            const finalLink = `${currentUrl}?to=${encodedName}`;

            outputLink.textContent = finalLink;
            generatedArea.classList.remove('hidden-element');
            
            // Sembunyikan pesan sukses salin jika sebelumnya sudah tampil
            if (copySuccess) {
                copySuccess.style.display = 'none';
                copySuccess.classList.remove('id-hide');
            }
        });
    }

    if (btnCopy && outputLink && copySuccess) {
        btnCopy.addEventListener('click', () => {
            const linkText = outputLink.textContent;
            navigator.clipboard.writeText(linkText).then(() => {
                copySuccess.style.display = 'flex';
                setTimeout(() => {
                    copySuccess.style.display = 'none';
                }, 3000);
            }).catch(err => {
                console.error("Gagal menyalin tautan: ", err);
            });
        });
    }
});

