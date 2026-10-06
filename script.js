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
        .from("student_questions")
        .select(
            "id, type, grade, chapter, question, options"
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

                    answer: null,
                    
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
                student_name: result.studentName,
                score: result.score,
                total_questions: result.totalQuestions,
                correct_answers: result.correctAnswers,
                wrong_answers: result.wrongAnswers,
                date: result.date,
                answers: result.answers
            }])
            .select();

    if (error) {

        console.error(
            "❌ خطا در ذخیره نتیجه:",
            error
        );

        alert(
            "❌ نتیجه آزمون ذخیره نشد:\n\n" +
            error.message
        );

        return false;
    }

    console.log(
        "✅ نتیجه با موفقیت در Supabase ذخیره شد:",
        data
    );

    return true;
}




async function gradeExamOnSupabase() {

    const submittedAnswers =
        examQuestions.map(function(question) {

            return {
                questionId: question.id,
                userAnswer: question.userAnswer
            };

        });

    console.log(
        "📤 پاسخ‌های ارسالی برای تصحیح:",
        submittedAnswers
    );

    const { data, error } =
        await supabaseClient.rpc(
            "grade_exam",
            {
                submitted_answers:
                    submittedAnswers
            }
        );

    if (error) {

        console.error(
            "❌ خطا در تصحیح آزمون:",
            error
        );

        alert(
            "❌ خطا در تصحیح آزمون:\n\n" +
            error.message
        );

        return null;
    }

    console.log(
        "✅ نتیجه تصحیح از Supabase:",
        data
    );

    return data;
}



