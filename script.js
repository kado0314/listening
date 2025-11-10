// --- 1. 100個の英文リスト（例として15個を記述しています。残りはお客様が追加してください） ---
const SENTENCE_LIST = [
    "The quick brown fox jumps over the lazy dog.",
    "This is an example of a simple sentence.",
    "I need to buy some milk and eggs.",
    "She has been waiting for an hour.",
    "They decided to go to the park together.",
    "Could you please pass me the salt?",
    "We are planning a trip to Kyoto next month.",
    "The train arrived exactly on time.",
    "He works as a programmer in Tokyo.",
    "Learning a new language takes time and effort.",
    "What time does the movie start tonight?",
    "It was a beautiful sunny day.",
    "Please send me the report by tomorrow morning.",
    "Do you have any questions about the project?",
    "I am looking forward to seeing you soon.",
    "Success is not final, failure is not fatal.",
    "Don't cry because it's over, smile because it happened.",
    "Life is what happens when you're busy making other plans.",
    "The best way to predict the future is to create it.",
    "Where there is a will, there is a way.",
    "All our dreams can come true, if we have the courage to pursue them.",
    "The purpose of our lives is to be happy.",
    "Believe you can and you're halfway there.",
    "You only live once, but if you do it right, once is enough.",
    "In the end, it's not the years in your life that count, but the life in your years.",
    "I would like to book a flight to London.",
    "Could you please tell me the way to the nearest station?",
    "We need to discuss the budget for the next quarter.",
    "The project deadline has been extended by one week.",
    "I apologize for the delay in my response.",
    "Let's schedule a meeting for next Tuesday morning.",
    "Do you prefer coffee or tea in the morning?",
    "What is your opinion on the new marketing strategy?",
    "Please confirm your attendance by the end of the day.",
    "I am running a little late, so please start without me.",
    "The weather forecast says it will rain tomorrow.",
    "I had a fantastic dinner with my family last night.",
    "Did you watch the football game yesterday evening?",
    "I usually read a book before going to sleep.",
    "We should try that new restaurant downtown sometime.",
    "How long does it take to get to the airport?",
    "My favorite subject in school was history.",
    "She wore a beautiful dress to the party.",
    "I need to charge my phone before I leave.",
    "Could you help me carry these heavy boxes?",
    "The early bird catches the worm.",
    "Practice makes perfect in every field.",
    "Never put off till tomorrow what you can do today.",
    "A journey of a thousand miles begins with a single step.",
    "Look before you leap into a decision.",
    "Two heads are better than one when solving a problem.",
    "Actions speak louder than words in business.",
    "Every cloud has a silver lining.",
    "Honesty is the best policy for a good relationship.",
    "Time is money, so let's use it wisely.",
    "Please let me know if you require any further assistance.",
    "We are looking for ways to improve efficiency.",
    "The meeting room is on the second floor.",
    "Can we review the key performance indicators now?",
    "I will send you the document via email shortly.",
    "Thank you for your cooperation and support.",
    "This needs to be signed immediately.",
    "We must adhere to the company policy.",
    "How do we measure the success of this campaign?",
    "I will follow up with the team leader.",
    "I feel much better after taking a short break.",
    "The traffic was terrible this morning.",
    "I spent the weekend relaxing at home.",
    "Have you ever traveled to the United States?",
    "I think I left my umbrella on the bus.",
    "What kind of music do you listen to?",
    "Let's meet up at the cafe around three o'clock.",
    "It's important to stay hydrated throughout the day.",
    "I learned how to bake bread yesterday.",
    "Could you repeat that sentence more slowly?",
    "The company announced its annual results yesterday.",
    "We are currently developing a new software application.",
    "Investment in technology is crucial for growth.",
    "The stock market showed a slight recovery.",
    "Our core strength lies in customer service.",
    "We faced several challenges during the initial phase.",
    "A detailed analysis is required before we proceed.",
    "The CEO will give a presentation next week.",
    "We are optimistic about the future of this venture.",
    "Risk management is a top priority for us.",
    "Could you explain the difference between these two products?",
    "I am interested in applying for the sales position.",
    "The training session starts at nine sharp.",
    "We must protect our intellectual property.",
    "How can we minimize potential errors?",
    "This new feature will save us a lot of time.",
    "Let's brainstorm some ideas for the logo.",
    "The budget proposal needs further adjustments.",
    "I need access to the shared drive.",
    "We appreciate your valuable feedback.",
    "The sun is shining brightly today.",
    "I love walking my dog in the morning.",
    "The library opens at nine in the morning.",
    "We celebrated her birthday last Sunday.",
    "What is your plan for the upcoming holidays?",
    "This book is really fascinating to read.",
    "I am trying to learn how to play the guitar.",
    "It is important to maintain a balanced diet.",
    "I'm feeling hungry; let's get some lunch.",
    "Could we reschedule our appointment, please?",
    "The committee will review all applications.",
    "We need to prioritize tasks effectively.",
    "Please ensure all data is accurate.",
    "Innovation is key to staying competitive.",
    "The report is due by the end of the month.",
    "I will take responsibility for this task.",
    "Let's verify the information one more time.",
    "We are confident in achieving our goals.",
    "The decision was made by the board of directors.",
    "This is a matter of great importance.",
    "Success is not final, failure is not fatal.",
    "Don't cry because it's over, smile because it happened.",
    "Life is what happens when you're busy making other plans."
];
// --- 定数とDOM要素の取得 ---
const targetSentenceElement = document.getElementById('targetSentence');
const playButton = document.getElementById('playButton');
const recordButton = document.getElementById('recordButton');
const changeButton = document.getElementById('changeButton');
const recognitionResultElement = document.getElementById('recognitionResult');
const scoreResultElement = document.getElementById('scoreResult');

