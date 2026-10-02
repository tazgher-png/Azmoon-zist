alert("1️⃣ script.js شروع شد");





alert("2️⃣ از loadQuestions عبور کردیم");
// بانک سؤال آنلاین

window.testTeacherFunction = function () {
    alert("🟢 تابع تست از script.js اجرا شد");
};


const SUPABASE_URL =
"https://taeqejwbmzdlskhjdlzh.supabase.co";


const SUPABASE_KEY = "sb_publishable_Th5iRUk-4PdiFcF5zlj05A_3h-eWmcm";



console.log(SUPABASE_URL);
console.log(SUPABASE_KEY.length);



const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);






async function loadQuestionsFromSupabase() {

    try {

        const { data, error } =
            await supabaseClient
                .from("questions")
                .select(
                    "id, type, grade, chapter, question, options, answer"
                )
                .order("id", { ascending: true });


        console.log(
            "نتایج دریافتی از Supabase:",
            data
        );


        if (error) {

            console.error(
                "خطا در دریافت سؤال‌ها:",
                error
            );

            alert(
                "❌ خطا در دریافت سؤال‌ها:\n" +
                error.message
            );

            return;
        }


        if (!data || data.length === 0) {

            alert(
                "⚠️ هیچ سؤالی در دیتابیس پیدا نشد."
            );

            return;
        }


        questions =
            data.map(function(q) {

                return {

                    id:
                        q.id,

                    type:
                        q.type || "mcq",

                    grade:
                        q.grade,

                    chapter:
                        q.chapter,

                    question:
                        q.question,

                    options:
                        q.options || [],

                    answer:
                        q.answer ?? null,

                    userAnswer:
                        null

                };

            });


        console.log(
            "تعداد سؤال‌های آنلاین:",
            questions.length
        );


        console.log(
            "نمونه سؤال:",
            questions[0]
        );


        console.log(
            "پاسخ صحیح سؤال اول:",
            questions[0].answer
        );


        alert(
            "✅ سؤال‌های آنلاین دریافت شد: " +
            questions.length
        );

    }


    catch (error) {

        console.error(
            "خطای JavaScript در دریافت سؤال‌ها:",
            error
        );

        alert(
            "❌ خطای JavaScript:\n" +
            error.message
        );

    }

}




let questionsLoaded = false;








/* =========================
   متغیرهای آزمون
========================= */

let examQuestions = [];

let currentQuestion = 0;

let score = 0;

let studentName = "";

let selectedAnswer = null;

let timeLeft = 120;

let timerInterval;


/* =========================
   شروع آزمون
========================= */

async function startExam() {
    await loadQuestionsFromSupabase();

    const nameInput =
        document.getElementById("student-name");


    const gradeInput =
        document.getElementById("grade");


    const chapterInput =
        document.getElementById("chapter");


    const countInput =
        document.getElementById("question-count");


    const timeInput =
        document.getElementById("exam-time");


    /*
       بررسی می‌کنیم عناصر صفحه وجود داشته باشند
    */

    if (
        !nameInput ||
        !gradeInput ||
        !chapterInput ||
        !countInput ||
        !timeInput
    ) {

        alert("خطا: عناصر صفحه آزمون پیدا نشدند.");

        return;

    }


    studentName =
        nameInput.value.trim();


    if (studentName === "") {

        alert("لطفاً نام و نام خانوادگی را وارد کنید.");

        return;

    }


    const selectedGrade =
        gradeInput.value;


    const selectedChapter =
        chapterInput.value;


    const questionCount =
        Number(countInput.value);


    timeLeft =
        Number(timeInput.value);


    /*
       فیلتر کردن سؤال‌ها
    */
    
    alert(
    "بررسی questions:\n\n" +
    "تعداد سؤال‌ها: " +
    questions.length +
    "\n\n" +
    "ID سؤال اول: " +
    (questions.length > 0 ? questions[0].id : "هیچ") +
    "\n\n" +
    "نوع سؤال اول: " +
    (questions.length > 0 ? questions[0].type : "هیچ")
);

    let filteredQuestions =
        questions.filter(function(question) {

            const gradeMatch =
                selectedGrade === "همه" ||
                question.grade === selectedGrade;


            const chapterMatch =
                selectedChapter === "همه" ||
                question.chapter === selectedChapter;


            return gradeMatch && chapterMatch;

        });

if (filteredQuestions.length > 0) {

    alert(
        "اولین سؤال:\n\n" +
        "ID = " +
        filteredQuestions[0].id +
        "\n\n" +
        "نوع = " +
        filteredQuestions[0].type +
        "\n\n" +
        "متن = " +
        filteredQuestions[0].question
    );

} else {

    alert(
        "هیچ سؤالی پیدا نشد."
    );

}
    
    
    
    /*
       تصادفی کردن سؤال‌ها
    */

    filteredQuestions.sort(function() {

        return Math.random() - 0.5;

    });


    /*
       انتخاب سؤال‌ها
    */

    examQuestions =
    filteredQuestions
        .slice(0, questionCount)
        .map(function(question) {

            return {

                id: question.id,

                type: question.type,

                grade: question.grade,

                chapter: question.chapter,

                question: question.question,

                options: question.options || [],

                answer: question.answer,

                userAnswer: null

            };

        });

    /*
       اگر هیچ سؤالی پیدا نشد
    */

    if (examQuestions.length === 0) {

        alert(
            "برای پایه و فصل انتخاب‌شده هنوز سؤالی وجود ندارد."
        );

        return;

    }


    /*
       اگر تعداد سؤال کمتر از درخواست باشد
    */

    if (examQuestions.length < questionCount) {

        alert(
            `فقط ${examQuestions.length} سؤال برای این انتخاب وجود دارد.`
        );

    }


    /*
       شروع آزمون
    */

    currentQuestion = 0;

    score = 0;

    selectedAnswer = null;


    document.getElementById("start-screen").style.display =
        "none";


    document.getElementById("quiz-screen").style.display =
        "block";


    showQuestion();

    startTimer();

}