async function showResult() {

    clearInterval(timerInterval);

    console.log(
        "📝 آزمون به پایان رسید."
    );

    /* =========================
       ارسال پاسخ‌ها برای تصحیح
    ========================= */

    const gradedResult =
        await gradeExamOnSupabase();

    if (!gradedResult) {

        alert(
            "❌ تصحیح آزمون انجام نشد."
        );

        return;
    }

    console.log(
        "✅ نتیجه نهایی:",
        gradedResult
    );

    /* =========================
       اطلاعات نتیجه
    ========================= */

    const totalQuestions =
        Number(
            gradedResult.totalQuestions
        ) || examQuestions.length;

    const correctAnswers =
        Number(
            gradedResult.correctAnswers
        ) || 0;

    const wrongAnswers =
        Number(
            gradedResult.wrongAnswers
        ) || 0;

    const finalScore =
        Number(
            gradedResult.score
        ) || 0;

    /* =========================
       ساخت نتیجه
    ========================= */

    const result = {

        id: Date.now(),

        studentName:
            studentName,

        score:
            finalScore,

        totalQuestions:
            totalQuestions,

        correctAnswers:
            correctAnswers,

        wrongAnswers:
            wrongAnswers,

        date:
            new Date().toLocaleString(
                "fa-IR"
            ),

        answers:
            gradedResult.answers || []

    };

    console.log(
        "📊 نتیجه آماده ذخیره:",
        result
    );

    /* =========================
       ذخیره نتیجه در Supabase
    ========================= */

    await saveExamResult(result);

    /* =========================
       نمایش صفحه نتیجه
    ========================= */

    const quizScreen =
        document.getElementById(
            "quiz-screen"
        );

    const resultScreen =
        document.getElementById(
            "result-screen"
        );

    if (quizScreen) {
        quizScreen.style.display =
            "none";
    }

    if (resultScreen) {
        resultScreen.style.display =
            "block";
    }

    /* =========================
       نمایش نام دانش‌آموز
    ========================= */

    const resultName =
        document.getElementById(
            "result-name"
        );

    if (resultName) {

        resultName.textContent =
            "دانش‌آموز: " +
            studentName;
    }

    /* =========================
       نمایش نمره
    ========================= */

    const resultScore =
        document.getElementById(
            "result-score"
        );

    if (resultScore) {

        resultScore.textContent =
            "نمره شما: " +
            finalScore +
            " از " +
            totalQuestions;
    }

    console.log(
        "✅ آزمون با موفقیت تصحیح و ذخیره شد."
    );
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


let editingQuestionId = null;
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

    editingQuestionId = null;

    document.getElementById("add-question").style.display = "block";
    document.getElementById("question-list").style.display = "none";

    clearQuestionForm();
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

    const type =
        document.getElementById("question-type").value;

    const questionText =
        document
            .getElementById("teacher-question")
            .value
            .trim();

    const grade =
        document.getElementById("teacher-grade").value;

    const chapter =
        document.getElementById("teacher-chapter").value;

    if (questionText === "") {
        alert("متن سؤال را وارد کنید.");
        return;
    }

    let updatedQuestion = {
        grade: grade,
        chapter: chapter,
        question: questionText,
        type: type,
        options: null,
        answer: null
    };

    /* =========================
       چهارگزینه‌ای
    ========================= */

    if (type === "mcq") {

        const options = [
            document
                .getElementById("option-0")
                .value
                .trim(),

            document
                .getElementById("option-1")
                .value
                .trim(),

            document
                .getElementById("option-2")
                .value
                .trim(),

            document
                .getElementById("option-3")
                .value
                .trim()
        ];

        if (
            options.some(
                function(option) {
                    return option === "";
                }
            )
        ) {

            alert(
                "لطفاً هر چهار گزینه را وارد کنید."
            );

            return;
        }

        updatedQuestion.options =
            options;

        updatedQuestion.answer =
            Number(
                document
                    .getElementById("correct-answer")
                    .value
            );
    }

    /* =========================
       صحیح / غلط
    ========================= */

    else if (type === "truefalse") {

        const answerText =
            document
                .getElementById("correct-answer")
                .value;

        updatedQuestion.answer =
            answerText === "true";
    }

    /* =========================
       جای خالی / پاسخ کوتاه
    ========================= */

    else if (
        type === "fillblank" ||
        type === "shortanswer"
    ) {

        const answer =
            document
                .getElementById("correct-answer")
                .value
                .trim();

        if (answer === "") {

            alert(
                "پاسخ صحیح را وارد کنید."
            );

            return;
        }

        updatedQuestion.answer =
            answer;
    }

    /* =========================
       تشریحی
    ========================= */

    else if (type === "essay") {

        updatedQuestion.answer =
            null;
    }


    /* ==================================================
       حالت ویرایش
    ================================================== */

    if (editingQuestionId !== null) {

        console.log(
            "✏️ در حال ویرایش سؤال:",
            editingQuestionId
        );

        const { error } =
            await supabaseClient
                .from("questions")
                .update(updatedQuestion)
                .eq(
                    "id",
                    editingQuestionId
                );

        if (error) {

            console.error(
                "❌ خطا در ویرایش سؤال:",
                error
            );

            alert(
                "❌ ویرایش سؤال انجام نشد:\n\n" +
                error.message
            );

            return;
        }

        alert(
            "✅ سؤال با موفقیت ویرایش شد."
        );

        editingQuestionId = null;

        clearQuestionForm();

        document
            .getElementById("add-question")
            .style.display = "none";

        document
            .getElementById("question-list")
            .style.display = "block";

        displayQuestions();

        return;
    }


    /* ==================================================
       حالت افزودن سؤال جدید
    ================================================== */

    const { data, error } =
        await supabaseClient
            .from("questions")
            .insert([updatedQuestion])
            .select()
            .single();

    if (error) {

        console.error(
            "❌ خطا در ذخیره سؤال:",
            error
        );

        alert(
            "❌ خطا در ذخیره سؤال:\n\n" +
            error.message
        );

        return;
    }

    console.log(
        "✅ سؤال جدید:",
        data
    );

    alert(
        "✅ سؤال با موفقیت در دیتابیس آنلاین ذخیره شد."
    );

    clearQuestionForm();

    displayQuestions();
}
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


