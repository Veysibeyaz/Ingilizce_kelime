let words = [];
let usedIndices = []; // Kullanılan indeksleri saklamak için bir dizi
let currentWordIndex;
let incorrectWords = []; // Hata yapılan kelimeleri saklayacak dizi

// JSON dosyasını yükle
fetch('kelimeler.json')
    .then(response => response.json())
    .then(data => {
        words = data;
        showWord();  // İlk kelimeyi göster
    });

let score = 0;
let stars = 3; // Oyunun başlangıcındaki yıldız sayısı

// İlk kelimeyi göster
showWord();

// Yıldızları göster
updateStars();

function showWord() {
    if (usedIndices.length === words.length) {
        document.getElementById('feedback').textContent = "Tebrikler! Tüm kelimeleri öğrendiniz.";
        return;
    }

    // Kullanılmamış bir rastgele indeks seç
    do {
        currentWordIndex = Math.floor(Math.random() * words.length);
    } while (usedIndices.includes(currentWordIndex));

    usedIndices.push(currentWordIndex); // Kullanılan indeksi kaydet

    const wordElement = document.getElementById('word');
    wordElement.textContent = words[currentWordIndex].word;
    
    // Kelimenin otomatik olarak telaffuz edilmesi
    speakWord(); 
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim().toLowerCase(); // Kullanıcının cevabını küçük harfe dönüştür
    const correctAnswers = words[currentWordIndex].meaning.toLowerCase().split(','); // Doğru cevapları küçük harfe dönüştür ve diziye ayır
    const feedbackElement = document.getElementById('feedback');

    // Kullanıcının cevabını her bir doğru cevap ile karşılaştır
    const isCorrect = correctAnswers.some(answer => userAnswer === answer.trim());

    if (isCorrect) {
        feedbackElement.textContent = "Doğru!";
        feedbackElement.style.color = "green";
        score++;
        document.getElementById('score').textContent = score;
    } else {
        feedbackElement.textContent = `Yanlış, doğru cevaplar: ${words[currentWordIndex].meaning}`;
        feedbackElement.style.color = "red";
        decreaseStars();
        incorrectWords.push(words[currentWordIndex]);
    }

    // Yeni bir kelime göster
    showWord();

    document.getElementById('answer').value = ''; // Cevap alanını temizle
}

function updateStars() {
    const starsElement = document.getElementById('stars');
    starsElement.innerHTML = ''; // Mevcut yıldızları temizle

    for (let i = 0; i < stars; i++) {
        const star = document.createElement('i');
        star.classList.add('fas', 'fa-star');
        starsElement.appendChild(star);
    }
}

function decreaseStars() {
    if (stars > 0) {
        stars--;
        updateStars();

        if (stars === 0) {
            showMotivationalPopup();
        }
    }
}

function showMotivationalPopup() {
    const motivationalMessages = [
        "Harika iş çıkardın! Biraz daha çaba ve başarı senin olacak!",
        "Başarıya bir adım daha yaklaştın! Devam et!",
        "Öğrenme yolculuğun harika gidiyor! Hadi tekrar başlayalım!",
        "Azimle çalışmaya devam et, ödülünü alacaksın!",
        "Her adım seni hedeflerine daha da yaklaştırıyor!",
        "İnanılmaz bir ilerleme kaydettin, devam et!",
        "Zorluklar seni daha güçlü yapar. Devam et!",
        "Başarıya giden yolda ilerliyorsun, durma!",
        "Hedeflerin seni bekliyor, vazgeçme!",
        "Küçük adımlar büyük başarılara götürür!",
        "Çalışmalarının karşılığını alacaksın, sabırlı ol!",
        "Bugün dünden daha iyisin, harika bir iş çıkardın!",
        "Başarı sabır ve azim gerektirir, yoluna devam et!",
        "Başarıya giden yol, denemekten geçer. Devam et!",
        "Kendine inan, harika şeyler başaracaksın!",
        "Bugün bir adım daha attın, hedefin çok yakın!",
        "Her çaban seni başarıya daha da yaklaştırıyor!",
        "Azimle çalışan, hayallerine ulaşır!",
        "Yapabileceğine inandığında, her şey mümkündür!",
        "Sadece vazgeçmediğin sürece, başarı kaçınılmazdır!"
    ];
    
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = '#fff';
    popup.style.padding = '20px';
    popup.style.border = '1px solid #ccc';
    popup.style.borderRadius = '10px';
    popup.style.textAlign = 'center';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

    const messageElement = document.createElement('p');
    messageElement.textContent = randomMessage;
    messageElement.id = 'motivational-message';  // Bu elemente bir id atadık

    const button = document.createElement('button');
    button.textContent = "Tekrar Dene!";
    button.style.marginTop = '20px';
    button.style.padding = '10px 20px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#fff';
    button.style.cursor = 'pointer';

    button.addEventListener('click', () => {
        document.body.removeChild(popup);
        stars = 3;
        updateStars();
    });

    popup.appendChild(messageElement);
    popup.appendChild(button);

    document.body.appendChild(popup);

    // Karanlık modu kontrol et ve mesaj rengini güncelle
    if (document.body.classList.contains('dark-mode')) {
        popup.style.backgroundColor = '#333';  // Arka plan rengini de karanlık modda değiştiriyoruz
        messageElement.style.color = '#fff';  // Karanlık modda yazı rengi beyaz olsun
    }
}

function speakWord() {
    const word = document.getElementById('word').textContent;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US'; // İngilizce telaffuz için dil ayarı
    speechSynthesis.speak(utterance);
}

document.getElementById('answer').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        checkAnswer(); // Enter'a basıldığında cevabı kontrol et
    }
});

document.getElementById('check-answer').addEventListener('click', checkAnswer);

document.getElementById('speak-word').addEventListener('click', speakWord);

// Dark mode toggle işlemi
const checkbox = document.getElementById("checkbox");
checkbox.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

function reviewIncorrectWords() {
    if (incorrectWords.length === 0) {
        alert("Henüz hata yaptığınız bir kelime yok!");
        return;
    }

    words = incorrectWords.slice(); // Tüm kelimeleri hata yapılan kelimelerle değiştir
    usedIndices = []; // Kullanılan indeksleri sıfırlayın
    showWord(); // Hemen ilk kelimeyi göster
}

document.getElementById('review-incorrect').addEventListener('click', reviewIncorrectWords);
