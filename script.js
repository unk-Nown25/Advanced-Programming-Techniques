/**
 * تطبيق اختبارات تقنيات برمجية متقدمة
 * تحت إشراف أسرة الدفعة 30 (FFB 30)
 */

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedLecture = "";

// عناصر واجهة المستخدم
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const questionCountText = document.getElementById('question-count');
const lectureTitleText = document.getElementById('lecture-title');

const scoreText = document.getElementById('score-text');
const percentageText = document.getElementById('percentage-text');
const resultMessage = document.getElementById('result-message');

/**
 * بدء الاختبار بناءً على المحاضرة المختارة
 * @param {string} lectureId معرف المحاضرة (مثل lec1, lec2)
 */
async function startQuiz(lectureId) {
    selectedLecture = lectureId;
    try {
        // تحميل ملف JSON الخاص بالمحاضرة
        const response = await fetch(`./data/${lectureId}.json`);
        if (!response.ok) throw new Error('فشل تحميل الأسئلة');
        
        currentQuestions = await response.json();
        
        // إعادة تعيين حالة الاختبار
        currentQuestionIndex = 0;
        score = 0;
        
        // تحديث عنوان المحاضرة في الواجهة
        const lectureNum = lectureId.replace('lec', '');
        lectureTitleText.innerText = `المحاضرة: ${lectureNum}`;
        
        // الانتقال لشاشة الاختبار
        showScreen(quizScreen);
        showQuestion();
    } catch (error) {
        console.error(error);
        alert("عذراً، لم يتم رفع أسئلة هذه المحاضرة بعد. سيتم إضافتها قريباً!");
    }
}

/**
 * عرض السؤال الحالي
 */
function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    questionText.innerText = question.question;
    
    // تحديث عداد الأسئلة وشريط التقدم
    questionCountText.innerText = `سؤال ${currentQuestionIndex + 1} من ${currentQuestions.length}`;
    const progressPercent = (currentQuestionIndex / currentQuestions.length) * 100;
    progress.style.width = `${progressPercent}%`;

    // تنظيف الحاوية وإخفاء زر التالي
    answersContainer.innerHTML = '';
    nextBtn.style.display = 'none';

    // إنشاء أزرار الخيارات
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('answer-btn');
        button.onclick = () => selectAnswer(index, question.answer);
        answersContainer.appendChild(button);
    });
}

/**
 * معالجة اختيار الإجابة
 */
function selectAnswer(selectedIndex, correctIndex) {
    const buttons = answersContainer.querySelectorAll('.answer-btn');
    
    // تعطيل الأزرار وإظهار الإجابة الصحيحة/الخاطئة
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === selectedIndex) {
            btn.classList.add('incorrect');
        }
    });

    // زيادة النتيجة إذا كانت الإجابة صحيحة
    if (selectedIndex === correctIndex) {
        score++;
    }

    // إظهار زر التالي أو إنهاء الاختبار
    nextBtn.style.display = 'block';
    if (currentQuestionIndex === currentQuestions.length - 1) {
        nextBtn.innerText = 'عرض النتيجة النهائية';
    } else {
        nextBtn.innerText = 'السؤال التالي';
    }
}

/**
 * الانتقال للسؤال التالي أو عرض النتائج
 */
nextBtn.onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
};

/**
 * عرض شاشة النتائج
 */
function showResults() {
    // تحديث شريط التقدم للنهاية
    progress.style.width = `100%`;
    
    showScreen(resultScreen);
    scoreText.innerText = `${score} / ${currentQuestions.length}`;
    
    const percentage = Math.round((score / currentQuestions.length) * 100);
    percentageText.innerText = `نسبة النجاح: ${percentage}%`;

    // رسائل مخصصة حسب النتيجة
    if (percentage >= 85) {
        resultMessage.innerText = "أداء استثنائي! أنت متميز جداً.";
    } else if (percentage >= 65) {
        resultMessage.innerText = "عمل جيد جداً، استمر في المراجعة.";
    } else if (percentage >= 50) {
        resultMessage.innerText = "نتيجة جيدة، يمكنك التحسن أكثر.";
    } else {
        resultMessage.innerText = "تحتاج لمراجعة هذه المحاضرة بتركيز أكبر.";
    }
}

/**
 * تبديل الشاشات
 */
function showScreen(screen) {
    [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}
