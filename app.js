// ==========================================
// 1. تسجيل الـ Service Worker (لتشغيل التطبيق بدون إنترنت)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((reg) => console.log('Service Worker registered successfully', reg))
            .catch((err) => console.log('Service Worker registration failed', err));
    });
}

// ==========================================
// 2. إدارة زر تثبيت التطبيق (Install PWA)
// ==========================================
let deferredPrompt;
const installBtn = document.getElementById('installAppBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    // منع ظهور القائمة الافتراضية للمتصفح مؤقتاً
    e.preventDefault();
    deferredPrompt = e;
    
    // إظهار زر التثبيت الخاص بك في الواجهة إذا كان موجوداً
    if (installBtn) {
        installBtn.classList.remove('hidden');
    }
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            // إظهار نافذة التثبيت للمستخدم
            deferredPrompt.prompt();
            
            // انتظار رد المستخدم (موافقة أو إلغاء)
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('المستخدم وافق على تثبيت التطبيق');
            } else {
                console.log('المستخدم رفض تثبيت التطبيق');
            }
            
            deferredPrompt = null;
            installBtn.classList.add('hidden');
        }
    });
}

// ==========================================
// 3. المنطق الأساسي لتطبيق القصص (عرض وقراءة القصص)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // التأكد من وجود مصفوفة القصص (stories) المستوردة من ملف stories.js
    if (typeof stories !== 'undefined') {
        displayStories(stories);
    } else {
        console.error('لم يتم العثور على ملف القصص stories.js');
    }
});

// دالة عرض القصص في الشاشة الرئيسية
function displayStories(storiesList) {
    const container = document.getElementById('storiesContainer');
    if (!container) return;

    container.innerHTML = '';

    storiesList.forEach((story, index) => {
        const card = document.createElement('div');
        card.className = 'story-card'; // قم بتعديلها لتناسب تصميم الـ CSS الخاص بك
        card.innerHTML = `
            <h3>${story.title}</h3>
            <p>${story.summary || story.content.substring(0, 100)}...</p>
            <button onclick="openStory(${index})">قراءة القصة</button>
        `;
        container.appendChild(card);
    });
}

// دالة فتح قصة محددة وقراءتها
function openStory(index) {
    const story = stories[index];
    // يمكنك هنا توجيه المستخدم لصفحة القراءة أو عرضها في نافذة منبثقة (Modal)
    localStorage.setItem('currentStory', JSON.stringify(story));
    window.location.href = 'story.html'; // أو استبدل هذا بالكود الخاص بفتح القصة عندك
}