async function displayQuestions() {

    const container =
        document.getElementById("questions-container");

    if (!container) {
        alert("❌ questions-container پیدا نشد.");
        return;
    }

    container.innerHTML =
        "⏳ در حال دریافت سؤال‌ها...";

    const { data, error } =
        await supabaseClient
            .from("questions")
            .select(
                "id, type, grade, chapter, question, options, answer"
            )
            .order("id", {
                ascending: true
            });

    console.log(
        "📚 سؤال‌های دریافت‌شده:",
        data
    );

    if (error) {

        console.error(
            "❌ خطا در دریافت سؤال‌ها:",
            error
        );

        container.innerHTML =
            "❌ خطا در دریافت سؤال‌ها:<br>" +
            error.message;

        return;
    }

    if (!data || data.length === 0) {

        container.innerHTML =
            "📭 هنوز هیچ سؤالی در بانک سؤال وجود ندارد.";

        return;
    }

    container.innerHTML = "";

    data.forEach(function(question, index) {

        const card =
            document.createElement("div");

        card.className =
            "question-card";

        let optionsHTML = "";

        if (
            question.type === "mcq" &&
            Array.isArray(question.options)
        ) {

            question.options.forEach(
                function(option, optionIndex) {

                    optionsHTML += `
                        <p>
                            گزینه ${optionIndex + 1}:
                            ${option}
                        </p>
                    `;
                }
            );

        }

        else if (question.type === "truefalse") {

            optionsHTML = `
                <p>نوع سؤال: صحیح / غلط</p>
            `;

        }

        else if (question.type === "fillblank") {

            optionsHTML = `
                <p>نوع سؤال: جای خالی</p>
            `;

        }

        else if (question.type === "shortanswer") {

            optionsHTML = `
                <p>نوع سؤال: پاسخ کوتاه</p>
            `;

        }

        else if (question.type === "essay") {

            optionsHTML = `
                <p>نوع سؤال: تشریحی</p>
            `;
        }

        card.innerHTML = `

            <h3>
                📝 سؤال ${index + 1}
            </h3>

            <p>
                <strong>
                    ${question.question}
                </strong>
            </p>

            <p>
                🎓 پایه:
                ${question.grade || "-"}
            </p>

            <p>
                📚 فصل:
                ${question.chapter || "-"}
            </p>

            <p>
                🔹 نوع:
                ${question.type || "-"}
            </p>

            ${optionsHTML}

            <div style="
                margin-top:15px;
                display:flex;
                gap:10px;
                flex-wrap:wrap;
            ">

                <button
                    onclick="editQuestion(${question.id})"
                    style="
                        background:#1976d2;
                        color:white;
                        border:none;
                        padding:10px 15px;
                        border-radius:8px;
                        cursor:pointer;
                    "
                >
                    ✏️ ویرایش
                </button>

                <button
                    onclick="deleteQuestion(${question.id})"
                    style="
                        background:#d32f2f;
                        color:white;
                        border:none;
                        padding:10px 15px;
                        border-radius:8px;
                        cursor:pointer;
                    "
                >
                    🗑️ حذف
                </button>

            </div>

        `;

        container.appendChild(card);

    });

    console.log(
        "✅ تعداد سؤال‌های نمایش داده‌شده:",
        data.length
    );
}

/* نمایش بانک سؤال */

async function deleteQuestion(questionId) {

    const confirmed =
        confirm(
            "⚠️ آیا مطمئن هستید که می‌خواهید این سؤال را حذف کنید؟"
        );

    if (!confirmed) {
        return;
    }

    console.log(
        "🗑️ تلاش برای حذف سؤال با ID:",
        questionId
    );

    const { data, error } =
        await supabaseClient
            .from("questions")
            .delete()
            .eq("id", questionId)
            .select();

    console.log("نتیجه حذف:", data);
    console.log("خطای حذف:", error);

    if (error) {

        alert(
            "❌ حذف سؤال انجام نشد.\n\n" +
            "پیام خطا:\n" +
            error.message +
            "\n\nکد خطا:\n" +
            (error.code || "-")
        );

        return;
    }

    if (!data || data.length === 0) {

        alert(
            "⚠️ هیچ سؤالی حذف نشد.\n\n" +
            "احتمالاً مجوز حذف در Supabase تنظیم نشده است."
        );

        return;
    }

    alert(
        "✅ سؤال با موفقیت حذف شد."
    );

    displayQuestions();
}