let TARGET_SENTENCE = ""; // 現在の正解英文を保持する変数

// --- ユーティリティ関数（正規化）---
// テキストから句読点などを削除し、小文字に統一する
function normalizeText(text) {
    return text.toLowerCase().replace(/[.,!?;:'"()]/g, '').trim();
}

// --- 初期化と問題チェンジの関数 ---
function loadNewSentence() {
    // 1. ランダムな英文を選ぶ
    // (SENTENCE_LISTは、このコードの上に定義されている前提です)
    if (SENTENCE_LIST.length === 0) {
        targetSentenceElement.textContent = "問題リストが空です。英文を追加してください。";
        return;
    }
    const randomIndex = Math.floor(Math.random() * SENTENCE_LIST.length);
    TARGET_SENTENCE = SENTENCE_LIST[randomIndex];
    
    // 2. 画面に表示を更新
    targetSentenceElement.textContent = TARGET_SENTENCE;
    
    // 3. 状態をリセット
    recognitionResultElement.textContent = '---';
    scoreResultElement.textContent = '0%';
    
    // 4. ボタンを有効化
    playButton.disabled = false;
    recordButton.disabled = false;
}

// --- 3. スコア化ロジック（単語の一致度） ---
function calculateScore(recognizedText) {
    if (!recognizedText || TARGET_SENTENCE === "") return 0;

    const TARGET_WORDS = normalizeText(TARGET_SENTENCE).split(' ').filter(w => w.length > 0);
    const recognizedWords = normalizeText(recognizedText).split(' ').filter(w => w.length > 0);
    
    let matchedCount = 0;

    // 単語を順番に比較して一致数をカウントする
    for (let i = 0; i < TARGET_WORDS.length; i++) {
        // 認識結果のi番目の単語と正解のi番目の単語が一致するかチェック
        if (i < recognizedWords.length && TARGET_WORDS[i] === recognizedWords[i]) {
             matchedCount++;
        }
    }
    
    // スコア計算: (一致した単語数 / 正解英文の単語数) * 100
    const score = (matchedCount / TARGET_WORDS.length) * 100;

    // 小数点以下を切り捨ててパーセンテージとして返す
    return Math.floor(score);
}

// --- 2. 英文再生 (TTS: Text-to-Speech) ---
playButton.addEventListener('click', () => {
    if (TARGET_SENTENCE === "") return;
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(TARGET_SENTENCE);
        utterance.lang = 'en-US'; // 英語に設定
        window.speechSynthesis.speak(utterance);
    } else {
        alert('お使いのブラウザは音声合成に対応していません。');
    }
});

// --- 3. 復唱の録音と認識 (STT: Speech-to-Text) ---
recordButton.addEventListener('click', () => {
    if (TARGET_SENTENCE === "") return; // 英文がロードされていなければ何もしない

    if (!('webkitSpeechRecognition' in window)) {
        alert('お使いのブラウザは音声認識に対応していません。Google Chromeなどをご利用ください。');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US'; 
    recognition.interimResults = false;
    recognition.continuous = false; 

    // 録音中のUI更新
    recordButton.textContent = '🔴 録音中...（話してください）';
    recordButton.disabled = true;
    playButton.disabled = true;
    changeButton.disabled = true;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        recognitionResultElement.textContent = transcript;
        
        // スコア計算
        const score = calculateScore(transcript);
        scoreResultElement.textContent = `${score}%`;
        
        // 完了後のUIリセット
        recordButton.textContent = '🎙️ 録音開始';
        recordButton.disabled = false;
        playButton.disabled = false;
        changeButton.disabled = false;
    };

    recognition.onerror = (event) => {
        recognitionResultElement.textContent = `認識エラーが発生しました: ${event.error}`;
        scoreResultElement.textContent = '0%';
        
        // エラー後のUIリセット
        recordButton.textContent = '🎙️ 録音開始';
        recordButton.disabled = false;
        playButton.disabled = false;
        changeButton.disabled = false;
    };

    recognition.start();
});

// --- 4. 問題チェンジボタンのイベントリスナー ---
changeButton.addEventListener('click', loadNewSentence);

// --- 5. ページ読み込み時に最初の問題をロード ---
window.onload = loadNewSentence;
