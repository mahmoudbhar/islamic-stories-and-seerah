let stories = [];
let currentCategory = 'all';
let currentFontScale = 1;

function loadStories() {
    // تغيير اسم مفتاح التخزين للنسخة الجديدة
    const STORAGE_KEY = 'islamic_stories_db_v4'; 
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
        const savedStories = JSON.parse(saved);
        // دمج البيانات الحفظ مع البيانات الأصلية لضمان ظهور أي قصة جديدة
        stories = initialStories.map(story => {
            const found = savedStories.find(s => s.id === story.id);
            return found ? { ...story, isRead: found.isRead, isFavorite: found.isFavorite } : story;
        });
    } else {
        stories = [...initialStories];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    }
}

const storiesGrid = document.getElementById('storiesGrid');
const storyDetail = document.getElementById('storyDetail');
const searchInput = document.getElementById('searchInput');
const categoriesNav = document.getElementById('categoriesNav');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const backBtn = document.getElementById('backBtn');

function renderStories() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    const filtered = stories.filter(story => {
        const matchesCategory = (currentCategory === 'all') || 
                                (currentCategory === 'favorites' && story.isFavorite) || 
                                (story.category === currentCategory);
                                
        const matchesSearch = story.title.toLowerCase().includes(searchTerm) || 
                              story.summary.toLowerCase().includes(searchTerm) || 
                              story.content.toLowerCase().includes(searchTerm);
                              
        return matchesCategory && matchesSearch;
    });

    storiesGrid.innerHTML = '';

    if (filtered.length === 0) {
        storiesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
                <h3>لا توجد قصص مطابقة لمحددات البحث</h3>
            </div>
        `;
        return;
    }

    filtered.forEach(story => {
        const card = document.createElement('div');
        card.className = `story-card ${story.isRead ? 'is-read' : ''}`;
        card.onclick = () => openStory(story.id);

        card.innerHTML = `
            <div class="card-main-content">
                <div class="story-tags">
                    <span class="badge">${story.categoryName}</span>
                    ${story.isRead ? '<span class="read-badge">✓ تمت القراءة</span>' : ''}
                </div>
                <h3 class="story-title-compact">${story.title}</h3>
            </div>
            <div class="card-footer-compact">
                <span>${story.isFavorite ? '⭐ بالمفضلة' : ''}</span>
                <span class="read-more">قراءة القصة ➔</span>
            </div>
        `;
        storiesGrid.appendChild(card);
    });
}

function openStory(id) {
    const story = stories.find(s => s.id === id);
    if (!story) return;

    document.getElementById('detailCategory').textContent = story.categoryName;
    document.getElementById('detailTitle').textContent = story.title;
    document.getElementById('detailContent').textContent = story.content;
    
    const favBtn = document.getElementById('favBtn');
    favBtn.textContent = story.isFavorite ? '⭐ إزالة من المفضلة' : '⭐ إضافة للمفضلة';
    favBtn.onclick = () => toggleFavorite(story.id);

    const readBtn = document.getElementById('readBtn');
    updateReadButtonUI(readBtn, story.isRead);
    readBtn.onclick = () => toggleRead(story.id);

    const ttsBtn = document.getElementById('ttsBtn');
    ttsBtn.onclick = () => speakStory(story.content);

    const copyBtn = document.getElementById('copyBtn');
    copyBtn.onclick = () => copyText(story.content);

    storiesGrid.classList.add('hidden');
    storyDetail.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateReadButtonUI(btn, isRead) {
    if (isRead) {
        btn.textContent = '✓ تمت القراءة (إلغاء)';
        btn.classList.add('is-read');
    } else {
        btn.textContent = '✅ تعليم كـ مقروء';
        btn.classList.remove('is-read');
    }
}

function toggleRead(id) {
    const story = stories.find(s => s.id === id);
    if (story) {
        story.isRead = !story.isRead;
        localStorage.setItem('islamic_stories_db_v3', JSON.stringify(stories));
        
        const readBtn = document.getElementById('readBtn');
        updateReadButtonUI(readBtn, story.isRead);
        renderStories();
    }
}

backBtn.onclick = () => {
    stopSpeech();
    storyDetail.classList.add('hidden');
    storiesGrid.classList.remove('hidden');
};

function toggleFavorite(id) {
    const story = stories.find(s => s.id === id);
    if (story) {
        story.isFavorite = !story.isFavorite;
        localStorage.setItem('islamic_stories_db_v3', JSON.stringify(stories));
        const favBtn = document.getElementById('favBtn');
        favBtn.textContent = story.isFavorite ? '⭐ إزالة من المفضلة' : '⭐ إضافة للمفضلة';
        renderStories();
    }
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast');
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 2000);
    });
}

let synth = window.speechSynthesis;
function speakStory(text) {
    if (!synth) {
        alert('خاصية القراءة الصوتية غير مدعومة في متصفحك.');
        return;
    }
    if (synth.speaking) {
        synth.cancel();
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.88;
    synth.speak(utterance);
}

function stopSpeech() {
    if (synth && synth.speaking) {
        synth.cancel();
    }
}

categoriesNav.addEventListener('click', (e) => {
    if (e.target.classList.contains('cat-btn')) {
        document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.dataset.category;
        renderStories();
    }
});

searchInput.addEventListener('input', renderStories);

themeToggleBtn.onclick = () => {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        themeToggleBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
};

document.getElementById('increaseFont').onclick = () => {
    if (currentFontScale < 1.6) {
        currentFontScale += 0.1;
        document.getElementById('detailContent').style.fontSize = `${1.35 * currentFontScale}rem`;
    }
};

document.getElementById('decreaseFont').onclick = () => {
    if (currentFontScale > 0.8) {
        currentFontScale -= 0.1;
        document.getElementById('detailContent').style.fontSize = `${1.35 * currentFontScale}rem`;
    }
};

window.onload = () => {
    loadStories();
    renderStories();

    if (localStorage.getItem('theme') === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    }
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service Worker registered!', reg))
      .catch((err) => console.log('Service Worker registration failed:', err));
  });
}
