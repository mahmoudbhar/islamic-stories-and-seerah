// ==========================================
// الكود الأساسي لتطبيق القصص
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // يمكنك وضع تهيئة التطبيق العامة هنا
    console.log("تم تحميل التطبيق بنجاح.");
});

// ==========================================
// تفعيل خاصية القراءة الصوتية (Text-to-Speech)
// ==========================================

const synth = window.speechSynthesis;
let isSpeaking = false;

const ttsBtn = document.getElementById('ttsBtn');

if (ttsBtn) {
    ttsBtn.addEventListener('click', () => {
        const titleElement = document.getElementById('detailTitle');
        const contentElement = document.getElementById('detailContent');

        // التأكد من وجود عناصر العنوان والمحتوى في الصفحة
        if (!titleElement || !contentElement) {
            console.warn("عناصر القصة غير موجودة في هذه الصفحة.");
            return;
        }

        const title = titleElement.innerText;
        const content = contentElement.innerText;
        const textToSpeech = `${title}. ${content}`;

        if (!synth) {
            alert('متصفحك لا يدعم خاصية القراءة الصوتية.');
            return;
        }

        // إذا كان المتصفح يقرأ حالياً، قم بإيقاف القراءة عند الضغط مرة أخرى
        if (synth.speaking) {
            synth.cancel();
            ttsBtn.innerText = '🔊 استمع للقصة';
            isSpeaking = false;
            return;
        }

        if (textToSpeech.trim() !== '') {
            const utterThis = new SpeechSynthesisUtterance(textToSpeech);
            utterThis.lang = 'ar-SA'; // تحديد اللغة العربية (يمكن تغييرها إلى ar-EG أو ar المعممة حسب الرغبة)
            utterThis.rate = 1.0;     // ضبط سرعة القراءة (1.0 هي السرعة الطبيعية)
            utterThis.pitch = 1.0;    // ضبط طبقة الصوت

            // عند بدء التشغيل
            utterThis.onstart = () => {
                isSpeaking = true;
                ttsBtn.innerText = '⏹️ إيقاف القراءة';
            };

            // عند انتهاء القراءة بشكل طبيعي
            utterThis.onend = () => {
                isSpeaking = false;
                ttsBtn.innerText = '🔊 استمع للقصة';
            };

            // عند حدوث خطأ أثناء القراءة
            utterThis.onerror = (event) => {
                console.error('حدث خطأ في خدمة القراءة الصوتية:', event);
                isSpeaking = false;
                ttsBtn.innerText = '🔊 استمع للقصة';
            };

            // بدء عملية القراءة
            synth.speak(utterThis);
        }
    });
}