/* =========================
   نمایش سؤال
========================= */


/* =========================
   انتخاب گزینه
========================= */

function selectOption(index, element) {

    selectedAnswer = index;


    const allOptions =
        document.querySelectorAll(".option");


    allOptions.forEach(function(option) {

        option.classList.remove("selected");

    });


    element.classList.add("selected");

}


/* =========================
   سؤال بعدی
========================= */

function nextQuestion() {

    const question =
        examQuestions[currentQuestion];


    // بررسی وجود سؤال
    if (!question) {
        showResult();
        return;
    }


    // بررسی اینکه دانش‌آموز پاسخ داده یا نه
    if (
        selectedAnswer === null ||
        selectedAnswer === ""
    ) {

        alert(
            "⚠️ لطفاً به سؤال پاسخ دهید."
        );

        return;
    }


    // ⭐ ذخیره پاسخ دانش‌آموز
    question.userAnswer =
        selectedAnswer;


    console.log(
        "پاسخ دانش‌آموز:",
        question.userAnswer
    );


    // =====================================
    // بررسی پاسخ صحیح بر اساس نوع سؤال
    // =====================================

    // =====================================
// بررسی پاسخ صحیح
// =====================================

console.log("========== بررسی نمره ==========");
console.log("نوع سؤال:", question.type);
console.log("پاسخ دانش‌آموز:", selectedAnswer);
console.log("پاسخ صحیح:", question.answer);


if (question.type === "mcq") {

    if (
        Number(selectedAnswer) ===
        Number(question.answer)
    ) {
        score++;
        console.log("✅ MCQ درست");
    } else {
        console.log("❌ MCQ غلط");
    }

}


else if (question.type === "truefalse") {

    const studentAnswer =
        String(selectedAnswer).toLowerCase();

    const correctAnswer =
        String(question.answer).toLowerCase();

    if (
        studentAnswer ===
        correctAnswer
    ) {
        score++;
        console.log("✅ صحیح/غلط درست");
    } else {
        console.log("❌ صحیح/غلط غلط");
    }

}


else if (question.type === "fillblank") {

    const studentAnswer =
        String(selectedAnswer)
            .trim()
            .toLowerCase();

    const correctAnswer =
        String(question.answer)
            .trim()
            .toLowerCase();

    if (
        studentAnswer ===
        correctAnswer
    ) {
        score++;
        console.log("✅ جای خالی درست");
    } else {
        console.log("❌ جای خالی غلط");
    }

}


else if (question.type === "shortanswer") {

    const studentAnswer =
        String(selectedAnswer)
            .trim()
            .toLowerCase();

    const correctAnswer =
        String(question.answer)
            .trim()
            .toLowerCase();

    if (
        studentAnswer ===
        correctAnswer
    ) {
        score++;
        console.log("✅ پاسخ کوتاه درست");
    } else {
        console.log("❌ پاسخ کوتاه غلط");
    }

}


else if (question.type === "essay") {

    console.log(
        "📝 سؤال تشریحی؛ نیازمند تصحیح دستی است."
    );

}

    // =====================================
    // رفتن به سؤال بعدی
    // =====================================

    currentQuestion++;


    if (
        currentQuestion <
        examQuestions.length
    ) {

        showQuestion();

    }

    else {

        showResult();

    }

}

