document.addEventListener("DOMContentLoaded", () => {

    // 1. SETUP EFEK SUARA (SFX)
    // ==========================================
    const sfxCamera = new Audio('Assets/Music/Polaroid.mp3');
    const sfxTypewriter = new Audio('Assets/Music/Typing.mp3');
    const sfxConfetti = new Audio('Assets/Music/Confetti.mp3');
    
    // Buat suara mesin tik berulang (looping) selama masih ngetik
    sfxTypewriter.loop = true;
    
    // 1. SISTEM BUKET BUNGA INTERAKTIF (SEPERTI VIDEO)
    const flowerContainer = document.getElementById("flower-container");
    
    // 💡 TIPS: Siapkan 3-5 gambar bunga tanpa background (PNG) agar buketnya bervariasi!
    const flowerImages = [
        'Assets/Images/Flower1.png', 
        'Assets/Images/Flower2.png',
        'Assets/Images/Flower3.png',
        'Assets/Images/Flower4.png',
        'Assets/Images/Flower5.png',
        'Assets/Images/Flower6.png',
        // 'Assets/images/bunga3.png' // Hapus tanda // di depan jika punya gambar ke-3
    ]; 
    
    let lastX = 0, lastY = 0;
    const maxFlowers = 200; // Maksimal bunga di layar agar HP tidak lag

    function createFlower(x, y) {
        // Beri jarak mekar antar bunga agar tidak menumpuk di 1 titik
        const dist = Math.hypot(x - lastX, y - lastY);
        if (dist < 40) return; 

        let flower = document.createElement("div");
        flower.className = "flower-bloom";
        
        // Pilih gambar acak
        let randomImg = flowerImages[Math.floor(Math.random() * flowerImages.length)];
        flower.style.backgroundImage = `url('${randomImg}')`;
        
        // Ukuran acak (50px sampai 130px)
        let size = (Math.random() * 80 + 50) + "px";
        flower.style.width = size;
        flower.style.height = size;
        
        // Rotasi acak agar terlihat natural
        let rot = Math.random() * 360;
        flower.style.setProperty('--rot', rot + 'deg');
        
        // Muncul di titik kursor/jari
        flower.style.left = x + "px";
        flower.style.top = y + "px";
        
        flowerContainer.appendChild(flower);
        
        // Hapus bunga paling lama jika sudah memenuhi batas maksimal
        if (flowerContainer.children.length > maxFlowers) {
            flowerContainer.removeChild(flowerContainer.firstElementChild);
        }
        
        lastX = x; lastY = y;
    }

    // Mekar saat kursor mouse digerakkan (Untuk Laptop)
    document.addEventListener("mousemove", (e) => {
        createFlower(e.clientX, e.clientY);
    });

    // Mekar saat layar disentuh & digeser (Untuk HP)
    document.addEventListener("touchmove", (e) => {
        createFlower(e.touches[0].clientX, e.touches[0].clientY);
    });

    // Munculkan beberapa bunga otomatis di awal agar tidak kosong
    for(let i = 0; i < 15; i++) {
        setTimeout(() => {
            createFlower(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
            lastX = 0; lastY = 0; // Reset koordinat
        }, i * 150);
    }

    // Variabel Dokumen Utama
    const gatekeeper = document.getElementById("gatekeeper");
    const mainContent = document.getElementById("main-content");
    const bgMusic = document.getElementById("bg-music");
    const unlockBtn = document.getElementById("unlock-btn");
    const secretInput = document.getElementById("secret-input");

    // 1. Setelah 3 detik, hilangkan teks sapaan dan munculkan instruksi usap layar
    setTimeout(() => {
        document.getElementById("opening-text").classList.add("hidden");
        document.getElementById("instruction-text").classList.remove("hidden");
    }, 3000);

    // 2. Berikan waktu 6 detik (total di detik ke-9) untuk bermain bunga, lalu munculkan form password
    setTimeout(() => {
        document.getElementById("instruction-text").classList.add("hidden");
        document.getElementById("unlock-form").classList.remove("hidden");
    }, 9000);

    // 2. Sistem Unlock
    unlockBtn.addEventListener("click", () => {
        if (secretInput.value === CONFIG.unlock.answer) {
            gatekeeper.classList.add("hidden");
            mainContent.classList.remove("hidden");
            flowerContainer.classList.add("hidden"); // Bunga hilang saat masuk menu utama

            bgMusic.src = CONFIG.music.src;
            bgMusic.play();
            
            siapkanMenuOpsi();
        } else {
            document.getElementById("error-msg").innerText = CONFIG.unlock.errorMsg;
        }
    });

    // 3. Sistem Menu & Polaroid
    function siapkanMenuOpsi() {
        
        // Merakit Galeri Polaroid beserta caption
        const galleryContainer = document.getElementById("gallery-container");
        CONFIG.gallery.forEach(foto => {
            const polaroidCard = document.createElement("div");
            polaroidCard.className = "polaroid";
            
            const img = document.createElement("img");
            img.src = foto.src;
            img.alt = foto.alt;
            
            const caption = document.createElement("p");
            caption.innerText = foto.alt; // Teks diambil dari bagian alt di config.js
            
            polaroidCard.appendChild(img);
            polaroidCard.appendChild(caption);
            galleryContainer.appendChild(polaroidCard);

            polaroidCard.addEventListener("click", () => {
                sfxCamera.currentTime = 0; 
                sfxCamera.play();
            });
        });

        // Navigasi Antar Tab (Opsi)
        const sections = document.querySelectorAll('.content-section');
        const typeWriterElement = document.getElementById("typewriter-text");
        let isTyping = false;
        let micActive = false;

        function sembunyikanSemua() {
            sections.forEach(sec => sec.classList.add('hidden'));
        }

        // Klik Menu 1: Galeri
        document.getElementById("btn-gallery").addEventListener("click", () => {
            sembunyikanSemua();
            document.getElementById("gallery-section").classList.remove("hidden");
        });

        // Klik Menu 2: Surat Cinta
        document.getElementById("btn-letter").addEventListener("click", () => {
            sembunyikanSemua();
            document.getElementById("letter-section").classList.remove("hidden");
            
            if (!isTyping) {
                isTyping = true;
                typeWriterElement.innerHTML = "";
                let i = 0;
                const text = CONFIG.loveLetter;
                sfxTypewriter.play();
                const typing = setInterval(() => {
                    if (i < text.length) {
                        typeWriterElement.innerHTML += text.charAt(i);
                        i++;
                    } 
                        else {
                        clearInterval(typing);
                        sfxTypewriter.pause(); 
                        sfxTypewriter.currentTime = 0;
                    }
                }, 40); // Kececepatan ketikan
            }
        });

        // Klik Menu 3: Kue
        document.getElementById("btn-cake").addEventListener("click", () => {
            sembunyikanSemua();
            document.getElementById("cake-section").classList.remove("hidden");
            if(!micActive) tiupLilin(); 
        });

        // 4. Sistem Deteksi Suara (Tiup Lilin)
        function tiupLilin() {
            micActive = true;
            navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const microphone = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                microphone.connect(analyser);
                analyser.fftSize = 256;
                const dataArray = new Uint8Array(analyser.frequencyBinCount);

                function checkAudio() {
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for(let i = 0; i < dataArray.length; i++) sum += dataArray[i];
                    
                    if (sum / dataArray.length > 40) { 
                        document.getElementById("flame").classList.add("out");
                        sfxConfetti.play(); 
                        if(typeof confetti === "function"){
                            confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
                        }
                    } else {
                        requestAnimationFrame(checkAudio);
                    }
                }
                checkAudio();
            })
            .catch(err => console.log("Mic error: " + err));
        }
    }
});