async function editQuestion(questionId) {

    console.log(
        "✏️ ویرایش سؤال با ID:",
        questionId
    );

    const { data: question, error } =
        await supabaseClient
            .from("questions")
            .select(
                "id, type, grade, chapter, question, options, answer"
            )
            .eq("id", questionId)
            .single();

    if (error) {

        console.error(
            "❌ خطا در دریافت سؤال:",
            error
        );

        alert(
            "❌ اطلاعات سؤال دریافت نشد:\n\n" +
            error.message
        );

        return;
    }

    if (!question) {

        alert(
            "❌ سؤال پیدا نشد."
        );

        return;
    }

    console.log(
        "📚 سؤال برای ویرایش:",
        question
    );

    editingQuestionId = question.id;

    /* =========================
       نمایش فرم سؤال
    ========================= */

    const addQuestion =
        document.getElementById("add-question");

    const questionList =
        document.getElementById("question-list");

    if (addQuestion) {
        addQuestion.style.display = "block";
    }

    if (questionList) {
        questionList.style.display = "none";
    }

    /* =========================
       پر کردن اطلاعات سؤال
    ========================= */

    const typeInput =
        document.getElementById("question-type");

    const questionInput =
        document.getElementById("teacher-question");

    const gradeInput =
        document.getElementById("teacher-grade");

    const chapterInput =
        document.getElementById("teacher-chapter");

    if (typeInput) {
        typeInput.value = question.type;
    }

    if (questionInput) {
        questionInput.value = question.question || "";
    }

    if (gradeInput) {
        gradeInput.value = question.grade || "";
    }

    if (chapterInput) {
        chapterInput.value = question.chapter || "";
    }

    /* =========================
       تغییر نوع سؤال
    ========================= */

    changeQuestionType();

    /* =========================
       پر کردن گزینه‌ها
    ========================= */

    if (
        question.type === "mcq" &&
        Array.isArray(question.options)
    ) {

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            const optionInput =
                document.getElementById(
                    "option-" + i
                );

            if (optionInput) {

                optionInput.value =
                    question.options[i] || "";
            }
        }
    }

    /* =========================
       پر کردن پاسخ صحیح
    ========================= */

    const correctAnswer =
        document.getElementById("correct-answer");

    if (correctAnswer) {

        if (question.type === "mcq") {

            correctAnswer.value =
                String(question.answer ?? "");

        }

        else if (
            question.type === "truefalse"
        ) {

            correctAnswer.value =
                String(question.answer);

        }

        else if (
            question.type === "fillblank" ||
            question.type === "shortanswer"
        ) {

            correctAnswer.value =
                question.answer || "";
        }
    }

    alert(
        "✏️ سؤال برای ویرایش آماده شد."
    );
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
            .select("*")
            .order("id", {
                ascending: true
            });


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


    // نتایج را برای showExamDetails قابل دسترسی می‌کنیم
    window.examResults = results;


    container.innerHTML = "";


    // دسته‌بندی نتایج بر اساس نام دانش‌آموز
    const students = {};


    results.forEach(function(result, index) {

        const studentName =
            result.student_name || "دانش‌آموز بدون نام";


        if (!students[studentName]) {

            students[studentName] = [];

        }


        students[studentName].push({

            result: result,

            index: index

        });

    });


    // ساخت بخش جداگانه برای هر دانش‌آموز
    Object.keys(students).forEach(
        function(studentName) {


            const studentSection =
                document.createElement("div");


            studentSection.className =
                "student-results-section";


            studentSection.style.marginBottom =
                "30px";


            studentSection.style.padding =
                "15px";


            studentSection.style.border =
                "2px solid #ddd";


            studentSection.style.borderRadius =
                "15px";


            studentSection.style.background =
                "#fafafa";


            // عنوان دانش‌آموز
            const title =
    document.createElement("h2");


title.textContent =
    "👨‍🎓 " + studentName;


title.style.marginBottom =
    "10px";


title.style.textAlign =
    "center";


studentSection.appendChild(title);


// تعداد آزمون‌های دانش‌آموز
const examCount =
    students[studentName].length;


const toggleButton =
    document.createElement("button");


toggleButton.textContent =
    "📂 مشاهده نتایج (" +
    examCount +
    " آزمون)";


toggleButton.style.display =
    "block";


toggleButton.style.margin =
    "0 auto 15px auto";


toggleButton.style.padding =
    "10px 18px";


toggleButton.style.border =
    "none";


toggleButton.style.borderRadius =
    "8px";


toggleButton.style.cursor =
    "pointer";


studentSection.appendChild(
    toggleButton
);


// ظرف آزمون‌های دانش‌آموز
const examsContainer =
    document.createElement("div");


examsContainer.style.display =
    "none";


studentSection.appendChild(
    examsContainer
);


toggleButton.onclick =
    function() {

        if (
            examsContainer.style.display ===
            "none"
        ) {

            examsContainer.style.display =
                "block";

            toggleButton.textContent =
                "📂 بستن نتایج";

        } else {

            examsContainer.style.display =
                "none";

            toggleButton.textContent =
                "📂 مشاهده نتایج (" +
                examCount +
                " آزمون)";

        }

    };

            // آزمون‌های این دانش‌آموز
            students[studentName].forEach(
                function(item, studentExamIndex) {


                    const result =
                        item.result;


                    const originalIndex =
                        item.index;


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


                    card.style.background =
                        "white";


                    card.innerHTML = `

                        <h3>
                            📝 آزمون ${studentExamIndex + 1}
                        </h3>

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
                            onclick="showExamDetails(
                                ${originalIndex},
                                this
                            )"
                        >
                            🔍 مشاهده جزئیات پاسخ‌ها
                        </button>

                        <br><br>

                        <button
                            onclick="deleteExamResult(
                                ${result.id}
                            )"
                            style="
                                background:#d32f2f;
                                color:white;
                                border:none;
                                padding:10px 15px;
                                border-radius:8px;
                                cursor:pointer;
                            "
                        >
                            🗑️ حذف این نتیجه
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


                    examsContainer.appendChild(card);

                }
            );


            container.appendChild(
                studentSection
            );

        }
    );

}



async function deleteExamResult(resultId) {

    const confirmed =
        confirm(
            "⚠️ آیا مطمئن هستید که می‌خواهید این نتیجه آزمون را حذف کنید؟"
        );

    if (!confirmed) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("exam_results")
            .delete()
            .eq("id", resultId);


    if (error) {

        console.error(
            "خطا در حذف نتیجه:",
            error
        );

        alert(
            "❌ حذف نتیجه انجام نشد:\n\n" +
            error.message
        );

        return;
    }


    alert(
        "✅ نتیجه آزمون با موفقیت حذف شد."
    );


    // دریافت دوباره نتایج
    displayResults();

}




async function showExamDetails(index, button) {

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

    const card =
        button.closest(".result-card");

    if (!card) {
        alert("❌ کارت نتیجه پیدا نشد.");
        return;
    }

    const details =
        card.querySelector(".exam-details");

    if (!details) {
        alert("❌ بخش جزئیات پیدا نشد.");
        return;
    }

    if (details.style.display === "block") {
        details.style.display = "none";
        return;
    }

    let answers = result.answers;

    if (typeof answers === "string") {

        try {
            answers = JSON.parse(answers);
        }

        catch (error) {

            console.error(
                "❌ خطا در تبدیل answers:",
                error
            );

            details.innerHTML =
                "<p>❌ ساختار پاسخ‌ها قابل خواندن نیست.</p>";

            details.style.display = "block";

            return;
        }
    }

    if (
        !answers ||
        !Array.isArray(answers) ||
        answers.length === 0
    ) {

        details.innerHTML =
            "<p>📭 پاسخ‌های این آزمون ذخیره نشده‌اند.</p>";

        details.style.display = "block";

        return;
    }

    details.innerHTML =
        "⏳ در حال دریافت پاسخ‌های صحیح...";

    /*
     * گرفتن ID سؤال‌ها
     */

    const questionIds =
        answers
            .map(function(answer) {
                return answer.questionId;
            })
            .filter(function(id) {
                return id !== null &&
                       id !== undefined;
            });

    /*
     * دریافت اطلاعات سؤال‌ها از Supabase
     */

    const { data: questionsData, error } =
        await supabaseClient
            .from("questions")
            .select(
                "id, type, question, options, answer"
            )
            .in("id", questionIds);

    if (error) {

        console.error(
            "❌ خطا در دریافت سؤال‌ها:",
            error
        );

        details.innerHTML =
            "❌ خطا در دریافت پاسخ صحیح:<br>" +
            error.message;

        return;
    }

    /*
     * تبدیل سؤال‌ها به یک شیء برای دسترسی سریع
     */

    const questionsMap = {};

    questionsData.forEach(
        function(question) {

            questionsMap[question.id] =
                question;

        }
    );

    let html = `
        <h4>
            📝 جزئیات آزمون
            ${result.student_name || ""}
        </h4>
    `;

    /*
     * نمایش تک‌تک سؤال‌ها
     */

    answers.forEach(
        function(answer, answerIndex) {

            const question =
                questionsMap[answer.questionId];

            if (!question) {

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
                        <p>
                            ❌ اطلاعات سؤال
                            ${answer.questionId}
                            پیدا نشد.
                        </p>
                    </div>
                `;

                return;
            }

            const userAnswer =
                answer.userAnswer ?? null;

            const correctAnswer =
                question.answer ?? null;

            const options =
                Array.isArray(question.options)
                    ? question.options
                    : [];

            /*
             * متن پاسخ دانش‌آموز
             */

            let userAnswerText =
                userAnswer === null ||
                userAnswer === ""
                    ? "بدون پاسخ"
                    : String(userAnswer);

            /*
             * متن پاسخ صحیح
             */

            let correctAnswerText =
                correctAnswer === null
                    ? "بدون پاسخ صحیح"
                    : String(correctAnswer);

            /*
             * چهارگزینه‌ای
             */

            if (
                question.type === "mcq"
            ) {

                if (
                    userAnswer !== null &&
                    options[userAnswer] !== undefined
                ) {

                    userAnswerText =
                        "گزینه " +
                        (Number(userAnswer) + 1) +
                        ": " +
                        options[userAnswer];
                }

                if (
                    correctAnswer !== null &&
                    options[correctAnswer] !== undefined
                ) {

                    correctAnswerText =
                        "گزینه " +
                        (Number(correctAnswer) + 1) +
                        ": " +
                        options[correctAnswer];
                }
            }

            /*
             * صحیح / غلط
             */

            else if (
                question.type === "truefalse"
            ) {

                if (userAnswer === true) {
                    userAnswerText = "صحیح";
                }

                else if (userAnswer === false) {
                    userAnswerText = "غلط";
                }

                if (correctAnswer === true) {
                    correctAnswerText = "صحیح";
                }

                else if (correctAnswer === false) {
                    correctAnswerText = "غلط";
                }
            }

            /*
             * تعیین درست یا غلط
             */

            let resultText = "";

            if (
                question.type === "essay"
            ) {

                resultText = `
                    <p style="color:#777;">
                        📝 سؤال تشریحی؛
                        نیازمند تصحیح دستی است.
                    </p>
                `;
            }

            else if (
                userAnswer === null ||
                userAnswer === ""
            ) {

                resultText = `
                    <p style="color:#777;">
                        ⚪ بدون پاسخ
                    </p>
                `;
            }

            else if (
                String(userAnswer).trim().toLowerCase() ===
                String(correctAnswer).trim().toLowerCase()
            ) {

                resultText = `
                    <p style="color:green;">
                        🟢 درست
                    </p>
                `;
            }

            else {

                resultText = `
                    <p style="color:red;">
                        🔴 غلط
                    </p>
                `;
            }

            /*
             * ساخت کارت سؤال
             */

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
                            ${question.question}
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


async function loadStudentList() {

    const select =
        document.getElementById("student-select");

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="">
            ⏳ در حال دریافت دانش‌آموزان...
        </option>
    `;


    const { data: results, error } =
        await supabaseClient
            .from("exam_results")
            .select("student_name");


    if (error) {

        console.error(
            "خطا در دریافت نام دانش‌آموزان:",
            error
        );

        select.innerHTML = `
            <option value="">
                ❌ خطا در دریافت اطلاعات
            </option>
        `;

        alert(
            "❌ خطا در دریافت نام دانش‌آموزان:\n\n" +
            error.message
        );

        return;
    }


    if (!results || results.length === 0) {

        select.innerHTML = `
            <option value="">
                📭 هنوز نتیجه‌ای ثبت نشده است
            </option>
        `;

        return;
    }


    // حذف نام‌های تکراری
    const students = [];

    results.forEach(function(result) {

        const name =
            result.student_name;

        if (
            name &&
            !students.includes(name)
        ) {
            students.push(name);
        }

    });


    // گزینه اول
    select.innerHTML = `
        <option value="">
            -- یک دانش‌آموز انتخاب کنید --
        </option>
    `;


    // اضافه کردن دانش‌آموزان
    students.forEach(function(student) {

        const option =
            document.createElement("option");

        option.value =
            student;

        option.textContent =
            student;

        select.appendChild(option);

    });

}

async function showStudentChart() {

    const select =
        document.getElementById("student-select");

    if (!select) {
        return;
    }

    const studentName =
        select.value;

    const studentNameElement =
    document.getElementById(
        "selected-student-name"
    );

if (studentNameElement) {

    studentNameElement.textContent =
        "👨‍🎓 گزارش پیشرفت: " +
        studentName;

}

    if (studentName === "") {
        return;
    }


    // دریافت نتایج این دانش‌آموز از Supabase
    const { data: studentResults, error } =
        await supabaseClient
            .from("exam_results")
            .select(
                "student_name, score, total_questions, date"
            )
            .eq("student_name", studentName)
            .order("id", {
                ascending: true
            });


    if (error) {

        console.error(
            "خطا در دریافت نتایج دانش‌آموز:",
            error
        );

        alert(
            "❌ خطا در دریافت نتایج:\n\n" +
            error.message
        );

        return;
    }


    if (
        !studentResults ||
        studentResults.length === 0
    ) {

        alert(
            "📭 برای این دانش‌آموز نتیجه‌ای پیدا نشد."
        );

        return;
    }


    // عنوان آزمون‌ها
    const labels =
    studentResults.map(
        function(result, index) {

            if (result.date) {

                return result.date;

            }

            return "آزمون " + (index + 1);

        }
    );


    // نمره‌ها
    const scores =
        studentResults.map(
            function(result) {

                return Number(result.score) || 0;

            }
        );

const totalScore =
    scores.reduce(
        function(sum, score) {
            return sum + score;
        },
        0
    );


const averageScore =
    totalScore / scores.length;
    
  const highestScore =
    Math.max(...scores);

const lowestScore =
    Math.min(...scores);

const examCount =
    scores.length;  
    
    let progressPercent = 0;

if (scores.length >= 2) {

    const previousScore =
        scores[scores.length - 2];

    const currentScore =
        scores[scores.length - 1];

    if (previousScore !== 0) {

        progressPercent =
            (
                (currentScore - previousScore) /
                previousScore
            ) * 100;

    }

}
    
    const averageElement =
    document.getElementById("average-score");

if (averageElement) {

    averageElement.textContent =
        "📊 میانگین نمرات: " +
        averageScore.toFixed(2) +
        " از ۲۰";

}
    
    
    const examCountElement =
    document.getElementById("exam-count");

if (examCountElement) {

    examCountElement.textContent =
        "📝 تعداد آزمون‌ها: " +
        examCount;

}


const highestScoreElement =
    document.getElementById("highest-score");

if (highestScoreElement) {

    highestScoreElement.textContent =
        "🏆 بالاترین نمره: " +
        highestScore +
        " از ۲۰";

}


const lowestScoreElement =
    document.getElementById("lowest-score");

if (lowestScoreElement) {

    lowestScoreElement.textContent =
        "📉 پایین‌ترین نمره: " +
        lowestScore +
        " از ۲۰";

}
    
    
    
    
 const progressElement =
    document.getElementById("progress-percent");

if (progressElement) {

    if (scores.length < 2) {

        progressElement.textContent =
            "📈 تغییر نسبت به آزمون قبل: " +
            "برای محاسبه حداقل دو آزمون لازم است";

    } else {

        const sign =
            progressPercent > 0
                ? "+"
                : "";

        progressElement.textContent =
            "📈 تغییر نسبت به آزمون قبل: " +
            sign +
            progressPercent.toFixed(2) +
            "%";

    }

}   
    
    
    
    const canvas =
        document.getElementById(
            "progress-chart"
        );


    if (!canvas) {

        alert(
            "❌ نمودار progress-chart پیدا نشد."
        );

        return;
    }


    const ctx =
        canvas.getContext("2d");


    // حذف نمودار قبلی
    if (progressChart) {

        progressChart.destroy();

    }


    // ساخت نمودار جدید
    progressChart =
    new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "نمره",

                data: scores,

                tension: 0.3,

                fill: false,

                pointRadius: 6,

                pointHoverRadius: 8

            }]

        },


        options: {

            responsive: true,

            scales: {

                y: {

                    beginAtZero: true,

                    suggestedMax: 20

                }

            }

        },


        plugins: [

            {

                id: "showScoreOnPoints",

                afterDatasetsDraw: function(chart) {

                    const ctx =
                        chart.ctx;

                    const dataset =
                        chart.data.datasets[0];

                    const meta =
                        chart.getDatasetMeta(0);


                    ctx.save();

                    ctx.font =
                        "bold 14px Arial";

                    ctx.textAlign =
                        "center";

                    ctx.textBaseline =
                        "bottom";


                    meta.data.forEach(
                        function(point, index) {

                            const value =
                                dataset.data[index];

                            ctx.fillText(
                                value,
                                point.x,
                                point.y - 10
                            );

                        }
                    );


                    ctx.restore();

                }

            }

        ]

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




document.getElementById("question").style.fontFamily = "yol";

document.querySelectorAll(".option").forEach(option => {
    option.style.fontFamily = "yol";
});












// تغییر فونت همه پاراگراف‌ها