window.forgotPassword = async function () {

    const emailInput =
        document.getElementById("teacher-email");

    if (!emailInput) {
        alert("❌ کادر ایمیل پیدا نشد.");
        return;
    }

    const email =
        emailInput.value.trim();

    if (email === "") {
        alert("⚠️ ابتدا ایمیل معلم را وارد کنید.");
        return;
    }

    const resetUrl =
    "http://localhost:45338/storage/emulated/0/biology-exam/reset-password.html";

console.log("RESET URL =", resetUrl);

    console.log(
        "آدرس بازیابی رمز:",
        resetUrl
    );

    const { error } =
        await supabaseClient.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: resetUrl
            }
        );

    if (error) {

        console.error(
            "خطای کامل Supabase:",
            error
        );

        alert(
            "❌ خطای Supabase:\n\n" +
            "پیام: " +
            error.message +
            "\n\nکد: " +
            (error.code || "-")
        );

        return;
    }

    alert(
        "✅ لینک بازیابی رمز عبور ارسال شد.\n" +
        "ایمیل خود را بررسی کنید."
    );
};

function showQuestion() {

    const question =
        examQuestions[currentQuestion];


    if (!question) {

        showResult();

        return;

    }


    const progress =
        ((currentQuestion + 1) /
        examQuestions.length) * 100;


    document.getElementById("progress-bar").style.width =
        progress + "%";


    document.getElementById("question-number").textContent =
        `سؤال ${currentQuestion + 1} از ${examQuestions.length}`;


    document.getElementById("question").textContent =
        question.question;


    const optionsContainer =
        document.getElementById("options");


    optionsContainer.innerHTML = "";


    selectedAnswer = null;

    
    // ==========================================
    // سؤال چهارگزینه‌ای
    // ==========================================

    if (question.type === "mcq") {

        question.options.forEach(function(option, index) {

            const optionElement =
                document.createElement("div");


            optionElement.className =
                "option";


            optionElement.textContent =
                option;


            optionElement.onclick =
                function() {

                    selectOption(
                        index,
                        optionElement
                    );

                };


            optionsContainer.appendChild(
                optionElement
            );

        });

    }



    // ==========================================
    // سؤال صحیح / غلط
    // ==========================================

    else if (question.type === "truefalse") {

        const trueButton =
            document.createElement("button");


        trueButton.textContent =
            "✅ صحیح";


        trueButton.className =
            "option";


        trueButton.onclick =
            function() {

                selectOption(
                    true,
                    trueButton
                );

            };


        const falseButton =
            document.createElement("button");


        falseButton.textContent =
            "❌ غلط";


        falseButton.className =
            "option";


        falseButton.onclick =
            function() {

                selectOption(
                    false,
                    falseButton
                );

            };


        optionsContainer.appendChild(
            trueButton
        );


        optionsContainer.appendChild(
            falseButton
        );

    }



    // ==========================================
    // سؤال جای خالی
    // ==========================================

    else if (question.type === "fillblank") {

        const input =
            document.createElement("input");


        input.type =
            "text";


        input.id =
            "text-answer";


        input.placeholder =
            "پاسخ خود را وارد کنید";


        input.className =
            "text-answer";


        input.oninput =
            function() {

                selectedAnswer =
                    input.value;

            };


        optionsContainer.appendChild(
            input
        );

    }



    // ==========================================
    // سؤال کوتاه پاسخ
    // ==========================================

    else if (question.type === "shortanswer") {

        const input =
            document.createElement("textarea");


        input.id =
            "text-answer";


        input.placeholder =
            "پاسخ کوتاه خود را وارد کنید";


        input.className =
            "text-answer";


        input.rows =
            4;


        input.oninput =
            function() {

                selectedAnswer =
                    input.value;

            };


        optionsContainer.appendChild(
            input
        );

    }



    // ==========================================
    // سؤال تشریحی
    // ==========================================

    else if (question.type === "essay") {

        const textarea =
            document.createElement("textarea");


        textarea.id =
            "text-answer";


        textarea.placeholder =
            "پاسخ تشریحی خود را بنویسید";


        textarea.className =
            "essay-answer";


        textarea.rows =
            8;


        textarea.oninput =
            function() {

                selectedAnswer =
                    textarea.value;

            };


        optionsContainer.appendChild(
            textarea
        );

    }

}

