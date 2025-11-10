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
    // ここにあと85個の英文を追加してください
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
function normalizeText(text) {
    return text.toLowerCase().replace(/[.,!?;:'"()]/g, '').trim();
}

// --- 初期化と問題チェンジの関数 ---
function loadNewSentence() {
    // 1. ランダムな英文を選ぶ
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
window.onload = loadNewSentence;// --- 定数とDOM要素の取得 ---
const targetSentenceElement = document.getElementById('targetSentence');
const playButton = document.getElementById('playButton');
const recordButton = document.getElementById('recordButton');
const recognitionResultElement = document.getElementById('recognitionResult');
const scoreResultElement = document.getElementById('scoreResult');

const TARGET_SENTENCE = targetSentenceElement.textContent.trim();
const TARGET_WORDS = normalizeText(TARGET_SENTENCE).split(' ');

// --- ユーティリティ関数（正規化）---
// テキストから句読点を削除し、小文字に統一する
function normalizeText(text) {
    return text.toLowerCase().replace(/[.,!?;:]/g, '').trim();
}

// --- 1. 英文再生 (TTS: Text-to-Speech) ---
playButton.addEventListener('click', () => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(TARGET_SENTENCE);
        utterance.lang = 'en-US'; // 英語に設定
        window.speechSynthesis.speak(utterance);
    } else {
        alert('お使いのブラウザは音声合成に対応していません。');
    }
});

// --- 2. 復唱の録音と認識 (STT: Speech-to-Text) ---
recordButton.addEventListener('click', () => {
    // WebKit Speech Recognition APIの準備 (Chromeなど)
    if (!('webkitSpeechRecognition' in window)) {
        alert('お使いのブラウザは音声認識に対応していません。Google Chromeなどをご利用ください。');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US'; // 英語認識に設定
    recognition.interimResults = false; // 最終結果のみを取得
    recognition.continuous = false; 

    // 録音中であることをユーザーに知らせる
    recordButton.textContent = '🔴 録音中...（話してください）';
    recordButton.disabled = true;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        recognitionResultElement.textContent = transcript;
        
        // スコア計算
        const score = calculateScore(transcript);
        scoreResultElement.textContent = `${score}%`;
        
        // 完了
        recordButton.textContent = '🎙️ 録音開始';
        recordButton.disabled = false;
    };

    recognition.onerror = (event) => {
        recognitionResultElement.textContent = `認識エラー: ${event.error}`;
        scoreResultElement.textContent = '0%';
        recordButton.textContent = '🎙️ 録音開始';
        recordButton.disabled = false;
    };

    recognition.start();
});


// --- 3. スコア化ロジック（単語の一致度） ---
function calculateScore(recognizedText) {
    if (!recognizedText) return 0;

    const recognizedWords = normalizeText(recognizedText).split(' ');
    
    let matchedCount = 0;
    const maxWords = Math.max(TARGET_WORDS.length, recognizedWords.length);

    // 単語を順番に比較して一致数をカウントする
    for (let i = 0; i < TARGET_WORDS.length; i++) {
        // recognizedWordsにその単語が存在するかチェック（順番は問わない簡易チェック）
        // 厳密には、順番も含めた比較（レーベンシュタイン距離）が望ましいですが、ここでは簡易な方法で
        if (i < recognizedWords.length && TARGET_WORDS[i] === recognizedWords[i]) {
             matchedCount++;
        }
    }
    
    // スコア計算: (一致した単語数 / 正解英文の単語数) * 100
    // 認識されたテキストが短すぎたり長すぎたりする場合を考慮し、TARGET_WORDSの長さを基準にします
    const score = (matchedCount / TARGET_WORDS.length) * 100;

    // 小数点以下を切り捨ててパーセンテージとして返す
    return Math.floor(score);
}