/* =========================
   تایمر
========================= */

function startTimer() {

    clearInterval(timerInterval);


    updateTimer();


    timerInterval =
        setInterval(function() {

            timeLeft--;

            updateTimer();


            if (timeLeft <= 0) {

                clearInterval(timerInterval);

                showResult();

            }

        }, 1000);

}


/* =========================
   نمایش زمان
========================= */

function updateTimer() {

    const timerElement =
        document.getElementById("timer");


    if (!timerElement) {

        return;

    }


    const minutes =
        Math.floor(timeLeft / 60);


    const seconds =
        timeLeft % 60;


    const formattedSeconds =
        seconds
        .toString()
        .padStart(2, "0");


    timerElement.textContent =
        `⏱️ ${minutes}:${formattedSeconds}`;

}


/* =========================
   نمایش نتیجه
========================= */

async function saveExamResult(result) {

    const { data, error } =
        await supabaseClient
        .from("exam_results")
        .insert([{

            student_name:
                result.studentName,

            score:
                result.score,

            total_questions:
                result.totalQuestions,

            correct_answers:
                result.correctAnswers,

            wrong_answers:
                result.wrongAnswers,

            date:
                result.date,

            answers:
                result.answers

        }]);


    if (error) {

        console.error(
            "خطا در ذخیره نتیجه:",
            error
        );

        alert(
            "❌ خطا در ذخیره نتیجه:\n" +
            error.message
        );

        return;

    }


    console.log(
        "✅ نتیجه و پاسخ‌های دانش‌آموز در Supabase ذخیره شد:",
        data
    );

}

function showResult() {
    clearInterval(timerInterval);

    const totalQuestions = examQuestions.length;
    const wrongAnswers = totalQuestions - score;

    // اطلاعات نتیجه
    
    const result = {
    id: Date.now(),

    studentName: studentName,

    score: score,

    totalQuestions: totalQuestions,

    correctAnswers: score,

    wrongAnswers: wrongAnswers,

    date: new Date().toLocaleString("fa-IR"),

    // پاسخ‌های دانش‌آموز
    answers:
    examQuestions.map(
        function(question) {

            return {

                questionId:
                    question.id,

                question:
                    question.question,

                type:
                    question.type,

                options:
                    question.options ?? [],

                userAnswer:
                    question.userAnswer ?? null,

                correctAnswer:
                    question.answer ?? null

            };
        }
        )
    };
    
           
        
        
saveExamResult(result);
    // دریافت نتایج قبلی
    

    // نمایش نتیجه
    const quizScreen = document.getElementById("quiz-screen");
    const resultScreen = document.getElementById("result-screen");

    if (quizScreen) {
        quizScreen.style.display = "none";
    }

    if (resultScreen) {
        resultScreen.style.display = "block";
    }

    const resultName = document.getElementById("result-name");
    const resultScore = document.getElementById("result-score");

    if (resultName) {
        resultName.textContent =
            `دانش‌آموز: ${studentName}`;
    }

    if (resultScore) {
        resultScore.textContent =
            `نمره شما: ${score} از ${totalQuestions}`;
    }

    console.log("نتیجه ذخیره شد:", result);
}
/* =========================
   شروع دوباره
========================= */

function restartExam() {

    clearInterval(timerInterval);


  currentQuestion = 0;

    score = 0;

    selectedAnswer = null;


    document.getElementById("result-screen").style.display =
        "none";


    document.getElementById("start-screen").style.display =
        "block";


    document.getElementById("student-name").value =
        "";

}


/* ==================================================
   پنل معلم
================================================== */


/* رمز پنل معلم */

const teacherPassword =
    "1234";

/* ورود معلم */


async function teacherLogin() {

    const emailInput =
        document.getElementById("teacher-email");

    const passwordInput =
        document.getElementById("teacher-password");

    const loginBox =
        document.getElementById("login-box");

    const teacherPanel =
        document.getElementById("teacher-panel");


    if (!emailInput) {
        alert("❌ کادر ایمیل پیدا نشد.");
        return;
    }

    if (!passwordInput) {
        alert("❌ کادر رمز عبور پیدا نشد.");
        return;
    }


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value.trim();


    if (email === "" || password === "") {
        alert("⚠️ ایمیل و رمز عبور را وارد کنید.");
        return;
    }


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });


    if (error) {

        console.error("خطای ورود:", error);

        alert(
            "❌ ورود ناموفق بود:\n" +
            error.message
        );

        return;
    }


    console.log("ورود موفق:", data);

    loginBox.style.display = "none";
    teacherPanel.style.display = "block";

    alert("✅ ورود معلم با موفقیت انجام شد.");
}




function showAddQuestion() {

    document.getElementById("add-question").style.display =
        "block";


    document.getElementById("question-list").style.display =
        "none";

}


/* نمایش سؤال‌ها */

function showQuestions() {

    document.getElementById("add-question").style.display =
        "none";


    document.getElementById("question-list").style.display =
        "block";


    displayQuestions();

}


async function addQuestion() {

    // نوع سؤال
    const type =
        document.getElementById("question-type").value;


    // متن سؤال
    const questionText =
        document.getElementById("teacher-question")
        .value
        .trim();


    // پایه
    const grade =
        document.getElementById("teacher-grade").value;


    // فصل
    const chapter =
        document.getElementById("teacher-chapter").value;


    // بررسی متن سؤال
    if (questionText === "") {

        alert("متن سؤال را وارد کنید.");

        return;
    }


    // ساخت سؤال
    let newQuestion = {

        grade: grade,

        chapter: chapter,

        question: questionText,

        type: type,

        options: null,

        answer: null

    };

    
    

    // =========================
    // چهارگزینه‌ای
    // =========================

    if (type === "mcq") {

        const options = [

            document.getElementById("option-0").value.trim(),

            document.getElementById("option-1").value.trim(),

            document.getElementById("option-2").value.trim(),

            document.getElementById("option-3").value.trim()

        ];


        // بررسی گزینه‌ها
        if (options.some(option => option === "")) {

            alert("لطفاً هر چهار گزینه را وارد کنید.");

            return;
        }


        newQuestion.options = options;


        newQuestion.answer =
            Number(
                document.getElementById("correct-answer").value
            );

    }


    // =========================
    // صحیح / غلط
    // =========================

    else if (type === "truefalse") {

        const answerText =
            document.getElementById("correct-answer").value;


        if (
            answerText !== "true" &&
            answerText !== "false"
        ) {

            alert(
                "برای سؤال صحیح/غلط باید پاسخ true یا false باشد."
            );

            return;
        }


        newQuestion.answer =
            answerText === "true";

    }


    // =========================
    // جای خالی
    // کوتاه پاسخ
    // =========================

    else if (
        type === "fillblank" ||
        type === "shortanswer"
    ) {

        const answer =
            document.getElementById("correct-answer").value.trim();


        if (answer === "") {

            alert("پاسخ صحیح را وارد کنید.");

            return;
        }


        newQuestion.answer = answer;

    }


    // =========================
    // تشریحی
    // =========================

    else if (type === "essay") {

        newQuestion.answer = null;

    }


    // =========================
    // ذخیره در Supabase
    // =========================

    const { data, error } =
        await supabaseClient
        .from("questions")
        .insert([newQuestion])
        .select()
        .single();


    // اگر خطا وجود داشت
    if (error) {

        console.error(error);

        alert(
            "❌ خطا در ذخیره سؤال:\n" +
            error.message
        );

        return;
    }


    // =========================
    // ذخیره موفق
    // =========================

    // اضافه کردن ID دیتابیس
    newQuestion.id = data.id;


    // اضافه کردن به آرایه محلی
    questions.push(newQuestion);


    // ذخیره نسخه محلی
    localStorage.setItem(
        "biologyQuestions",
        JSON.stringify(questions)
    );


    alert(
        "✅ سؤال با موفقیت در دیتابیس آنلاین ذخیره شد."
    );


    // پاک کردن فرم
    clearQuestionForm();

}

/* افزودن سؤال */


/* پاک کردن فرم */

function clearQuestionForm() {

    document.getElementById("teacher-question").value =
        "";

    document.getElementById("option-0").value =
        "";

    document.getElementById("option-1").value =
        "";

    document.getElementById("option-2").value =
        "";

    document.getElementById("option-3").value =
        "";

}


/* نمایش بانک سؤال */

function displayQuestions() {

    const container =
        document.getElementById("questions-container");


    if (!container) {

        return;

    }


    container.innerHTML = "";


    questions.forEach(function(question, index) {

        const card =
            document.createElement("div");


        card.className =
            "question-card";


        card.innerHTML = `

            <strong>
                ${index + 1}.
                ${question.question}
            </strong>

            <p>
                پایه: ${question.grade}
            </p>

            <p>
                فصل: ${question.chapter}
            </p>

            <p>
                گزینه ۱: ${question.options[0]}
            </p>

            <p>
                گزینه ۲: ${question.options[1]}
            </p>

            <p>
                گزینه ۳: ${question.options[2]}
            </p>

            <p>
                گزینه ۴: ${question.options[3]}
            </p>

        `;


        container.appendChild(card);

    });

}



function showResults() {

    // بخش‌های دیگر پنل را مخفی می‌کنیم
    const addQuestion = document.getElementById("add-question");
    const questionList = document.getElementById("question-list");
    const resultsPanel = document.getElementById("results-panel");

    if (addQuestion) {
        addQuestion.style.display = "none";
    }

    if (questionList) {
        questionList.style.display = "none";
    }

    if (resultsPanel) {
        resultsPanel.style.display = "block";
    }

    displayResults();
}




async function displayResults() {

    const container =
        document.getElementById("results-container");

    if (!container) {
        console.log("results-container پیدا نشد");
        return;
    }

    container.innerHTML =
        "⏳ در حال دریافت نتایج...";

    const { data: results, error } =
        await supabaseClient
        .from("exam_results")
        .select("*");

    console.log(
        "نتایج دریافتی از Supabase:",
        results
    );

    console.log(
        "خطای Supabase:",
        error
    );

    if (error) {

        console.error(error);

        container.innerHTML =
            "❌ خطا در دریافت نتایج:<br>" +
            error.message;

        return;
    }

    if (!results || results.length === 0) {

        container.innerHTML =
            "📭 هنوز هیچ نتیجه‌ای ثبت نشده است.";

        return;
    }

    // نتایج را برای تابع showExamDetails قابل دسترسی می‌کنیم
    window.examResults = results;

    container.innerHTML = "";

    results.forEach(function(result, index) {

        const card =
            document.createElement("div");

        card.className =
            "result-card";

        card.style.marginBottom =
            "20px";

        card.style.padding =
            "15px";

        card.style.border =
            "1px solid #ddd";

        card.style.borderRadius =
            "10px";

        card.innerHTML = `

            <h3>
                آزمون ${index + 1}
            </h3>

            <p>
                👤 <strong>دانش‌آموز:</strong>
                ${result.student_name || "-"}
            </p>

            <p>
                🎯 <strong>نمره:</strong>
                ${result.score ?? "-"}
                از
                ${result.total_questions ?? "-"}
            </p>

            <p>
                ✅ <strong>پاسخ صحیح:</strong>
                ${result.correct_answers ?? "-"}
            </p>

            <p>
                ❌ <strong>پاسخ غلط:</strong>
                ${result.wrong_answers ?? "-"}
            </p>

            <p>
                📅 <strong>تاریخ:</strong>
                ${result.date || "-"}
            </p>

            <br>

            <button
                onclick="showExamDetails(${index}, this)"
            >
                🔍 مشاهده جزئیات پاسخ‌ها
            </button>

            <div
                class="exam-details"
                style="
                    display:none;
                    margin-top:15px;
                    padding:15px;
                    border-radius:10px;
                    background:#f5f5f5;
                "
            ></div>

        `;

        container.appendChild(card);

    });

}





function showExamDetails(index, button) {

    const results = window.examResults;

    if (!results) {
        alert("❌ اطلاعات نتایج پیدا نشد.");
        return;
    }

    const result = results[index];

    if (!result) {
        alert("❌ نتیجه آزمون پیدا نشد.");
        return;
    }

    const card = button.closest(".result-card");

    if (!card) {
        alert("❌ کارت نتیجه پیدا نشد.");
        return;
    }

    const details = card.querySelector(".exam-details");

    if (!details) {
        alert("❌ بخش جزئیات پیدا نشد.");
        return;
    }

    // باز و بسته کردن جزئیات
    if (details.style.display === "block") {

        details.style.display = "none";

        return;
    }

    let answers = result.answers;

    // اگر answers به صورت متن ذخیره شده باشد
    if (typeof answers === "string") {

        try {

            answers = JSON.parse(answers);

        } catch (error) {

            console.error(
                "خطا در تبدیل answers:",
                error
            );

            details.innerHTML = `
                <p>
                    ❌ ساختار پاسخ‌ها قابل خواندن نیست.
                </p>
            `;

            details.style.display = "block";

            return;
        }
    }

    if (
        !answers ||
        (
            Array.isArray(answers) &&
            answers.length === 0
        )
    ) {

        details.innerHTML = `
            <p>
                📭 پاسخ‌های این آزمون ذخیره نشده‌اند.
            </p>
        `;

        details.style.display = "block";

        return;
    }

    let html = `
        <h4>
            📝 جزئیات آزمون
            ${result.student_name || ""}
        </h4>
    `;

    if (Array.isArray(answers)) {

        answers.forEach(
            function(answer, answerIndex) {

                const questionText =
                    answer.question || "-";

                const options =
                    Array.isArray(answer.options)
                        ? answer.options
                        : [];

                const userAnswer =
                    answer.userAnswer ?? null;

                const correctAnswer =
                    answer.correctAnswer ?? null;

                let userAnswerText =
                    userAnswer ?? "بدون پاسخ";

                let correctAnswerText =
                    correctAnswer ?? "مشخص نیست";


                // تبدیل شماره گزینه دانش‌آموز به متن گزینه
                if (
                    answer.type === "mcq" &&
                    userAnswer !== null &&
                    options[userAnswer] !== undefined
                ) {

                    userAnswerText =
                        `گزینه ${Number(userAnswer) + 1}: ${options[userAnswer]}`;

                }


                // تبدیل شماره پاسخ صحیح به متن گزینه
                if (
                    answer.type === "mcq" &&
                    correctAnswer !== null &&
                    options[correctAnswer] !== undefined
                ) {

                    correctAnswerText =
                        `گزینه ${Number(correctAnswer) + 1}: ${options[correctAnswer]}`;

                }


                // بررسی درست یا غلط بودن پاسخ
                let resultText = "";

                if (
                    userAnswer === null ||
                    userAnswer === ""
                ) {

                    resultText = `
                        <p style="color:#777;">
                            ⚪ بدون پاسخ
                        </p>
                    `;

                } else if (
                    String(userAnswer) ===
                    String(correctAnswer)
                ) {

                    resultText = `
                        <p style="color:green;">
                            🟢 درست
                        </p>
                    `;

                } else {

                    resultText = `
                        <p style="color:red;">
                            🔴 غلط
                        </p>
                    `;
                }


                html += `

                    <div
                        style="
                            margin-bottom:20px;
                            padding:15px;
                            background:white;
                            border-radius:10px;
                            border:1px solid #ddd;
                        "
                    >

                        <h4>
                            📝 سؤال ${answerIndex + 1}
                        </h4>

                        <p>
                            <strong>
                                ${questionText}
                            </strong>
                        </p>

                        <p>
                            👨‍🎓
                            <strong>
                                پاسخ دانش‌آموز:
                            </strong>
                            ${userAnswerText}
                        </p>

                        <p>
                            ✅
                            <strong>
                                پاسخ صحیح:
                            </strong>
                            ${correctAnswerText}
                        </p>

                        ${resultText}

                    </div>

                `;
            }
        );

    } else {

        html += `
            <p>
                ⚠️ ساختار پاسخ‌ها آرایه نیست.
            </p>
        `;
    }

    details.innerHTML = html;

    details.style.display = "block";
}








let progressChart = null;


function showProgressPanel() {

    const addQuestion =
        document.getElementById("add-question");

    const questionList =
        document.getElementById("question-list");

    const resultsPanel =
        document.getElementById("results-panel");

    const progressPanel =
        document.getElementById("progress-panel");


    if (addQuestion) {
        addQuestion.style.display = "none";
    }

    if (questionList) {
        questionList.style.display = "none";
    }

    if (resultsPanel) {
        resultsPanel.style.display = "none";
    }

    if (progressPanel) {
        progressPanel.style.display = "block";
    }

    loadStudentList();
}


function loadStudentList() {

    const select =
        document.getElementById("student-select");

    if (!select) {
        return;
    }

    const results =
        JSON.parse(
            localStorage.getItem("examResults")
        ) || [];


    // حذف گزینه‌های قبلی
    select.innerHTML = `
        <option value="">
            -- یک دانش‌آموز انتخاب کنید --
        </option>
    `;


    // استخراج نام دانش‌آموزان
    const students = [];

    results.forEach(function(result) {

        if (!students.includes(result.studentName)) {
            students.push(result.studentName);
        }

    });


    // اضافه کردن دانش‌آموزان به لیست
    students.forEach(function(student) {

        const option =
            document.createElement("option");

        option.value = student;
        option.textContent = student;

        select.appendChild(option);

    });
}


function showStudentChart() {

    const select =
        document.getElementById("student-select");

    const studentName =
        select.value;


    if (studentName === "") {
        return;
    }


    const results =
        JSON.parse(
            localStorage.getItem("examResults")
        ) || [];


    // فقط آزمون‌های همین دانش‌آموز
    const studentResults =
        results.filter(function(result) {

            return result.studentName === studentName;

        });


    const labels =
        studentResults.map(function(result, index) {

            return "آزمون " + (index + 1);

        });


    const scores =
        studentResults.map(function(result) {

            return result.score;

        });


    const ctx =
        document
        .getElementById("progress-chart")
        .getContext("2d");


    // اگر نمودار قبلی وجود داشت حذفش کن
    if (progressChart) {

        progressChart.destroy();

    }


    progressChart =
        new Chart(ctx, {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label: "نمره",

                    data: scores,

                    tension: 0.3,

                    fill: false

                }]

            },

            options: {

                responsive: true,

                scales: {

                    y: {

                        beginAtZero: true,

                        suggestedMax: 10

                    }

                }

            }

        });

}



function exportResultsToExcel() {

    const results =
        JSON.parse(localStorage.getItem("examResults")) || [];

    if (results.length === 0) {
        alert("هنوز هیچ نتیجه‌ای برای خروجی گرفتن وجود ندارد.");
        return;
    }

    // تبدیل اطلاعات به جدول
    const excelData = results.map(function(result, index) {

        return {
            "ردیف": index + 1,
            "نام دانش‌آموز": result.studentName,
            "نمره": result.score,
            "کل سؤالات": result.totalQuestions,
            "پاسخ صحیح": result.correctAnswers,
            "پاسخ غلط": result.wrongAnswers,
            "تاریخ آزمون": result.date
        };

    });

    // ساخت Worksheet
    const worksheet =
        XLSX.utils.json_to_sheet(excelData);

    // ساخت Workbook
    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "نتایج آزمون"
    );

    // نام فایل
    const fileName =
        "نتایج-آزمون-زیست.xlsx";

    // دانلود فایل
    XLSX.writeFile(
        workbook,
        fileName
    );

    alert("✅ فایل Excel با موفقیت ساخته شد.");
}


function changeQuestionType() {

    const type =
        document.getElementById("question-type").value;

    const optionsBox =
        document.getElementById("options-box");

    const answerBox =
        document.getElementById("answer-box");

    const scoreBox =
        document.getElementById("score-box");

    const answerLabel =
        answerBox.querySelector("label");

    const correctAnswer =
        document.getElementById("correct-answer");


    // =========================
    // چهارگزینه‌ای
    // =========================

    if (type === "mcq") {

        optionsBox.style.display = "block";

        answerBox.style.display = "block";

        scoreBox.style.display = "none";


        answerLabel.textContent =
            "پاسخ صحیح:";


        correctAnswer.outerHTML = `
            <select id="correct-answer">

                <option value="0">
                    گزینه ۱
                </option>

                <option value="1">
                    گزینه ۲
                </option>

                <option value="2">
                    گزینه ۳
                </option>

                <option value="3">
                    گزینه ۴
                </option>

            </select>
        `;
    }


    // =========================
    // صحیح / غلط
    // =========================

    else if (type === "truefalse") {

        optionsBox.style.display = "none";

        answerBox.style.display = "block";

        scoreBox.style.display = "none";


        answerLabel.textContent =
            "پاسخ صحیح:";


        correctAnswer.outerHTML = `
            <select id="correct-answer">

                <option value="true">
                    صحیح
                </option>

                <option value="false">
                    غلط
                </option>

            </select>
        `;
    }


    // =========================
    // جای خالی
    // کوتاه پاسخ
    // =========================

    else if (
        type === "fillblank" ||
        type === "shortanswer"
    ) {

        optionsBox.style.display = "none";

        answerBox.style.display = "block";

        scoreBox.style.display = "none";


        answerLabel.textContent =
            "پاسخ صحیح:";


        correctAnswer.outerHTML = `
            <input
                type="text"
                id="correct-answer"
                placeholder="پاسخ صحیح را وارد کنید">
        `;
    }


    // =========================
    // تشریحی
    // =========================

    else if (type === "essay") {

        optionsBox.style.display = "none";

        answerBox.style.display = "none";

        scoreBox.style.display = "block";
    }

}




document.getElementById("question").style.fontFamily = "BBadr";

document.querySelectorAll(".option").forEach(option => {
    option.style.fontFamily = "BBadr";
});

// تغییر فونت همه پاراگراف‌ها
